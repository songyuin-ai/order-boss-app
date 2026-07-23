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
  // 포인트 적립/사용 주문 비율 기준 상세분석 리포트 커버리지 (주문건수 기준 — 손님 수 기준은 미식별 손님을 셀 수 없어 채택하지 않음)
  membershipOrderPct: number;
  membershipRegionAvgPct: number;
  // 딜리버리 점유율 (매출 기준, 포인트 지표와는 별도 섹션·별도 기준)
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
  revenueDeltaBadge?: string; // 전일 대비 — 일간 탭에서만 사용
  orders: number;
  ordersRegionBadge: string;
  ordersDeltaBadge?: string;
  aov: number;
  aovRegionBadge: string;
  aovDeltaBadge?: string;
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

// 날짜별 보기는 전일자 마감 데이터까지만 조회 가능 (실시간 개념 없음 — 홈 화면과 분리된 기준)
export const homeDaily: HomeTabData = {
  kpiPeriods: [
    {
      periodLabel: "07/19",
      revenue: 3240000,
      revenueRegionBadge: "인근매장 평균 대비 +12%",
      revenueDeltaBadge: "전일 대비 +9.8%",
      orders: 178,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      ordersDeltaBadge: "전일 대비 +9.9%",
      aov: 18202,
      aovRegionBadge: "브랜드 평균 대비 -3%",
      aovDeltaBadge: "전일 대비 -0.04%",
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
      periodLabel: "07/13~07/19",
      revenue: 21920000,
      revenueRegionBadge: "인근매장 평균 대비 +9%",
      orders: 1208,
      ordersRegionBadge: "인근매장 평균 대비 -3%",
      aov: 18148,
      aovRegionBadge: "브랜드 평균 대비 -1%",
    },
    {
      periodLabel: "07/06~07/12",
      revenue: 20150000,
      revenueRegionBadge: "인근매장 평균 대비 +5%",
      orders: 1120,
      ordersRegionBadge: "인근매장 평균 대비 -5%",
      aov: 17991,
      aovRegionBadge: "브랜드 평균 대비 -2%",
    },
    {
      periodLabel: "06/28~07/04",
      revenue: 19800000,
      revenueRegionBadge: "인근매장 평균 대비 +3%",
      orders: 1095,
      ordersRegionBadge: "인근매장 평균 대비 -6%",
      aov: 18082,
      aovRegionBadge: "브랜드 평균 대비 -1%",
    },
    {
      periodLabel: "06/21~06/27",
      revenue: 21050000,
      revenueRegionBadge: "인근매장 평균 대비 +7%",
      orders: 1150,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      aov: 18304,
      aovRegionBadge: "브랜드 평균 대비 +1%",
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
      periodLabel: "2026년 7월",
      revenue: 92400000,
      revenueRegionBadge: "인근매장 평균 대비 +8%",
      orders: 5120,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      aov: 18047,
      aovRegionBadge: "브랜드 평균 대비 -2%",
    },
    {
      periodLabel: "2026년 6월",
      revenue: 88700000,
      revenueRegionBadge: "인근매장 평균 대비 +4%",
      orders: 4890,
      ordersRegionBadge: "인근매장 평균 대비 -5%",
      aov: 18139,
      aovRegionBadge: "브랜드 평균 대비 -1%",
    },
    {
      periodLabel: "2026년 5월",
      revenue: 90150000,
      revenueRegionBadge: "인근매장 평균 대비 +6%",
      orders: 4950,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      aov: 18212,
      aovRegionBadge: "브랜드 평균 대비 +1%",
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

// 프로토타입 데모용 — 홈 화면의 "케이스 전환" 버튼으로 두 시나리오(지역 평균보다 낮음/높음)를 보여주기 위한 값
export const MEMBERSHIP_ORDER_PCT_BY_CASE = {
  low: 37.8,
  high: 61.5,
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
    membershipOrderPct: MEMBERSHIP_ORDER_PCT_BY_CASE.low,
    membershipRegionAvgPct: 50,
    deliveryRevenuePct: 29.4,
  },
};
