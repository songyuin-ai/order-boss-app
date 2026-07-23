import type { WeekdayBar, ChannelRevenue, OnlineOfflineRatio } from "./types";

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

export interface HourlyBucketNullable {
  label: string;
  value: number | null;
}

export interface WeekdayHourlyGroup {
  day: string;
  isToday?: boolean;
  hourly: HourlyBucketNullable[];
}

export interface HomeLast30 {
  // 포인트 적립/사용 손님 비율 기준 상세분석 리포트 커버리지 (손님 수 기준, 매출액 아님)
  membershipCustomerPct: number;
  membershipRegionAvgPct: number;
  // 딜리버리 점유율 (매출 기준, 포인트 지표와는 별도 섹션·별도 기준)
  deliveryRevenueAmount: number;
  deliveryRevenuePct: number;
}

export interface HomeRealtimeData {
  updatedAtLabel: string;
  revenue: HomeRealtimeMetric;
  orders: HomeRealtimeMetric;
  aov: HomeRealtimeMetric;
  weekCumulative: HomeWeekdayRevenue[];
  weekTotal: HomeWeeklyTotal;
  weekdayHourly: WeekdayHourlyGroup[];
  last30: HomeLast30;
}

export interface HomeKpiPeriod {
  periodLabel: string;
  revenue: number;
  revenueComparisonBadge: string;
  orders: number;
  aov: number;
  aovComparisonBadge?: string;
  liveRevenue?: number;
  liveOrders?: number;
}

export interface HomeTabData {
  kpiPeriods: HomeKpiPeriod[];
  weekday: WeekdayBar[];
  onlineOffline: OnlineOfflineRatio;
  channelRevenue: ChannelRevenue[];
}

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const CHANNEL_ORDER = ["오프라인", "해피오더", "배민", "쿠팡이츠", "요기요", "땡겨요"];
const HOUR_LABELS = ["06-09", "09-11", "11-13", "13-15", "15-17", "17-19", "19-21"];

export const homeDaily: HomeTabData = {
  kpiPeriods: [
    {
      periodLabel: "07/19",
      revenue: 3240000,
      revenueComparisonBadge: "인근매장 평균 대비 +12%",
      orders: 178,
      aov: 18202,
      aovComparisonBadge: "브랜드 평균 대비 -3%",
      liveRevenue: 642000,
      liveOrders: 32,
    },
    { periodLabel: "07/18", revenue: 2950000, revenueComparisonBadge: "인근매장 평균 대비 +6%", orders: 162, aov: 18210 },
    { periodLabel: "07/17", revenue: 3410000, revenueComparisonBadge: "인근매장 평균 대비 +14%", orders: 189, aov: 18042 },
    { periodLabel: "07/16", revenue: 2780000, revenueComparisonBadge: "인근매장 평균 대비 +2%", orders: 151, aov: 18411 },
    { periodLabel: "07/15", revenue: 3050000, revenueComparisonBadge: "인근매장 평균 대비 +8%", orders: 168, aov: 18155 },
    { periodLabel: "07/14", revenue: 3600000, revenueComparisonBadge: "인근매장 평균 대비 +19%", orders: 201, aov: 17910 },
    { periodLabel: "07/13", revenue: 2890000, revenueComparisonBadge: "인근매장 평균 대비 +4%", orders: 159, aov: 18176 },
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
};

export const homeWeekly: HomeTabData = {
  kpiPeriods: [
    { periodLabel: "07/13~07/19", revenue: 21920000, revenueComparisonBadge: "인근매장 평균 대비 +9%", orders: 1208, aov: 18148, aovComparisonBadge: "브랜드 평균 대비 -1%" },
    { periodLabel: "07/06~07/12", revenue: 20150000, revenueComparisonBadge: "인근매장 평균 대비 +5%", orders: 1120, aov: 17991 },
    { periodLabel: "06/28~07/04", revenue: 19800000, revenueComparisonBadge: "인근매장 평균 대비 +3%", orders: 1095, aov: 18082 },
    { periodLabel: "06/21~06/27", revenue: 21050000, revenueComparisonBadge: "인근매장 평균 대비 +7%", orders: 1150, aov: 18304 },
  ],
  weekday: WEEKDAY_LABELS.map((label, i) => ({
    label,
    value: [2980000, 3120000, 2860000, 3050000, 3340000, 3480000, 3090000][i],
  })),
  onlineOffline: { online: 40, offline: 60 },
  channelRevenue: [12700000, 4600000, 2600000, 1300000, 550000, 170000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
};

export const homeMonthly: HomeTabData = {
  kpiPeriods: [
    { periodLabel: "2026년 7월", revenue: 92400000, revenueComparisonBadge: "인근매장 평균 대비 +8%", orders: 5120, aov: 18047, aovComparisonBadge: "브랜드 평균 대비 -2%" },
    { periodLabel: "2026년 6월", revenue: 88700000, revenueComparisonBadge: "인근매장 평균 대비 +4%", orders: 4890, aov: 18139 },
    { periodLabel: "2026년 5월", revenue: 90150000, revenueComparisonBadge: "인근매장 평균 대비 +6%", orders: 4950, aov: 18212 },
  ],
  weekday: WEEKDAY_LABELS.map((label, i) => ({
    label,
    value: [12800000, 13400000, 12200000, 13100000, 14300000, 14900000, 13300000][i],
  })),
  onlineOffline: { online: 39, offline: 61 },
  channelRevenue: [54000000, 19800000, 11200000, 5600000, 2400000, 700000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
};

// 홈 = 사장님앱 실시간 대시보드 (당일 기준, 탭 없음). 이번 주 오늘 = 수요일 가정 (deliveryDummy.ts weekdayCumulative와 동일 컨벤션)
const CURRENT_WEEKDAY_INDEX = 2;

// 프로토타입 데모용 — 홈 화면의 "케이스 전환" 버튼으로 두 시나리오(지역 평균보다 낮음/높음)를 보여주기 위한 값
export const MEMBERSHIP_CUSTOMER_PCT_BY_CASE = {
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
  weekdayHourly: [
    { day: "월", hourly: [3, 8, 13, 17, 11, 9, 6].map((v, i) => ({ label: HOUR_LABELS[i], value: v })) },
    { day: "화", hourly: [4, 9, 15, 19, 12, 10, 7].map((v, i) => ({ label: HOUR_LABELS[i], value: v })) },
    { day: "수", isToday: true, hourly: [3, 7, 10, 4, 2, 1, 0].map((v, i) => ({ label: HOUR_LABELS[i], value: v })) },
  ],
  last30: {
    membershipCustomerPct: MEMBERSHIP_CUSTOMER_PCT_BY_CASE.low,
    membershipRegionAvgPct: 50,
    deliveryRevenueAmount: 26460000,
    deliveryRevenuePct: 29.4,
  },
};
