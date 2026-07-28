export type PeriodSelection = { mode: "recent7" } | { mode: "recent30" } | { mode: "monthly"; month: string };

// 프로토타입 기준 "오늘" (딜리버리/POS 더미데이터와 맞춘 고정 앵커 날짜)
const TODAY = new Date(2026, 6, 19);

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const w = WEEKDAY_KO[d.getDay()];
  return `${y}. ${m}. ${day} (${w})`;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

export function recentRangeLabel(days: number): string {
  const start = addDays(TODAY, -(days - 1));
  return `${fmt(start)} ~ ${fmt(TODAY)}`;
}

export interface MonthOption {
  key: string; // "2026-07"
  label: string; // "2026년 7월"
}

// 최근 3개월(이번 달 포함)만 선택 가능
export const MONTH_OPTIONS: MonthOption[] = [0, 1, 2].map((back) => {
  const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - back, 1);
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return { key, label: `${d.getFullYear()}년 ${d.getMonth() + 1}월` };
});

export function periodKey(sel: PeriodSelection): string {
  return sel.mode === "monthly" ? sel.month : sel.mode;
}

export function periodDefLabel(sel: PeriodSelection): string {
  if (sel.mode === "recent7") return "최근 7일";
  if (sel.mode === "recent30") return "최근 30일";
  return MONTH_OPTIONS.find((m) => m.key === sel.month)?.label ?? "선택 월";
}

export const DEFAULT_PERIOD: PeriodSelection = { mode: "recent30" };
