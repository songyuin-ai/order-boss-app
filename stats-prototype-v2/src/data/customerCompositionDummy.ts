export interface SegmentChip {
  label: string;
  pct: number;
}

export interface CustomerCompositionPeriodData {
  customerComposition: { loyalPct: number; deltaLabel: string; chips: SegmentChip[] };
  demographicDistribution: { label: string; pct: number }[];
}

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, CustomerCompositionPeriodData> = {
  recent7: {
    customerComposition: {
      loyalPct: 34,
      deltaLabel: "전주 대비 +1%p",
      chips: [
        { label: "신규", pct: 21 },
        { label: "단골", pct: 34 },
        { label: "일반", pct: 38 },
        { label: "휴면", pct: 7 },
      ],
    },
    demographicDistribution: [
      { label: "30대 여성", pct: 29 },
      { label: "20대 여성", pct: 23 },
      { label: "30대 남성", pct: 17 },
      { label: "40대 여성", pct: 16 },
      { label: "20대 남성", pct: 15 },
    ],
  },
  recent30: {
    customerComposition: {
      loyalPct: 32,
      deltaLabel: "30일 전 대비 +3%p",
      chips: [
        { label: "신규", pct: 18 },
        { label: "단골", pct: 32 },
        { label: "일반", pct: 41 },
        { label: "휴면", pct: 9 },
      ],
    },
    demographicDistribution: [
      { label: "30대 여성", pct: 28 },
      { label: "20대 여성", pct: 22 },
      { label: "30대 남성", pct: 18 },
      { label: "40대 여성", pct: 17 },
      { label: "20대 남성", pct: 15 },
    ],
  },
  "2026-07": {
    customerComposition: {
      loyalPct: 33,
      deltaLabel: "전월 대비 +2%p",
      chips: [
        { label: "신규", pct: 19 },
        { label: "단골", pct: 33 },
        { label: "일반", pct: 39 },
        { label: "휴면", pct: 9 },
      ],
    },
    demographicDistribution: [
      { label: "30대 여성", pct: 27 },
      { label: "20대 여성", pct: 23 },
      { label: "30대 남성", pct: 18 },
      { label: "40대 여성", pct: 17 },
      { label: "20대 남성", pct: 15 },
    ],
  },
  "2026-06": {
    customerComposition: {
      loyalPct: 31,
      deltaLabel: "전월 대비 -1%p",
      chips: [
        { label: "신규", pct: 17 },
        { label: "단골", pct: 31 },
        { label: "일반", pct: 42 },
        { label: "휴면", pct: 10 },
      ],
    },
    demographicDistribution: [
      { label: "30대 여성", pct: 28 },
      { label: "20대 여성", pct: 21 },
      { label: "30대 남성", pct: 19 },
      { label: "40대 여성", pct: 17 },
      { label: "20대 남성", pct: 15 },
    ],
  },
  "2026-05": {
    customerComposition: {
      loyalPct: 32,
      deltaLabel: "전월 대비 +1%p",
      chips: [
        { label: "신규", pct: 18 },
        { label: "단골", pct: 32 },
        { label: "일반", pct: 41 },
        { label: "휴면", pct: 9 },
      ],
    },
    demographicDistribution: [
      { label: "30대 여성", pct: 27 },
      { label: "20대 여성", pct: 22 },
      { label: "30대 남성", pct: 18 },
      { label: "40대 여성", pct: 18 },
      { label: "20대 남성", pct: 15 },
    ],
  },
};

// 기간 필터와 무관하게 항상 최근 3개월 월별 추이로 고정 표시
export const segmentTrend = [
  { month: "5월", 단골: 121, 신규: 47 },
  { month: "6월", 단골: 129, 신규: 55 },
  { month: "7월", 단골: 138, 신규: 49 },
];
