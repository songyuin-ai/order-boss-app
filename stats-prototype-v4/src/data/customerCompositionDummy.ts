export interface SegmentChip {
  label: string;
  pct: number;
}

export interface CustomerCompositionPeriodData {
  customerComposition: { loyalPct: number; deltaLabel: string; chips: SegmentChip[] };
  demographicDistribution: { label: string; pct: number }[];
}

// 연령/성별 계열별 단골비율·휴면비율 (계열 내 비중, %). 계열 구도는 기간에 따라 크게 변하지 않는다고 가정하고 공통 사용.
// "기타"는 개별 계열이 아닌 소규모 계열들의 합이라 단골/휴면 비율 하이라이트 대상에서 제외.
export const ageGenderRatios: Record<string, { loyalRatio: number; dormantRatio: number } | null> = {
  "30대 여성": { loyalRatio: 44, dormantRatio: 6 },
  "20대 여성": { loyalRatio: 30, dormantRatio: 9 },
  "30대 남성": { loyalRatio: 33, dormantRatio: 11 },
  "40대 여성": { loyalRatio: 41, dormantRatio: 7 },
  "20대 남성": { loyalRatio: 22, dormantRatio: 18 },
  기타: null,
};

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
      { label: "30대 여성", pct: 26 },
      { label: "20대 여성", pct: 21 },
      { label: "30대 남성", pct: 15 },
      { label: "40대 여성", pct: 14 },
      { label: "20대 남성", pct: 14 },
      { label: "기타", pct: 10 },
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
      { label: "30대 여성", pct: 25 },
      { label: "20대 여성", pct: 20 },
      { label: "30대 남성", pct: 16 },
      { label: "40대 여성", pct: 15 },
      { label: "20대 남성", pct: 14 },
      { label: "기타", pct: 10 },
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
      { label: "30대 여성", pct: 24 },
      { label: "20대 여성", pct: 21 },
      { label: "30대 남성", pct: 16 },
      { label: "40대 여성", pct: 15 },
      { label: "20대 남성", pct: 14 },
      { label: "기타", pct: 10 },
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
      { label: "30대 여성", pct: 25 },
      { label: "20대 여성", pct: 19 },
      { label: "30대 남성", pct: 17 },
      { label: "40대 여성", pct: 15 },
      { label: "20대 남성", pct: 14 },
      { label: "기타", pct: 10 },
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
      { label: "30대 여성", pct: 24 },
      { label: "20대 여성", pct: 20 },
      { label: "30대 남성", pct: 16 },
      { label: "40대 여성", pct: 16 },
      { label: "20대 남성", pct: 14 },
      { label: "기타", pct: 10 },
    ],
  },
};

// 기간 필터와 무관하게 항상 최근 3개월 월별 추이로 고정 표시. regionAvg는 주변매장 평균 비교값(더미).
export const segmentTrend = [
  { month: "5월", 단골: 121, 신규: 47, regionAvgLoyal: 108, regionAvgNew: 41 },
  { month: "6월", 단골: 129, 신규: 55, regionAvgLoyal: 112, regionAvgNew: 44 },
  { month: "7월", 단골: 138, 신규: 49, regionAvgLoyal: 115, regionAvgNew: 43 },
];
