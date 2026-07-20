import type {
  ChannelRevenue,
  DeliveryRatio,
  HourlyBucket,
  KpiData,
  MenuItem,
  WeekdayBar,
} from "./types";

export interface DeliveryTabData {
  kpi: KpiData;
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

export const today: DeliveryTabData = {
  kpi: {
    revenue: 842000,
    orders: 47,
    aov: 17915,
    cancelRate: 4.3,
    revenueDelta: 12.4,
    ordersDelta: 8,
    aovDelta: -2.1,
    cancelDelta: -0.5,
    compareLabel: "전일 대비",
  },
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

// 이번 주 오늘 = 수요일 가정 (월/화/수만 지남)
export const week: DeliveryTabData = {
  kpi: {
    revenue: 5624000,
    orders: 312,
    aov: 18025,
    cancelRate: 3.8,
    revenueDelta: 9.1,
    ordersDelta: 21,
    aovDelta: 1.2,
    cancelDelta: -0.3,
    compareLabel: "전주 동일기간 대비",
    dailyAvgRevenue: 803429,
    dailyAvgOrders: 45,
  },
  hourly: [15, 34, 58, 92, 47, 41, 25].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  weekdayCumulative: WEEKDAY_LABELS.map((label, i) => {
    const passed = i <= 2; // 월,화,수 지남
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

export const month: DeliveryTabData = {
  kpi: {
    revenue: 24150000,
    orders: 1340,
    aov: 18022,
    cancelRate: 4.1,
    revenueDelta: 5.4,
    ordersDelta: 64,
    aovDelta: -0.8,
    cancelDelta: 0.2,
    compareLabel: "전월 동일기간 대비",
    dailyAvgRevenue: 805000,
    dailyAvgOrders: 45,
  },
  hourly: [64, 148, 251, 398, 203, 176, 100].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  weekdayAverage: [
    780000, 812000, 940000, 865000, 1024000, 1188000, 902000,
  ].map((v, i) => ({ label: WEEKDAY_LABELS[i], value: v })),
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
