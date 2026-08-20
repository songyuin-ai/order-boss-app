import type {
  ChannelRevenue,
  DeliveryRatio,
  HourlyBucket,
  KpiData,
  MenuItem,
  WeekdayBar,
} from "./types";

export interface DeliveryKpiPeriod extends KpiData {
  periodLabel: string;
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
export const daily: DeliveryPeriodSetData = {
  kpiPeriods: [
    { periodLabel: "07/19", revenue: 842000, orders: 47, aov: 17915, cancelRate: 4.3, revenueDelta: 12.4, ordersDelta: 8, aovDelta: -2.1, cancelDelta: -0.5, compareLabel: "전일 대비" },
    { periodLabel: "07/18", revenue: 795000, orders: 44, aov: 18068, cancelRate: 3.9, revenueDelta: -5.6, ordersDelta: -3, aovDelta: 0.9, cancelDelta: 0.2, compareLabel: "전일 대비" },
    { periodLabel: "07/17", revenue: 918000, orders: 51, aov: 18000, cancelRate: 4.5, revenueDelta: 8.2, ordersDelta: 5, aovDelta: -1.4, cancelDelta: 0.4, compareLabel: "전일 대비" },
    { periodLabel: "07/16", revenue: 763000, orders: 42, aov: 18167, cancelRate: 3.6, revenueDelta: -3.1, ordersDelta: -2, aovDelta: 1.1, cancelDelta: -0.6, compareLabel: "전일 대비" },
    { periodLabel: "07/15", revenue: 856000, orders: 47, aov: 18213, cancelRate: 4.1, revenueDelta: 6.7, ordersDelta: 4, aovDelta: -0.5, cancelDelta: 0.3, compareLabel: "전일 대비" },
    { periodLabel: "07/14", revenue: 812000, orders: 45, aov: 18044, cancelRate: 3.8, revenueDelta: -1.9, ordersDelta: -1, aovDelta: 0.6, cancelDelta: -0.2, compareLabel: "전일 대비" },
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
    { periodLabel: "07/13~07/19", revenue: 5624000, orders: 312, aov: 18025, cancelRate: 3.8, revenueDelta: 9.1, ordersDelta: 21, aovDelta: 1.2, cancelDelta: -0.3, compareLabel: "전주 동일기간 대비", dailyAvgRevenue: 803429, dailyAvgOrders: 45 },
    { periodLabel: "07/06~07/12", revenue: 5156000, orders: 289, aov: 17840, cancelRate: 4.1, revenueDelta: 3.4, ordersDelta: 9, aovDelta: -0.8, cancelDelta: 0.2, compareLabel: "전주 동일기간 대비", dailyAvgRevenue: 736571, dailyAvgOrders: 41 },
    { periodLabel: "06/29~07/05", revenue: 4988000, orders: 278, aov: 17942, cancelRate: 3.9, revenueDelta: -2.1, ordersDelta: -6, aovDelta: 0.5, cancelDelta: -0.4, compareLabel: "전주 동일기간 대비", dailyAvgRevenue: 712571, dailyAvgOrders: 40 },
    { periodLabel: "06/22~06/28", revenue: 5094000, orders: 284, aov: 17937, cancelRate: 4.3, revenueDelta: 1.8, ordersDelta: 3, aovDelta: -0.2, cancelDelta: 0.6, compareLabel: "전주 동일기간 대비", dailyAvgRevenue: 727714, dailyAvgOrders: 41 },
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
    { periodLabel: "2026년 7월", revenue: 24150000, orders: 1340, aov: 18022, cancelRate: 4.1, revenueDelta: 5.4, ordersDelta: 64, aovDelta: -0.8, cancelDelta: 0.2, compareLabel: "전월 동일기간 대비", dailyAvgRevenue: 805000, dailyAvgOrders: 45 },
    { periodLabel: "2026년 6월", revenue: 22860000, orders: 1276, aov: 17916, cancelRate: 3.9, revenueDelta: -1.6, ordersDelta: -18, aovDelta: 0.4, cancelDelta: -0.1, compareLabel: "전월 동일기간 대비", dailyAvgRevenue: 762000, dailyAvgOrders: 43 },
    { periodLabel: "2026년 5월", revenue: 23240000, orders: 1298, aov: 17904, cancelRate: 4.0, revenueDelta: 2.9, ordersDelta: 32, aovDelta: -0.3, cancelDelta: 0.3, compareLabel: "전월 동일기간 대비", dailyAvgRevenue: 749677, dailyAvgOrders: 42 },
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
