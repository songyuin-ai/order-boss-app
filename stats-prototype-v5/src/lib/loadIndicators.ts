import { fetchSheetTab, str, strAny, type SheetRow } from "./googleSheet";
import type { Indicator, SourceSystem } from "../data/types";

// 지표 표(우측 데이터 목록)만 구글시트로 관리 — 차트에 찍히는 더미 수치는 연동 대상 아님(각 *Dummy.ts 그대로 사용)
// (v5) 탭 이름·컬럼 구성을 사용자 제공 지표관리 시트(ver_5) 기준으로 맞춤:
// id / 지표명 / 노출화면 / 집계 주기 / 조회 기간 / 원천데이터 / 정의 / 산식 / 제공목적 / 차트 형태
const INDICATORS_TAB = "indicators_seed";

const SOURCE_SYSTEMS: SourceSystem[] = ["HPC", "오더 거래원장", "POS"];

function toSourceSystem(raw: string): SourceSystem {
  const trimmed = raw.trim();
  return (SOURCE_SYSTEMS as string[]).includes(trimmed) ? (trimmed as SourceSystem) : "";
}

// 시트에는 "실시간여부"(Y/N) 컬럼이 없으므로 이 필드는 절대 덮어쓰지 않음 — 내장 기본값(POS/딜리버리 등의 Y/N,
// 특히 POS의 "홈은 실시간·드릴다운은 배치" 같은 뉘앙스)을 그대로 유지해야 하기 때문. DataContext의 병합 시
// 이 함수가 반환하지 않는 필드는 기본 지표값으로 채워짐(전체 교체가 아닌 필드 단위 병합)
function toIndicator(row: SheetRow): (Partial<Indicator> & { id: string }) | null {
  const id = str(row, "id");
  if (!id) return null;
  return {
    id,
    지표명: str(row, "지표명"),
    노출: str(row, "노출화면") || undefined,
    집계주기: str(row, "집계 주기") || undefined,
    조회기간: str(row, "조회 기간") || undefined,
    정의: str(row, "정의"),
    // HPC/오더 거래원장/POS 외 값이 들어오면 빈 값으로 처리(드롭다운 오타 방지)
    원천데이터: toSourceSystem(str(row, "원천데이터")),
    산식: str(row, "산식"),
    제공목적: str(row, "제공목적"),
    // "차트형태"/"차트 형태" 표기 차이를 모두 인식
    차트형태: strAny(row, ["차트형태", "차트 형태"]),
  };
}

export async function loadIndicators(): Promise<Record<string, Partial<Indicator> & { id: string }>> {
  const rows = await fetchSheetTab(INDICATORS_TAB);
  const byId: Record<string, Partial<Indicator> & { id: string }> = {};
  rows.forEach((row) => {
    const indicator = toIndicator(row);
    if (indicator) byId[indicator.id] = indicator;
  });
  return byId;
}
