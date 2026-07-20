export interface CustomerDetailPeriodData {
  preferredCategory: string[];
  agePreferredProducts: Record<string, { name: string; revenue: number }[]>;
  loyalPreferredProducts: { name: string; revenue: number }[];
  visitTimeText: string;
  revisitCycle: { value: string; label: string };
}

const AGE_PREFERRED_BASE: Record<string, { name: string; revenue: number }[]> = {
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

function scale(base: Record<string, { name: string; revenue: number }[]>, factor: number) {
  const out: Record<string, { name: string; revenue: number }[]> = {};
  Object.entries(base).forEach(([age, items]) => {
    out[age] = items.map((it) => ({ name: it.name, revenue: Math.round(it.revenue * factor) }));
  });
  return out;
}

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, CustomerDetailPeriodData> = {
  recent7: {
    preferredCategory: ["치킨", "후라이드/양념", "순살 옵션"],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 0.24),
    loyalPreferredProducts: [
      { name: "반반치킨", revenue: 198000 },
      { name: "양념치킨", revenue: 176000 },
      { name: "후라이드치킨", revenue: 162000 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "8.7일", label: "평균 재방문 간격" },
  },
  recent30: {
    preferredCategory: ["치킨", "후라이드/양념", "순살 옵션"],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 1),
    loyalPreferredProducts: [
      { name: "반반치킨", revenue: 812000 },
      { name: "양념치킨", revenue: 745000 },
      { name: "후라이드치킨", revenue: 689000 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "9.2일", label: "평균 재방문 간격" },
  },
  "2026-07": {
    preferredCategory: ["치킨", "후라이드/양념", "순살 옵션"],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 1.05),
    loyalPreferredProducts: [
      { name: "반반치킨", revenue: 852000 },
      { name: "양념치킨", revenue: 781000 },
      { name: "후라이드치킨", revenue: 712000 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "9.0일", label: "평균 재방문 간격" },
  },
  "2026-06": {
    preferredCategory: ["치킨", "후라이드/양념", "볼 사이드"],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 0.98),
    loyalPreferredProducts: [
      { name: "양념치킨", revenue: 768000 },
      { name: "반반치킨", revenue: 734000 },
      { name: "후라이드치킨", revenue: 655000 },
    ],
    visitTimeText: "주 방문시간 오후 6~8시",
    revisitCycle: { value: "9.4일", label: "평균 재방문 간격" },
  },
  "2026-05": {
    preferredCategory: ["치킨", "후라이드/양념", "순살 옵션"],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 1.02),
    loyalPreferredProducts: [
      { name: "반반치킨", revenue: 798000 },
      { name: "양념치킨", revenue: 722000 },
      { name: "후라이드치킨", revenue: 671000 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "9.3일", label: "평균 재방문 간격" },
  },
};
