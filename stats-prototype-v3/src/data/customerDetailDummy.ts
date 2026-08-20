export type GenderFilter = "all" | "male" | "female";

export interface CustomerDetailPeriodData {
  agePreferredProductsByGender: Record<GenderFilter, Record<string, { name: string; orders: number }[]>>;
  revisitCycle: { value: string; label: string };
}

const AGE_PREFERRED_BASE: Record<GenderFilter, Record<string, { name: string; orders: number }[]>> = {
  all: {
    "10대": [
      { name: "딸기빙수", orders: 14 },
      { name: "초코케이크", orders: 10 },
      { name: "크로플", orders: 8 },
    ],
    "20대": [
      { name: "아메리카노", orders: 23 },
      { name: "딸기빙수", orders: 20 },
      { name: "초코케이크", orders: 17 },
    ],
    "30대": [
      { name: "아메리카노", orders: 29 },
      { name: "카페라떼", orders: 26 },
      { name: "초코케이크", orders: 22 },
    ],
    "40대": [
      { name: "아메리카노", orders: 22 },
      { name: "티라미수", orders: 19 },
      { name: "카페라떼", orders: 15 },
    ],
    "50대+": [
      { name: "아메리카노", orders: 17 },
      { name: "카페라떼", orders: 13 },
      { name: "스콘", orders: 11 },
    ],
  },
  male: {
    "10대": [
      { name: "딸기빙수", orders: 9 },
      { name: "소프트아이스크림", orders: 7 },
      { name: "초코케이크", orders: 5 },
    ],
    "20대": [
      { name: "아메리카노", orders: 15 },
      { name: "딸기빙수", orders: 11 },
      { name: "크로플", orders: 9 },
    ],
    "30대": [
      { name: "아메리카노", orders: 18 },
      { name: "카페라떼", orders: 14 },
      { name: "초코케이크", orders: 12 },
    ],
    "40대": [
      { name: "아메리카노", orders: 14 },
      { name: "카페라떼", orders: 11 },
      { name: "티라미수", orders: 8 },
    ],
    "50대+": [
      { name: "아메리카노", orders: 11 },
      { name: "카페라떼", orders: 8 },
      { name: "스콘", orders: 6 },
    ],
  },
  female: {
    "10대": [
      { name: "딸기빙수", orders: 13 },
      { name: "초코케이크", orders: 9 },
      { name: "마카롱", orders: 7 },
    ],
    "20대": [
      { name: "아메리카노", orders: 17 },
      { name: "딸기빙수", orders: 15 },
      { name: "초코케이크", orders: 13 },
    ],
    "30대": [
      { name: "카페라떼", orders: 19 },
      { name: "초코케이크", orders: 16 },
      { name: "아메리카노", orders: 15 },
    ],
    "40대": [
      { name: "티라미수", orders: 14 },
      { name: "아메리카노", orders: 12 },
      { name: "카페라떼", orders: 10 },
    ],
    "50대+": [
      { name: "아메리카노", orders: 9 },
      { name: "스콘", orders: 7 },
      { name: "카페라떼", orders: 6 },
    ],
  },
};

function scale(
  base: Record<GenderFilter, Record<string, { name: string; orders: number }[]>>,
  factor: number
): Record<GenderFilter, Record<string, { name: string; orders: number }[]>> {
  const out = {} as Record<GenderFilter, Record<string, { name: string; orders: number }[]>>;
  (Object.entries(base) as [GenderFilter, Record<string, { name: string; orders: number }[]>][]).forEach(
    ([gender, ageMap]) => {
      const scaledAgeMap: Record<string, { name: string; orders: number }[]> = {};
      Object.entries(ageMap).forEach(([age, items]) => {
        scaledAgeMap[age] = items.map((it) => ({ name: it.name, orders: Math.max(1, Math.round(it.orders * factor)) }));
      });
      out[gender] = scaledAgeMap;
    }
  );
  return out;
}

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, CustomerDetailPeriodData> = {
  recent7: {
    agePreferredProductsByGender: scale(AGE_PREFERRED_BASE, 0.24),
    revisitCycle: { value: "8.7일", label: "평균 재방문 간격" },
  },
  recent30: {
    agePreferredProductsByGender: scale(AGE_PREFERRED_BASE, 1),
    revisitCycle: { value: "9.2일", label: "평균 재방문 간격" },
  },
  "2026-07": {
    agePreferredProductsByGender: scale(AGE_PREFERRED_BASE, 1.05),
    revisitCycle: { value: "9.0일", label: "평균 재방문 간격" },
  },
  "2026-06": {
    agePreferredProductsByGender: scale(AGE_PREFERRED_BASE, 0.98),
    revisitCycle: { value: "9.4일", label: "평균 재방문 간격" },
  },
  "2026-05": {
    agePreferredProductsByGender: scale(AGE_PREFERRED_BASE, 1.02),
    revisitCycle: { value: "9.3일", label: "평균 재방문 간격" },
  },
};
