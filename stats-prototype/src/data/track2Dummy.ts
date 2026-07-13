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

export const demographicDistribution = [
  { label: "30대 여성", pct: 28 },
  { label: "20대 여성", pct: 22 },
  { label: "30대 남성", pct: 18 },
  { label: "40대 여성", pct: 17 },
  { label: "20대 남성", pct: 15 },
];

export const segmentTrend = [
  { month: "2월", 단골: 96, 신규: 41 },
  { month: "3월", 단골: 104, 신규: 38 },
  { month: "4월", 단골: 112, 신규: 52 },
  { month: "5월", 단골: 121, 신규: 47 },
  { month: "6월", 단골: 129, 신규: 55 },
  { month: "7월", 단골: 138, 신규: 49 },
];

export const preferredCategory = ["치킨", "후라이드/양념", "순살 옵션"];

export const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대+"] as const;

export const agePreferredProducts: Record<string, { name: string; revenue: number }[]> = {
  "10대": [
    { name: "후라이드치킨", revenue: 245000 },
    { name: "양념치킨", revenue: 189000 },
    { name: "치즈볼", revenue: 152000 },
  ],
  "20대": [
    { name: "양념치킨", revenue: 412000 },
    { name: "후라이드치킨", revenue: 356000 },
    { name: "반반치킨", revenue: 298000 },
  ],
  "30대": [
    { name: "반반치킨", revenue: 523000 },
    { name: "양념치킨", revenue: 467000 },
    { name: "후라이드치킨", revenue: 401000 },
  ],
  "40대": [
    { name: "후라이드치킨", revenue: 388000 },
    { name: "반반치킨", revenue: 344000 },
    { name: "마늘치킨", revenue: 276000 },
  ],
  "50대+": [
    { name: "후라이드치킨", revenue: 298000 },
    { name: "양념치킨", revenue: 234000 },
    { name: "간장치킨", revenue: 198000 },
  ],
};

export const loyalPreferredProducts = [
  { name: "반반치킨", revenue: 812000 },
  { name: "양념치킨", revenue: 745000 },
  { name: "후라이드치킨", revenue: 689000 },
];

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
