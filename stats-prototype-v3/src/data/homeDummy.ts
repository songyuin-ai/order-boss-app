import type { WeekdayBar, ChannelRevenue, OnlineOfflineRatio } from "./types";

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
