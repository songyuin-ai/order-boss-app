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
