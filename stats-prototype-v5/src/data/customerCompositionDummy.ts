import type { SegmentKey } from "./segmentDetailDummy";

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

export interface SegmentTrendPoint {
  month: string; // 항상 최근 3개월 고정, 조회기간과 무관
  storeCount: number; // 선택된 세그먼트의 우리 매장 인원수
  regionAvgCount: number; // 선택된 세그먼트의 주변매장 평균 인원수
}

// 세그먼트 추이 (최근 3개월) — 4-6절. 선택된 세그먼트 1개만 그리며, 월별 마감(월말) 배치 기준
export const segmentTrend: Record<SegmentKey, SegmentTrendPoint[]> = {
  realRegular: [
    { month: "5월", storeCount: 92, regionAvgCount: 85 },
    { month: "6월", storeCount: 97, regionAvgCount: 89 },
    { month: "7월", storeCount: 101, regionAvgCount: 93 },
  ],
  leavingRegular: [
    { month: "5월", storeCount: 35, regionAvgCount: 30 },
    { month: "6월", storeCount: 38, regionAvgCount: 33 },
    { month: "7월", storeCount: 41, regionAvgCount: 36 },
  ],
  candidate: [
    { month: "5월", storeCount: 61, regionAvgCount: 58 },
    { month: "6월", storeCount: 65, regionAvgCount: 60 },
    { month: "7월", storeCount: 69, regionAvgCount: 64 },
  ],
  occasional: [
    { month: "5월", storeCount: 231, regionAvgCount: 210 },
    { month: "6월", storeCount: 240, regionAvgCount: 220 },
    { month: "7월", storeCount: 249, regionAvgCount: 230 },
  ],
};
