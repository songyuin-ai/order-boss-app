export interface DemographicSlice {
  label: string;
  pct: number;
}

export interface CustomerCompositionSnapshot {
  demographicDistribution: DemographicSlice[];
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

// (v5) 조회기간 탭(지난 주/지난 달) 폐기, "최근 30일" 고정 배치 스냅샷 하나만 사용
export const customerComposition: CustomerCompositionSnapshot = {
  demographicDistribution: [
    { label: "30대 여성", pct: 25 },
    { label: "20대 여성", pct: 19 },
    { label: "30대 남성", pct: 17 },
    { label: "40대 여성", pct: 15 },
    { label: "20대 남성", pct: 14 },
    { label: "기타", pct: 10 },
  ],
};

