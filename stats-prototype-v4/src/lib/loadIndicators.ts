import { fetchSheetTab, str, type SheetRow } from "./googleSheet";
import type { Indicator, SourceSystem } from "../data/types";

// 지표 표(우측 데이터 목록)만 구글시트로 관리 — 차트에 찍히는 더미 수치는 연동 대상 아님(각 *Dummy.ts 그대로 사용)
const INDICATORS_TAB = "Indicators";

const SOURCE_SYSTEMS: SourceSystem[] = ["HPC", "오더 거래원장", "POS"];

function toSourceSystem(raw: string): SourceSystem {
  const trimmed = raw.trim();
  return (SOURCE_SYSTEMS as string[]).includes(trimmed) ? (trimmed as SourceSystem) : "";
}

function toIndicator(row: SheetRow): Indicator | null {
  const id = str(row, "id");
  if (!id) return null;
  return {
    id,
    지표명: str(row, "지표명"),
    // 시트에서 실수로 비우거나 Y/N 외 값을 적어도 배지가 깨지지 않도록 방어적으로 처리
    실시간여부: str(row, "실시간여부").trim().toUpperCase() === "Y" ? "Y" : "N",
    실시간참고: str(row, "실시간참고") || undefined,
    정의: str(row, "정의"),
    // HPC/오더 거래원장/POS 외 값이 들어오면 빈 값으로 처리(드롭다운 오타 방지)
    원천데이터: toSourceSystem(str(row, "원천데이터")),
    산식: str(row, "산식"),
    제공목적: str(row, "제공목적"),
    차트형태: str(row, "차트형태"),
    참고: str(row, "참고") || undefined,
  };
}

export async function loadIndicators(): Promise<Record<string, Indicator>> {
  const rows = await fetchSheetTab(INDICATORS_TAB);
  const byId: Record<string, Indicator> = {};
  rows.forEach((row) => {
    const indicator = toIndicator(row);
    if (indicator) byId[indicator.id] = indicator;
  });
  return byId;
}
