export type SegmentKey = "realRegular" | "leavingRegular" | "candidate" | "occasional";

export interface SegmentTopEntry {
  name: string;
  pct: number;
}

interface SegmentCommon {
  customerCount: number;
  customerSharePct: number; // 세그먼트 비율 파이차트에 쓰이는 인원 비중(%)
  visitCount: number; // 방문 횟수 (최근 90일, 절대값)
  totalSpend: number; // 총 소비액 (최근 90일, 절대값, 원)
}

export interface SegmentFullDetail extends SegmentCommon {
  aov: number;
  topProducts: SegmentTopEntry[]; // 비율 기준 TOP3
  peakHour: string; // 주 방문 시간대
  demographicTop: string; // 최다 연령×성별 조합
}

export interface SegmentLeavingDetail extends SegmentCommon {
  aov: number;
  cancelRatePct: number;
  lastVisitDaysAgo: number;
  topProducts: SegmentTopEntry[]; // 과거(활동 시기) 기준
  peakHour: string; // 과거(활동 시기) 기준
}

export type SegmentOccasionalDetail = SegmentCommon;

export interface SegmentTotals {
  customerCount: number;
  orderCount: number;
  regionAvgMemberOrderCount: number;
}

export interface SegmentDetailSnapshot {
  totals: SegmentTotals;
  realRegular: SegmentFullDetail;
  leavingRegular: SegmentLeavingDetail;
  candidate: SegmentFullDetail;
  occasional: SegmentOccasionalDetail;
}

// "떠나려는 단골"의 인기상품/시간대는 최근 데이터가 없어 과거(활동 시기) 기준
// G/I(인기상품·인구통계)는 avgOrd 필터 on/off와 무관하게 세그먼트별 선호 성향으로 공통 사용
const TOP_PRODUCTS: Record<"realRegular" | "candidate" | "leavingRegular", SegmentTopEntry[]> = {
  realRegular: [
    { name: "아메리카노", pct: 36 },
    { name: "티라미수", pct: 24 },
    { name: "초코케이크", pct: 18 },
  ],
  candidate: [
    { name: "딸기빙수", pct: 29 },
    { name: "초코케이크", pct: 22 },
    { name: "아메리카노", pct: 20 },
  ],
  leavingRegular: [
    { name: "카페라떼", pct: 33 },
    { name: "티라미수", pct: 21 },
    { name: "초코케이크", pct: 17 },
  ],
};

const DEMOGRAPHIC_TOP: Record<"realRegular" | "candidate", string> = {
  realRegular: "30대 여성",
  candidate: "20대 여성",
};

const PEAK_HOUR: Record<"realRegular" | "candidate" | "leavingRegular", string> = {
  realRegular: "오후 2~4시",
  candidate: "오후 5~7시",
  leavingRegular: "오전 11~1시",
};

// (v5, 2차 개정) 세그먼트 판정 기준(recGrd=최근 21일, ordFre=최근 90일 내 4회)이 고정 절대값으로
// 바뀌면서 방문횟수/총소비액도 비중(%)이 아닌 절대값으로 노출. 관측 기간은 화면 전체의 "최근 30일"과
// 별개로 "최근 90일" 고정 (작업계획서_v5 4-2절)
export const segmentDetail: { default: SegmentDetailSnapshot; avgOrdFiltered: SegmentDetailSnapshot } = {
  default: {
    totals: { customerCount: 460, orderCount: 964, regionAvgMemberOrderCount: 1080 },
    realRegular: {
      customerCount: 101,
      customerSharePct: 22,
      visitCount: 7,
      totalSpend: 147000,
      aov: 21000,
      topProducts: TOP_PRODUCTS.realRegular,
      peakHour: PEAK_HOUR.realRegular,
      demographicTop: DEMOGRAPHIC_TOP.realRegular,
    },
    leavingRegular: {
      customerCount: 41,
      customerSharePct: 9,
      visitCount: 5,
      totalSpend: 127500,
      aov: 25500,
      cancelRatePct: 4.8,
      lastVisitDaysAgo: 46,
      topProducts: TOP_PRODUCTS.leavingRegular,
      peakHour: PEAK_HOUR.leavingRegular,
    },
    candidate: {
      customerCount: 69,
      customerSharePct: 15,
      visitCount: 2,
      totalSpend: 35600,
      aov: 17800,
      topProducts: TOP_PRODUCTS.candidate,
      peakHour: PEAK_HOUR.candidate,
      demographicTop: DEMOGRAPHIC_TOP.candidate,
    },
    occasional: {
      customerCount: 249,
      customerSharePct: 54,
      visitCount: 1,
      totalSpend: 19200,
    },
  },
  // "객단가 높은 손님만 보기" ON — 1회 소비액 상위 20%(avgOrd) 고객만으로 재계산된 값
  avgOrdFiltered: {
    totals: { customerCount: 89, orderCount: 964, regionAvgMemberOrderCount: 1080 },
    realRegular: {
      customerCount: 50,
      customerSharePct: 56,
      visitCount: 7,
      totalSpend: 217000,
      aov: 31000,
      topProducts: TOP_PRODUCTS.realRegular,
      peakHour: PEAK_HOUR.realRegular,
      demographicTop: DEMOGRAPHIC_TOP.realRegular,
    },
    leavingRegular: {
      customerCount: 13,
      customerSharePct: 15,
      visitCount: 5,
      totalSpend: 165000,
      aov: 33000,
      cancelRatePct: 4.2,
      lastVisitDaysAgo: 44,
      topProducts: TOP_PRODUCTS.leavingRegular,
      peakHour: PEAK_HOUR.leavingRegular,
    },
    candidate: {
      customerCount: 16,
      customerSharePct: 18,
      visitCount: 2,
      totalSpend: 57000,
      aov: 28500,
      topProducts: TOP_PRODUCTS.candidate,
      peakHour: PEAK_HOUR.candidate,
      demographicTop: DEMOGRAPHIC_TOP.candidate,
    },
    occasional: {
      // 자주 오지 않지만 올 때마다 많이 쓰는 손님 — 0명이 되지 않게 최소 표본을 남겨 고가치 저빈도 고객 존재를 알림
      customerCount: 10,
      customerSharePct: 11,
      visitCount: 1,
      totalSpend: 29500,
    },
  },
};
