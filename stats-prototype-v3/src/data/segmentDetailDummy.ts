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
  revenueContributionPct: number; // H: 기간 내 POS 전체 매출 대비 D의 %
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
  posTotalOrders: number; // 기간 내 POS 전체 주문건수 (멤버십 주문 비중 산출용 분모)
  regionAvgMemberOrderPct: number; // 주변매장 평균 멤버십 주문 비중(%), 상단 KPI 비교 배지용
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

// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, SegmentDetailPeriodData> = {
  recent7: {
    all: active("all", { customerCount: 195, orderCount: 241, revenue: 2_957_800, revenueContributionPct: 14.4 }),
    loyal: active("loyal", { customerCount: 71, orderCount: 99, revenue: 1_366_200, revenueContributionPct: 6.7 }),
    new: active("new", { customerCount: 44, orderCount: 46, revenue: 487_600, revenueContributionPct: 2.4 }),
    general: active("general", { customerCount: 80, orderCount: 96, revenue: 1_104_000, revenueContributionPct: 5.4 }),
    dormant: { customerCount: 15, lastPurchaseNote: DORMANT_NOTE },
    posTotalOrders: 1640,
    regionAvgMemberOrderPct: 16.4,
  },
  recent30: {
    all: active("all", { customerCount: 582, orderCount: 1276, revenue: 16_098_200, revenueContributionPct: 17.9 }),
    loyal: active("loyal", { customerCount: 205, orderCount: 738, revenue: 9_963_000, revenueContributionPct: 11.1 }),
    new: active("new", { customerCount: 115, orderCount: 132, revenue: 1_425_600, revenueContributionPct: 1.6 }),
    general: active("general", { customerCount: 262, orderCount: 406, revenue: 4_709_600, revenueContributionPct: 5.2 }),
    dormant: { customerCount: 58, lastPurchaseNote: DORMANT_NOTE },
    posTotalOrders: 7200,
    regionAvgMemberOrderPct: 19.6,
  },
  "2026-07": {
    all: active("all", { customerCount: 601, orderCount: 1352, revenue: 17_212_400, revenueContributionPct: 18.6 }),
    loyal: active("loyal", { customerCount: 218, orderCount: 796, revenue: 10_825_600, revenueContributionPct: 11.7 }),
    new: active("new", { customerCount: 125, orderCount: 148, revenue: 1_613_200, revenueContributionPct: 1.7 }),
    general: active("general", { customerCount: 258, orderCount: 408, revenue: 4_773_600, revenueContributionPct: 5.2 }),
    dormant: { customerCount: 59, lastPurchaseNote: DORMANT_NOTE },
    posTotalOrders: 7392,
    regionAvgMemberOrderPct: 20.1,
  },
  "2026-06": {
    all: active("all", { customerCount: 540, orderCount: 1141, revenue: 14_154_700, revenueContributionPct: 16.0 }),
    loyal: active("loyal", { customerCount: 186, orderCount: 651, revenue: 8_658_300, revenueContributionPct: 9.8 }),
    new: active("new", { customerCount: 102, orderCount: 112, revenue: 1_187_200, revenueContributionPct: 1.3 }),
    general: active("general", { customerCount: 252, orderCount: 378, revenue: 4_309_200, revenueContributionPct: 4.9 }),
    dormant: { customerCount: 60, lastPurchaseNote: DORMANT_NOTE },
    posTotalOrders: 7096,
    regionAvgMemberOrderPct: 18.0,
  },
  "2026-05": {
    all: active("all", { customerCount: 564, orderCount: 1226, revenue: 15_405_000, revenueContributionPct: 17.1 }),
    loyal: active("loyal", { customerCount: 198, orderCount: 709, revenue: 9_536_050, revenueContributionPct: 10.6 }),
    new: active("new", { customerCount: 112, orderCount: 128, revenue: 1_376_000, revenueContributionPct: 1.5 }),
    general: active("general", { customerCount: 254, orderCount: 389, revenue: 4_492_950, revenueContributionPct: 5.0 }),
    dormant: { customerCount: 56, lastPurchaseNote: DORMANT_NOTE },
    posTotalOrders: 7212,
    regionAvgMemberOrderPct: 18.9,
  },
};
