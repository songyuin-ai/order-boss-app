import type { ChannelRevenue, DeliveryRatio, HourlyBucket, MenuItem, WeekdayBar } from "./types";

export interface DeliveryKpiPeriod {
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
  cancelRate: number;
  cancelRateRegionBadge: string;
  cancelRateDeltaBadge?: string;
  dailyAvgRevenue?: number;
  dailyAvgOrders?: number;
}

export interface DeliveryPeriodSetData {
  kpiPeriods: DeliveryKpiPeriod[];
  hourly: HourlyBucket[];
  weekdayCumulative?: WeekdayBar[];
  weekdayAverage?: WeekdayBar[];
  topMenu: MenuItem[];
  deliveryRatio: DeliveryRatio;
  channelRevenue: ChannelRevenue[];
}

const HOUR_LABELS = ["06-09", "09-11", "11-13", "13-15", "15-17", "17-19", "19-21"];
const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const CHANNEL_ORDER = ["해피오더", "배민", "쿠팡이츠", "요기요테스트", "땡겨요"];

// 기간변경 UI는 최근 3개월 범위만 지원 (배열 끝에 도달하면 화살표 비활성화)
// 각 탭의 가장 최근 항목(index 0)은 아직 마감되지 않은 진행 중 기간(오늘/이번 주/이번 달)이라
// 전일·전주·전월 대비 배지가 없고 인근매장/브랜드 평균 대비 배지만 표시함(홈 화면의 날짜별 보기와 동일 기준)
export const daily: DeliveryPeriodSetData = {
  kpiPeriods: [
    {
      // 진행 중(오늘) — 전일 대비 배지 없음
      periodLabel: "오늘",
      revenue: 842000,
      revenueRegionBadge: "인근매장 평균 대비 +9%",
      orders: 47,
      ordersRegionBadge: "인근매장 평균 대비 +4%",
      aov: 17915,
      aovRegionBadge: "브랜드 평균 대비 -3%",
      cancelRate: 4.3,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.4%p",
    },
    {
      periodLabel: "07/18",
      revenue: 795000,
      revenueRegionBadge: "인근매장 평균 대비 +5%",
      revenueDeltaBadge: "전일 대비 -5.6%",
      orders: 44,
      ordersRegionBadge: "인근매장 평균 대비 -2%",
      ordersDeltaBadge: "전일 대비 -3건",
      aov: 18068,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      aovDeltaBadge: "전일 대비 +0.9%",
      cancelRate: 3.9,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.2%p",
      cancelRateDeltaBadge: "전일 대비 +0.2%p",
    },
    {
      periodLabel: "07/17",
      revenue: 918000,
      revenueRegionBadge: "인근매장 평균 대비 +11%",
      revenueDeltaBadge: "전일 대비 +8.2%",
      orders: 51,
      ordersRegionBadge: "인근매장 평균 대비 +6%",
      ordersDeltaBadge: "전일 대비 +5건",
      aov: 18000,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      aovDeltaBadge: "전일 대비 -1.4%",
      cancelRate: 4.5,
      cancelRateRegionBadge: "브랜드 평균 대비 +0.1%p",
      cancelRateDeltaBadge: "전일 대비 +0.4%p",
    },
    {
      periodLabel: "07/16",
      revenue: 763000,
      revenueRegionBadge: "인근매장 평균 대비 -4%",
      revenueDeltaBadge: "전일 대비 -3.1%",
      orders: 42,
      ordersRegionBadge: "인근매장 평균 대비 -5%",
      ordersDeltaBadge: "전일 대비 -2건",
      aov: 18167,
      aovRegionBadge: "브랜드 평균 대비 +2%",
      aovDeltaBadge: "전일 대비 +1.1%",
      cancelRate: 3.6,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.5%p",
      cancelRateDeltaBadge: "전일 대비 -0.6%p",
    },
    {
      periodLabel: "07/15",
      revenue: 856000,
      revenueRegionBadge: "인근매장 평균 대비 +7%",
      revenueDeltaBadge: "전일 대비 +6.7%",
      orders: 47,
      ordersRegionBadge: "인근매장 평균 대비 +3%",
      ordersDeltaBadge: "전일 대비 +4건",
      aov: 18213,
      aovRegionBadge: "브랜드 평균 대비 +1%",
      aovDeltaBadge: "전일 대비 -0.5%",
      cancelRate: 4.1,
      cancelRateRegionBadge: "브랜드 평균 대비 +0.2%p",
      cancelRateDeltaBadge: "전일 대비 +0.3%p",
    },
    {
      periodLabel: "07/14",
      revenue: 812000,
      revenueRegionBadge: "인근매장 평균 대비 +2%",
      revenueDeltaBadge: "전일 대비 -1.9%",
      orders: 45,
      ordersRegionBadge: "인근매장 평균 대비 -1%",
      ordersDeltaBadge: "전일 대비 -1건",
      aov: 18044,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      aovDeltaBadge: "전일 대비 +0.6%",
      cancelRate: 3.8,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.3%p",
      cancelRateDeltaBadge: "전일 대비 -0.2%p",
    },
  ],
  hourly: [2, 5, 9, 14, 7, 6, 4].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  topMenu: [
    { rank: 1, name: "양념치킨", count: 18 },
    { rank: 2, name: "후라이드치킨", count: 14 },
    { rank: 3, name: "반반치킨", count: 9 },
  ],
  deliveryRatio: { delivery: 68, pickup: 32 },
  channelRevenue: [320000, 250000, 150000, 80000, 42000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
};

export const weekly: DeliveryPeriodSetData = {
  kpiPeriods: [
    {
      // 진행 중(이번 주) — 전주 동일기간 대비 배지 없음
      periodLabel: "이번 주",
      revenue: 5624000,
      revenueRegionBadge: "인근매장 평균 대비 +9%",
      orders: 312,
      ordersRegionBadge: "인근매장 평균 대비 +3%",
      aov: 18025,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      cancelRate: 3.8,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.3%p",
      dailyAvgRevenue: 803429,
      dailyAvgOrders: 45,
    },
    {
      periodLabel: "07/06~07/12",
      revenue: 5156000,
      revenueRegionBadge: "인근매장 평균 대비 +4%",
      revenueDeltaBadge: "전주 동일기간 대비 +3.4%",
      orders: 289,
      ordersRegionBadge: "인근매장 평균 대비 +1%",
      ordersDeltaBadge: "전주 동일기간 대비 +9건",
      aov: 17840,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      aovDeltaBadge: "전주 동일기간 대비 -0.8%",
      cancelRate: 4.1,
      cancelRateRegionBadge: "브랜드 평균 대비 +0.1%p",
      cancelRateDeltaBadge: "전주 동일기간 대비 +0.2%p",
      dailyAvgRevenue: 736571,
      dailyAvgOrders: 41,
    },
    {
      periodLabel: "06/29~07/05",
      revenue: 4988000,
      revenueRegionBadge: "인근매장 평균 대비 -3%",
      revenueDeltaBadge: "전주 동일기간 대비 -2.1%",
      orders: 278,
      ordersRegionBadge: "인근매장 평균 대비 -4%",
      ordersDeltaBadge: "전주 동일기간 대비 -6건",
      aov: 17942,
      aovRegionBadge: "브랜드 평균 대비 +1%",
      aovDeltaBadge: "전주 동일기간 대비 +0.5%",
      cancelRate: 3.9,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.2%p",
      cancelRateDeltaBadge: "전주 동일기간 대비 -0.4%p",
      dailyAvgRevenue: 712571,
      dailyAvgOrders: 40,
    },
    {
      periodLabel: "06/22~06/28",
      revenue: 5094000,
      revenueRegionBadge: "인근매장 평균 대비 +2%",
      revenueDeltaBadge: "전주 동일기간 대비 +1.8%",
      orders: 284,
      ordersRegionBadge: "인근매장 평균 대비 +1%",
      ordersDeltaBadge: "전주 동일기간 대비 +3건",
      aov: 17937,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      aovDeltaBadge: "전주 동일기간 대비 -0.2%",
      cancelRate: 4.3,
      cancelRateRegionBadge: "브랜드 평균 대비 +0.3%p",
      cancelRateDeltaBadge: "전주 동일기간 대비 +0.6%p",
      dailyAvgRevenue: 727714,
      dailyAvgOrders: 41,
    },
  ],
  hourly: [15, 34, 58, 92, 47, 41, 25].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  // 이번 주(가장 최근 주간 기간)만 기준, 오늘 = 수요일 가정 (월/화/수만 지남)
  weekdayCumulative: WEEKDAY_LABELS.map((label, i) => {
    const passed = i <= 2;
    const values = [1780000, 1905000, 1939000];
    return {
      label,
      value: passed ? values[i] : null,
      isToday: i === 2,
    };
  }),
  topMenu: [
    { rank: 1, name: "양념치킨", count: 112 },
    { rank: 2, name: "후라이드치킨", count: 96 },
    { rank: 3, name: "반반치킨", count: 61 },
  ],
  deliveryRatio: { delivery: 71, pickup: 29 },
  channelRevenue: [2150000, 1680000, 980000, 540000, 274000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
};

export const monthly: DeliveryPeriodSetData = {
  kpiPeriods: [
    {
      // 진행 중(이번 달) — 전월 동일기간 대비 배지 없음
      periodLabel: "이번 달",
      revenue: 24150000,
      revenueRegionBadge: "인근매장 평균 대비 +8%",
      orders: 1340,
      ordersRegionBadge: "인근매장 평균 대비 +5%",
      aov: 18022,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      cancelRate: 4.1,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.3%p",
      dailyAvgRevenue: 805000,
      dailyAvgOrders: 45,
    },
    {
      periodLabel: "2026년 6월",
      revenue: 22860000,
      revenueRegionBadge: "인근매장 평균 대비 +3%",
      revenueDeltaBadge: "전월 동일기간 대비 -1.6%",
      orders: 1276,
      ordersRegionBadge: "인근매장 평균 대비 +1%",
      ordersDeltaBadge: "전월 동일기간 대비 -18건",
      aov: 17916,
      aovRegionBadge: "브랜드 평균 대비 -1%",
      aovDeltaBadge: "전월 동일기간 대비 +0.4%",
      cancelRate: 3.9,
      cancelRateRegionBadge: "브랜드 평균 대비 -0.2%p",
      cancelRateDeltaBadge: "전월 동일기간 대비 -0.1%p",
      dailyAvgRevenue: 762000,
      dailyAvgOrders: 43,
    },
    {
      periodLabel: "2026년 5월",
      revenue: 23240000,
      revenueRegionBadge: "인근매장 평균 대비 +5%",
      revenueDeltaBadge: "전월 동일기간 대비 +2.9%",
      orders: 1298,
      ordersRegionBadge: "인근매장 평균 대비 +2%",
      ordersDeltaBadge: "전월 동일기간 대비 +32건",
      aov: 17904,
      aovRegionBadge: "브랜드 평균 대비 -2%",
      aovDeltaBadge: "전월 동일기간 대비 -0.3%",
      cancelRate: 4.0,
      cancelRateRegionBadge: "브랜드 평균 대비 +0.1%p",
      cancelRateDeltaBadge: "전월 동일기간 대비 +0.3%p",
      dailyAvgRevenue: 749677,
      dailyAvgOrders: 42,
    },
  ],
  hourly: [64, 148, 251, 398, 203, 176, 100].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  weekdayAverage: [780000, 812000, 940000, 865000, 1024000, 1188000, 902000].map((v, i) => ({
    label: WEEKDAY_LABELS[i],
    value: v,
  })),
  topMenu: [
    { rank: 1, name: "양념치킨", count: 481 },
    { rank: 2, name: "후라이드치킨", count: 402 },
    { rank: 3, name: "반반치킨", count: 268 },
  ],
  deliveryRatio: { delivery: 69, pickup: 31 },
  channelRevenue: [9120000, 7080000, 4210000, 2340000, 1400000].map((v, i) => ({
    channel: CHANNEL_ORDER[i],
    value: v,
  })),
};
