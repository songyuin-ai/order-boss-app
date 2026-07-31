// 구글시트 seed용 CSV를 실제 코드 값에서 뽑아내는 1회성 스크립트 (npx tsx scripts/exportIndicatorsCsv.ts)
import { posIndicators } from "../src/data/posIndicators";
import { homeIndicators, homeRealtimeIndicators } from "../src/data/homeIndicators";
import { deliveryIndicators } from "../src/data/deliveryIndicators";
import { customerCompositionIndicators } from "../src/data/customerCompositionIndicators";
import { customerDetailIndicators } from "../src/data/customerDetailIndicators";
import { segmentDetailIndicators } from "../src/data/segmentDetailIndicators";
import { membershipIndicators } from "../src/data/membershipIndicators";
import { kpiIndicators } from "../src/data/kpiIndicators";
import type { Indicator } from "../src/data/types";

const maps: Record<string, Indicator>[] = [
  posIndicators,
  homeIndicators,
  homeRealtimeIndicators,
  deliveryIndicators,
  customerCompositionIndicators,
  customerDetailIndicators,
  segmentDetailIndicators,
  membershipIndicators,
  kpiIndicators,
];

const byId = new Map<string, Indicator>();
maps.forEach((map) => {
  Object.values(map).forEach((ind) => {
    byId.set(ind.id, ind);
  });
});

const rows = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

const HEADERS = ["id", "지표명", "실시간여부", "실시간참고", "정의", "원천데이터", "산식", "제공목적", "차트형태", "참고"];

function csvCell(value: string): string {
  const v = value ?? "";
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

const lines = [HEADERS.join(",")];
rows.forEach((r) => {
  lines.push(
    [
      r.id,
      r.지표명,
      r.실시간여부,
      r.실시간참고 ?? "",
      r.정의,
      "", // 원천데이터(HPC/오더 거래원장/POS 중 택1) — 요청대로 비움
      "", // 산식 — 요청대로 비움
      r.제공목적,
      r.차트형태,
      r.id === "data_027" ? r.참고 ?? "" : "", // 참고 — data_027(세그먼트 정의)만 기존 내용 유지, 나머지는 비움
    ]
      .map(csvCell)
      .join(",")
  );
});

console.log(lines.join("\n"));
console.error(`총 ${rows.length}개 행 생성`);
