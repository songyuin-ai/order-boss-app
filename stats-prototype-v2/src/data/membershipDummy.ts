export interface MembershipPeriodData {
  hValue: { pct: number; deltaLabel: string };
  segmentContribution: { segment: string; revenueShare: number; aov: number }[];
  membershipRevenue: { memberRevenue: number; totalRevenue: number; pct: number; deltaLabel: string };
}

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, MembershipPeriodData> = {
  recent7: {
    hValue: { pct: 132, deltaLabel: "전주 대비 +4%p" },
    segmentContribution: [
      { segment: "신규", revenueShare: 14, aov: 15400 },
      { segment: "단골", revenueShare: 52, aov: 21600 },
      { segment: "일반", revenueShare: 27, aov: 16100 },
      { segment: "휴면", revenueShare: 7, aov: 12700 },
    ],
    membershipRevenue: { memberRevenue: 7800000, totalRevenue: 20500000, pct: 38.0, deltaLabel: "전주 대비 +1.2%p" },
  },
  recent30: {
    hValue: { pct: 128, deltaLabel: "30일 전 대비 +6%p" },
    segmentContribution: [
      { segment: "신규", revenueShare: 12, aov: 15200 },
      { segment: "단골", revenueShare: 54, aov: 21800 },
      { segment: "일반", revenueShare: 28, aov: 16300 },
      { segment: "휴면", revenueShare: 6, aov: 12900 },
    ],
    membershipRevenue: { memberRevenue: 34000000, totalRevenue: 90000000, pct: 37.8, deltaLabel: "30일 전 대비 +2.1%p" },
  },
  "2026-07": {
    hValue: { pct: 130, deltaLabel: "전월 대비 +3%p" },
    segmentContribution: [
      { segment: "신규", revenueShare: 13, aov: 15300 },
      { segment: "단골", revenueShare: 53, aov: 21700 },
      { segment: "일반", revenueShare: 27, aov: 16200 },
      { segment: "휴면", revenueShare: 7, aov: 12800 },
    ],
    membershipRevenue: { memberRevenue: 35200000, totalRevenue: 92400000, pct: 38.1, deltaLabel: "전월 대비 +1.8%p" },
  },
  "2026-06": {
    hValue: { pct: 126, deltaLabel: "전월 대비 -2%p" },
    segmentContribution: [
      { segment: "신규", revenueShare: 11, aov: 15100 },
      { segment: "단골", revenueShare: 55, aov: 21900 },
      { segment: "일반", revenueShare: 28, aov: 16400 },
      { segment: "휴면", revenueShare: 6, aov: 12900 },
    ],
    membershipRevenue: { memberRevenue: 33100000, totalRevenue: 88700000, pct: 37.3, deltaLabel: "전월 대비 -0.5%p" },
  },
  "2026-05": {
    hValue: { pct: 128, deltaLabel: "전월 대비 +1%p" },
    segmentContribution: [
      { segment: "신규", revenueShare: 12, aov: 15200 },
      { segment: "단골", revenueShare: 54, aov: 21800 },
      { segment: "일반", revenueShare: 28, aov: 16300 },
      { segment: "휴면", revenueShare: 6, aov: 12900 },
    ],
    membershipRevenue: { memberRevenue: 34200000, totalRevenue: 90150000, pct: 37.9, deltaLabel: "전월 대비 +0.9%p" },
  },
};
