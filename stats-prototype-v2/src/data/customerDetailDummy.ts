export interface CategoryShare {
  name: string;
  pct: number;
}

export interface CustomerDetailPeriodData {
  preferredCategory: CategoryShare[];
  agePreferredProducts: Record<string, { name: string; orders: number }[]>;
  loyalPreferredProducts: { name: string; orders: number }[];
  visitTimeText: string;
  revisitCycle: { value: string; label: string };
}

const AGE_PREFERRED_BASE: Record<string, { name: string; orders: number }[]> = {
  "10대": [
    { name: "후라이드치킨", orders: 14 },
    { name: "양념치킨", orders: 10 },
    { name: "치즈볼", orders: 8 },
  ],
  "20대": [
    { name: "양념치킨", orders: 23 },
    { name: "후라이드치킨", orders: 20 },
    { name: "반반치킨", orders: 17 },
  ],
  "30대": [
    { name: "반반치킨", orders: 29 },
    { name: "양념치킨", orders: 26 },
    { name: "후라이드치킨", orders: 22 },
  ],
  "40대": [
    { name: "후라이드치킨", orders: 22 },
    { name: "반반치킨", orders: 19 },
    { name: "마늘치킨", orders: 15 },
  ],
  "50대+": [
    { name: "후라이드치킨", orders: 17 },
    { name: "양념치킨", orders: 13 },
    { name: "간장치킨", orders: 11 },
  ],
};

function scale(base: Record<string, { name: string; orders: number }[]>, factor: number) {
  const out: Record<string, { name: string; orders: number }[]> = {};
  Object.entries(base).forEach(([age, items]) => {
    out[age] = items.map((it) => ({ name: it.name, orders: Math.max(1, Math.round(it.orders * factor)) }));
  });
  return out;
}

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, CustomerDetailPeriodData> = {
  recent7: {
    preferredCategory: [
      { name: "치킨", pct: 44 },
      { name: "사이드", pct: 19 },
      { name: "음료", pct: 8 },
    ],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 0.24),
    loyalPreferredProducts: [
      { name: "반반치킨", orders: 11 },
      { name: "양념치킨", orders: 10 },
      { name: "후라이드치킨", orders: 9 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "8.7일", label: "평균 재방문 간격" },
  },
  recent30: {
    preferredCategory: [
      { name: "치킨", pct: 42 },
      { name: "사이드", pct: 18 },
      { name: "음료", pct: 9 },
    ],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 1),
    loyalPreferredProducts: [
      { name: "반반치킨", orders: 45 },
      { name: "양념치킨", orders: 41 },
      { name: "후라이드치킨", orders: 38 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "9.2일", label: "평균 재방문 간격" },
  },
  "2026-07": {
    preferredCategory: [
      { name: "치킨", pct: 43 },
      { name: "사이드", pct: 17 },
      { name: "음료", pct: 9 },
    ],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 1.05),
    loyalPreferredProducts: [
      { name: "반반치킨", orders: 47 },
      { name: "양념치킨", orders: 43 },
      { name: "후라이드치킨", orders: 40 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "9.0일", label: "평균 재방문 간격" },
  },
  "2026-06": {
    preferredCategory: [
      { name: "치킨", pct: 40 },
      { name: "사이드", pct: 20 },
      { name: "음료", pct: 8 },
    ],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 0.98),
    loyalPreferredProducts: [
      { name: "양념치킨", orders: 43 },
      { name: "반반치킨", orders: 41 },
      { name: "후라이드치킨", orders: 36 },
    ],
    visitTimeText: "주 방문시간 오후 6~8시",
    revisitCycle: { value: "9.4일", label: "평균 재방문 간격" },
  },
  "2026-05": {
    preferredCategory: [
      { name: "치킨", pct: 42 },
      { name: "사이드", pct: 18 },
      { name: "음료", pct: 9 },
    ],
    agePreferredProducts: scale(AGE_PREFERRED_BASE, 1.02),
    loyalPreferredProducts: [
      { name: "반반치킨", orders: 44 },
      { name: "양념치킨", orders: 40 },
      { name: "후라이드치킨", orders: 37 },
    ],
    visitTimeText: "주 방문시간 오후 3~5시",
    revisitCycle: { value: "9.3일", label: "평균 재방문 간격" },
  },
};
