export interface MembershipPeriodData {
  hValue: { pct: number; deltaLabel: string };
}

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, MembershipPeriodData> = {
  recent7: { hValue: { pct: 132, deltaLabel: "전주 대비 +4%p" } },
  recent30: { hValue: { pct: 128, deltaLabel: "30일 전 대비 +6%p" } },
  "2026-07": { hValue: { pct: 130, deltaLabel: "전월 대비 +3%p" } },
  "2026-06": { hValue: { pct: 126, deltaLabel: "전월 대비 -2%p" } },
  "2026-05": { hValue: { pct: 128, deltaLabel: "전월 대비 +1%p" } },
};
