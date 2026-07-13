export interface SegmentChip {
  label: string;
  pct: number;
}

export const customerComposition = {
  loyalPct: 32,
  deltaLabel: "30일 전 대비 +3%p",
  chips: [
    { label: "신규", pct: 18 },
    { label: "단골", pct: 32 },
    { label: "일반", pct: 41 },
    { label: "휴면", pct: 9 },
  ] as SegmentChip[],
};

export const segmentTrend = [
  { month: "2월", 단골: 96, 신규: 41 },
  { month: "3월", 단골: 104, 신규: 38 },
  { month: "4월", 단골: 112, 신규: 52 },
  { month: "5월", 단골: 121, 신규: 47 },
  { month: "6월", 단골: 129, 신규: 55 },
  { month: "7월", 단골: 138, 신규: 49 },
];

export const preferredCategory = ["치킨", "후라이드/양념", "순살 옵션"];

export const visitTimeText = "주 방문시간 오후 3~5시";

export const revisitCycle = { value: "9.2일", label: "평균 재방문 간격" };

export const hValue = { pct: 128, deltaLabel: "전월 대비 +6%p" };

export const segmentContribution = [
  { segment: "신규", revenueShare: 12, aov: 15200 },
  { segment: "단골", revenueShare: 54, aov: 21800 },
  { segment: "일반", revenueShare: 28, aov: 16300 },
  { segment: "휴면", revenueShare: 6, aov: 12900 },
];

export const gcrmCompare = {
  metric: "단골 비중",
  ours: "32%",
  nearby: "24%",
  secondaryMetric: "H값",
  oursSecondary: "128%",
  nearbySecondary: "96%",
};
