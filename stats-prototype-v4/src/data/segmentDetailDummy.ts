export type SegmentKey = "all" | "loyal" | "new" | "general" | "dormant";

export interface SegmentTopEntry {
  name: string;
  pct: number;
}

export interface ActiveSegmentDetail {
  customerCount: number; // B: 기간 내 세그먼트 유니크 고객 수
  orderCount: number; // C: 기간 내 세그먼트 주문건수 total
  revenue: number; // D: 기간 내 세그먼트 매출 total (원)
  topCategories: SegmentTopEntry[]; // G: 주문수 기준 TOP3 카테고리 (3% 이내 제외)
  demographicTop3: SegmentTopEntry[]; // I: 연령/성별 TOP3 (10% 이내 제외)
}

export interface DormantSegmentDetail {
  customerCount: number; // B
  lastPurchaseNote: string;
}

export interface SegmentDetailPeriodData {
  all: ActiveSegmentDetail;
  loyal: ActiveSegmentDetail;
  new: ActiveSegmentDetail;
  general: ActiveSegmentDetail;
  dormant: DormantSegmentDetail;
  // (v4) POS 전체 주문건수를 분모로 쓰던 필드(posTotalOrders/regionAvgMemberOrderPct)는
  // 정합성 문제로 제거. 주변매장 비교도 HPC 절대값(적립·사용 주문건수)끼리만 비교
  regionAvgMemberOrderCount: number; // 주변매장 평균 적립·사용 주문건수(HPC 절대값), 상단 KPI 비교 배지용
}

// G/I는 세그먼트별 선호 성향으로 기간에 따라 크게 흔들리지 않는 값이라 가정하고 전 기간 공통 사용
const TOP_CATEGORIES: Record<"all" | "loyal" | "new" | "general", SegmentTopEntry[]> = {
  all: [
    { name: "커피/음료", pct: 34 },
    { name: "디저트", pct: 24 },
    { name: "케이크", pct: 18 },
  ],
  loyal: [
    { name: "커피/음료", pct: 38 },
    { name: "디저트", pct: 27 },
    { name: "케이크", pct: 20 },
  ],
  new: [
    { name: "빙수/아이스크림", pct: 30 },
    { name: "케이크", pct: 24 },
    { name: "커피/음료", pct: 22 },
  ],
  general: [
    { name: "커피/음료", pct: 30 },
    { name: "디저트", pct: 22 },
    { name: "빙수/아이스크림", pct: 20 },
  ],
};

const DEMOGRAPHIC_TOP3: Record<"all" | "loyal" | "new" | "general", SegmentTopEntry[]> = {
  all: [
    { name: "30대 여성", pct: 26 },
    { name: "20대 여성", pct: 21 },
    { name: "30대 남성", pct: 16 },
  ],
  loyal: [
    { name: "30대 여성", pct: 30 },
    { name: "40대 여성", pct: 19 },
    { name: "30대 남성", pct: 17 },
  ],
  new: [
    { name: "20대 여성", pct: 27 },
    { name: "20대 남성", pct: 19 },
    { name: "30대 여성", pct: 15 },
  ],
  general: [
    { name: "30대 여성", pct: 24 },
    { name: "20대 여성", pct: 20 },
    { name: "40대 여성", pct: 14 },
  ],
};

const DORMANT_NOTE = "마지막 구매시점이 60일을 넘었어요";

function active(segment: "all" | "loyal" | "new" | "general", base: Omit<ActiveSegmentDetail, "topCategories" | "demographicTop3">): ActiveSegmentDetail {
  return { ...base, topCategories: TOP_CATEGORIES[segment], demographicTop3: DEMOGRAPHIC_TOP3[segment] };
}

// 기간 탭(지난 주 / 지난 달, 고정 스냅샷)별 데이터. 배치 잡이 마감된 주/월에 대해 한 번만 계산해두는 값이라 가정
export const byPeriod: Record<string, SegmentDetailPeriodData> = {
  lastWeek: {
    all: active("all", { customerCount: 195, orderCount: 241, revenue: 2_957_800 }),
    loyal: active("loyal", { customerCount: 71, orderCount: 99, revenue: 1_366_200 }),
    new: active("new", { customerCount: 44, orderCount: 46, revenue: 487_600 }),
    general: active("general", { customerCount: 80, orderCount: 96, revenue: 1_104_000 }),
    dormant: { customerCount: 15, lastPurchaseNote: DORMANT_NOTE },
    regionAvgMemberOrderCount: 269,
  },
  lastMonth: {
    all: active("all", { customerCount: 540, orderCount: 1141, revenue: 14_154_700 }),
    loyal: active("loyal", { customerCount: 186, orderCount: 651, revenue: 8_658_300 }),
    new: active("new", { customerCount: 102, orderCount: 112, revenue: 1_187_200 }),
    general: active("general", { customerCount: 252, orderCount: 378, revenue: 4_309_200 }),
    dormant: { customerCount: 60, lastPurchaseNote: DORMANT_NOTE },
    regionAvgMemberOrderCount: 1277,
  },
};
