import type { WeekdayBar, ChannelRevenue, HourlyBucket, OnlineOfflineRatio } from "./types";

export interface HomeRealtimeMetric {
  value: number;
  vsYesterdayPct: number;
  vsRegionPct: number;
}

export interface HomeWeekdayRevenue {
  label: string;
  revenue: number | null;
  aov: number | null;
  isToday?: boolean;
}

export interface HomeWeeklyTotal {
  value: number;
  vsLastWeekPct: number;
  vsRegionPct: number;
}

export interface HomeLast30 {
  // (v4) POS 전체 주문건수를 분모로 쓰지 않는 HPC 단일소스 절대값 — 정합성 문제로 "POS 대비 비율" 산식 폐기.
  // 고객상세분석이 "지난 주/지난 달" 고정 배치 스냅샷으로 바뀌면서 최근 30일 롤링이 아닌 "지난 달" 고정 기준(필드명은 유지)
  memberOrderCount: number;
  regionAvgMemberOrderCount: number;
  // 딜리버리 점유율은 최근 30일 롤링 매출 기준 그대로 유지 (이번 변경과 무관한 별도 지표)
  deliveryRevenuePct: number;
}

export interface HomeRealtimeData {
  updatedAtLabel: string;
  revenue: HomeRealtimeMetric;
  orders: HomeRealtimeMetric;
  aov: HomeRealtimeMetric;
  weekCumulative: HomeWeekdayRevenue[];
  weekTotal: HomeWeeklyTotal;
  last30: HomeLast30;
}

export interface HomeKpiPeriod {
  periodLabel: string;
  revenue: number;
  revenueRegionBadge: string;
  revenueDeltaBadge?: string; // 전일/전주/전월 대비 — 마감된 기간에서만 존재(진행 중인 현재 기간은 없음)
  orders: number;
  ordersRegionBadge: string;
  ordersDeltaBadge?: string;
  aov: number;
  aovRegionBadge: string;
  aovDeltaBadge?: string;
  // 주간/월간 탭에서만 노출 (data_025/026) — 집계기간 내 경과일 기준 일 평균
  dailyAvgRevenue?: number;
  dailyAvgOrders?: number;
}

export interface HomeTopProduct {
  rank: number;
  name: string;
  orderCount: number;
  revenueSharePct: number;
}

export interface HomeTabData {
  kpiPeriods: HomeKpiPeriod[];
  weekday: WeekdayBar[];
  onlineOffline: OnlineOfflineRatio;
  channelRevenue: ChannelRevenue[];
  topProducts: HomeTopProduct[];
  hourlyOrders: HourlyBucket[];
}

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const CHANNEL_ORDER = ["오프라인", "해피오더", "배민", "쿠팡이츠", "요기요", "땡겨요"];
const HOUR_LABELS = ["06-09", "09-11", "11-13", "13-15", "15-17", "17-19", "19-21"];

// 날짜별 보기는 마감된 과거 기간 + 진행 중인 현재 기간(오늘/이번 주/이번 달)까지 조회 가능.
// 각 탭의 가장 최근 항목(index 0)은 아직 마감되지 않은 진행 중 기간이라 전일/전주/전월 대비 배지가 없고,
// 실시간 수치(홈 화면과 동일 기준)를 사용함. 그 이전 항목들은 모두 마감된 기간으로 대비 배지를 표시함
export const homeDaily: HomeTabData = {
  kpiPeriods: [
    {
      // 진행 중(오늘) — 홈 화면 실시간 수치 재사용, 전일 대비 배지 없음
      periodLabel: "오늘",
      revenue: 1862000,
      revenueRegionBadge: "인근매장 평균 대비 +12%",
      orders: 95,
      ordersRegionBadge: "인근매장 평균 대비 -6%",
      aov: 19600,
      aovRegionBadge: "브랜드 평균 대비 +5%",
    },
    {
      periodLabel: "07/18",
      revenue: 2950000,
      revenueRegionBadge: "인근매장 평균 대비 +6%",
      revenueDeltaBadge: "전일 대비 -13.5%",
      orders: 162,
      ordersRegionBadge: "인근매장 평균 대비 -7%",
      ordersDeltaBadge: "전일 대비 -14.3%",
      aov: 18210,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      aovDeltaBadge: "전일 대비 +0.9%",
    },
    {
      periodLabel: "07/17",
      revenue: 3410000,
      revenueRegionBadge: "인근매장 평균 대비 +14%",
      revenueDeltaBadge: "전일 대비 +22.7%",
      orders: 189,
      ordersRegionBadge: "인근매장 평균 대비 +2%",
      ordersDeltaBadge: "전일 대비 +25.2%",
      aov: 18042,
      aovRegionBadge: "브랜드 평균 대비 -4%",
      aovDeltaBadge: "전일 대비 -0.9%",
    },
    {
      periodLabel: "07/16",
      revenue: 2780000,
      revenueRegionBadge: "인근매장 평균 대비 +2%",
      revenueDeltaBadge: "전일 대비 -8.9%",
      orders: 151,
      ordersRegionBadge: "인근매장 평균 대비 -9%",
      ordersDeltaBadge: "전일 대비 -10.1%",
      aov: 18411,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      aovDeltaBadge: "전일 대비 +1.4%",
    },
    {
      periodLabel: "07/15",
      revenue: 3050000,
      revenueRegionBadge: "인근매장 평균 대비 +8%",
      revenueDeltaBadge: "전일 대비 -15.3%",
      orders: 168,
      ordersRegionBadge: "인근매장 평균 대비 -3%",
      ordersDeltaBadge: "전일 대비 -16.4%",
      aov: 18155,
      aovRegionBadge: "브랜드 평균 대비 -3%",
      aovDeltaBadge: "전일 대비 +1.4%",
    },
    {
      periodLabel: "07/14",
      revenue: 3600000,
      revenueRegionBadge: "인근매장 평균 대비 +19%",
      revenueDeltaBadge: "전일 대비 +24.6%",
      orders: 201,
      ordersRegionBadge: "인근매장 평균 대비 +6%",
      ordersDeltaBadge: "전일 대비 +26.4%",
      aov: 17910,
      aovRegionBadge: "브랜드 평균 대비 -5%",
      aovDeltaBadge: "전일 대비 -1.5%",
    },
    {
      periodLabel: "07/13",
      revenue: 2890000,
      revenueRegionBadge: "인근매장 평균 대비 +4%",
      orders: 159,
      ordersRegionBadge: "인근매장 평균 대비 -6%",
      aov: 18176,
      aovRegionBadge: "브랜드 평균 대비 -2%",
    },
  ],
  weekday: WEEKDAY_LABELS.map((label, i) => ({
    label,
    value: [3050000, 3600000, 2890000, 2780000, 3410000, 2950000, 3240000][i],
    isToday: i === 6,
  })),
  onlineOffline: { online: 42, offline: 58 },
  channelRevenue: [1880000, 620000, 420000, 210000, 90000, 20000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
  topProducts: [
    { rank: 1, name: "후라이드치킨", orderCount: 42, revenueSharePct: 18.5 },
    { rank: 2, name: "양념치킨", orderCount: 35, revenueSharePct: 15.2 },
    { rank: 3, name: "반반치킨", orderCount: 22, revenueSharePct: 9.8 },
  ],
  hourlyOrders: [12, 28, 45, 61, 38, 32, 19].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
};

export const homeWeekly: HomeTabData = {
  kpiPeriods: [
    {
      // 진행 중(이번 주) — 월~수 경과분 누적(홈 weekTotal과 동일 기준), 전주 대비 배지 없음
      periodLabel: "이번 주",
      revenue: 8322000,
      revenueRegionBadge: "인근매장 평균 대비 +9%",
      orders: 454,
      ordersRegionBadge: "인근매장 평균 대비 -5%",
      aov: 18331,
      aovRegionBadge: "브랜드 평균 대비 +4%",
      // 경과일(월/화/수 3일) 기준
      dailyAvgRevenue: 2774000,
      dailyAvgOrders: 151,
    },
    {
      periodLabel: "07/06~07/12",
      revenue: 20150000,
      revenueRegionBadge: "인근매장 평균 대비 +5%",
      revenueDeltaBadge: "전주 대비 +1.8%",
      orders: 1120,
      ordersRegionBadge: "인근매장 평균 대비 -5%",
      ordersDeltaBadge: "전주 대비 +2.3%",
      aov: 17991,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      aovDeltaBadge: "전주 대비 -0.5%",
      dailyAvgRevenue: 2878571,
      dailyAvgOrders: 160,
    },
    {
      periodLabel: "06/28~07/04",
      revenue: 19800000,
      revenueRegionBadge: "인근매장 평균 대비 +3%",
      revenueDeltaBadge: "전주 대비 -5.9%",
      orders: 1095,
      ordersRegionBadge: "인근매장 평균 대비 -6%",
      ordersDeltaBadge: "전주 대비 -4.8%",
      aov: 18082,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      aovDeltaBadge: "전주 대비 -1.2%",
      dailyAvgRevenue: 2828571,
      dailyAvgOrders: 156,
    },
    {
      periodLabel: "06/21~06/27",
      revenue: 21050000,
      revenueRegionBadge: "인근매장 평균 대비 +7%",
      orders: 1150,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      aov: 18304,
      aovRegionBadge: "브랜드 평균 대비 +1%",
      dailyAvgRevenue: 3007143,
      dailyAvgOrders: 164,
    },
  ],
  // 이번 주(가장 최근 주간 기간) 누적, 전일자 마감 기준 — 오늘=수요일 가정으로 월/화/수만 지남 (deliveryDummy.ts와 동일 컨벤션)
  weekday: WEEKDAY_LABELS.map((label, i) => {
    const passed = i <= 2;
    const values = [2980000, 3120000, 2860000];
    return {
      label,
      value: passed ? values[i] : null,
      isToday: i === 2,
    };
  }),
  onlineOffline: { online: 40, offline: 60 },
  channelRevenue: [12700000, 4600000, 2600000, 1300000, 550000, 170000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
  topProducts: [
    { rank: 1, name: "후라이드치킨", orderCount: 268, revenueSharePct: 17.9 },
    { rank: 2, name: "양념치킨", orderCount: 231, revenueSharePct: 15.6 },
    { rank: 3, name: "반반치킨", orderCount: 144, revenueSharePct: 9.1 },
  ],
  // 경과일(월~수) 기준 시간대별 일평균 주문건수
  hourlyOrders: [9, 21, 34, 46, 29, 24, 14].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
};

export const homeMonthly: HomeTabData = {
  kpiPeriods: [
    {
      // 진행 중(이번 달) — 7/19일까지 경과분 누적(요일별 평균 매출 × 경과일수 추정), 전월 대비 배지 없음
      periodLabel: "이번 달",
      revenue: 57300000,
      revenueRegionBadge: "인근매장 평균 대비 +8%",
      orders: 3135,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      aov: 18278,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      // 경과일(7/19일까지, 19일) 기준
      dailyAvgRevenue: 3015789,
      dailyAvgOrders: 165,
    },
    {
      periodLabel: "2026년 6월",
      revenue: 88700000,
      revenueRegionBadge: "인근매장 평균 대비 +4%",
      revenueDeltaBadge: "전월 대비 -1.6%",
      orders: 4890,
      ordersRegionBadge: "인근매장 평균 대비 -5%",
      ordersDeltaBadge: "전월 대비 -1.2%",
      aov: 18139,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      aovDeltaBadge: "전월 대비 -0.4%",
      dailyAvgRevenue: 2956667,
      dailyAvgOrders: 163,
    },
    {
      periodLabel: "2026년 5월",
      revenue: 90150000,
      revenueRegionBadge: "인근매장 평균 대비 +6%",
      orders: 4950,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      aov: 18212,
      aovRegionBadge: "브랜드 평균 대비 +1%",
      dailyAvgRevenue: 2908065,
      dailyAvgOrders: 160,
    },
  ],
  // 해당 월 중 마감된(지나간) 요일 발생분의 평균 매출 (deliveryDummy.ts monthly.weekdayAverage와 동일 개념)
  weekday: [2820000, 2950000, 2710000, 2900000, 3210000, 3460000, 3050000].map((v, i) => ({
    label: WEEKDAY_LABELS[i],
    value: v,
  })),
  onlineOffline: { online: 39, offline: 61 },
  channelRevenue: [54000000, 19800000, 11200000, 5600000, 2400000, 700000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
  topProducts: [
    { rank: 1, name: "후라이드치킨", orderCount: 1120, revenueSharePct: 17.2 },
    { rank: 2, name: "양념치킨", orderCount: 968, revenueSharePct: 14.8 },
    { rank: 3, name: "반반치킨", orderCount: 602, revenueSharePct: 8.6 },
  ],
  // 경과일 기준 시간대별 일평균 주문건수
  hourlyOrders: [10, 24, 38, 51, 32, 27, 16].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
};

// 홈 = 사장님앱 실시간 대시보드 (당일 기준, 탭 없음). 이번 주 오늘 = 수요일 가정 (deliveryDummy.ts weekdayCumulative와 동일 컨벤션)
const CURRENT_WEEKDAY_INDEX = 2;

// 프로토타입 데모용 — 홈 화면의 "케이스 전환" 버튼으로 두 시나리오(주변매장 평균보다 적음/많음)를 보여주기 위한 값 (단위: 건)
export const MEMBER_ORDER_COUNT_BY_CASE = {
  low: 210,
  high: 340,
};

// 매출·객단가는 지역 평균보다 높게, 주문건수는 지역 평균보다 낮게 (매출 우위는 "건수"가 아니라 "단가·전체 볼륨"에서 온다는 인사이트)
export const homeRealtime: HomeRealtimeData = {
  updatedAtLabel: "07/19 14:32 기준",
  revenue: { value: 1862000, vsYesterdayPct: 8.4, vsRegionPct: 12 },
  orders: { value: 95, vsYesterdayPct: 5.1, vsRegionPct: -6 },
  aov: { value: 19600, vsYesterdayPct: 2.9, vsRegionPct: 5 },
  weekCumulative: WEEKDAY_LABELS.map((label, i) => {
    const passed = i <= CURRENT_WEEKDAY_INDEX;
    const revenues = [3120000, 3340000, 1862000];
    const aovs = [17850, 18120, 19600];
    return {
      label,
      revenue: passed ? revenues[i] : null,
      aov: passed ? aovs[i] : null,
      isToday: i === CURRENT_WEEKDAY_INDEX,
    };
  }),
  weekTotal: { value: 3120000 + 3340000 + 1862000, vsLastWeekPct: 6.8, vsRegionPct: 9 },
  last30: {
    memberOrderCount: MEMBER_ORDER_COUNT_BY_CASE.low,
    regionAvgMemberOrderCount: 294,
    deliveryRevenuePct: 29.4,
  },
};
