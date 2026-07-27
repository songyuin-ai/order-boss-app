export interface MembershipPeriodData {
  hValue: { pct: number; deltaLabel: string };
  membershipRevenue: { memberRevenue: number; totalRevenue: number; pct: number; deltaLabel: string };
}

// membershipRevenue.memberRevenue/pct는 segmentDetailDummy(단골+신규+일반 D 합계) 기준과 일치시킨 값
// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, MembershipPeriodData> = {
  recent7: {
    hValue: { pct: 132, deltaLabel: "전주 대비 +4%p" },
    membershipRevenue: { memberRevenue: 2957800, totalRevenue: 20500000, pct: 14.4, deltaLabel: "전주 대비 +0.9%p" },
  },
  recent30: {
    hValue: { pct: 128, deltaLabel: "30일 전 대비 +6%p" },
    membershipRevenue: { memberRevenue: 16098200, totalRevenue: 90000000, pct: 17.9, deltaLabel: "30일 전 대비 +1.2%p" },
  },
  "2026-07": {
    hValue: { pct: 130, deltaLabel: "전월 대비 +3%p" },
    membershipRevenue: { memberRevenue: 17212400, totalRevenue: 92400000, pct: 18.6, deltaLabel: "전월 대비 +2.6%p" },
  },
  "2026-06": {
    hValue: { pct: 126, deltaLabel: "전월 대비 -2%p" },
    membershipRevenue: { memberRevenue: 14154700, totalRevenue: 88700000, pct: 16.0, deltaLabel: "전월 대비 -1.1%p" },
  },
  "2026-05": {
    hValue: { pct: 128, deltaLabel: "전월 대비 +1%p" },
    membershipRevenue: { memberRevenue: 15405000, totalRevenue: 90150000, pct: 17.1, deltaLabel: "전월 대비 +0.6%p" },
  },
};
