export type GenderFilter = "all" | "male" | "female";

export interface RepurchaseRankEntry {
  rank: number;
  name: string;
  repurchaseRatePct: number;
}

// (v5) 조회기간 탭(지난 주/지난 달) 폐기, "최근 30일" 고정 배치 스냅샷 하나만 사용
export const agePreferredProductsByGender: Record<GenderFilter, Record<string, { name: string; orders: number }[]>> = {
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

// 상품별 재구매율 = (기간 내 해당 상품 2회 이상 구매 고객 수) ÷ (기간 내 해당 상품 1회 이상 구매 고객 수) × 100
export const repurchaseTop5: RepurchaseRankEntry[] = [
  { rank: 1, name: "아메리카노", repurchaseRatePct: 42.3 },
  { rank: 2, name: "카페라떼", repurchaseRatePct: 38.1 },
  { rank: 3, name: "딸기빙수", repurchaseRatePct: 29.7 },
  { rank: 4, name: "초코케이크", repurchaseRatePct: 24.5 },
  { rank: 5, name: "크로플", repurchaseRatePct: 21.2 },
];
