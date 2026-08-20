import type { PosKpiPeriod, OnlineOfflineRatio, HourlyBucket } from "./types";

export const posKpiPeriods: Record<string, PosKpiPeriod[]> = {
  daily: [
    { periodLabel: "07/18", totalRevenue: 3240000, totalOrders: 178, aov: 18202 },
    { periodLabel: "07/17", totalRevenue: 2950000, totalOrders: 162, aov: 18210 },
    { periodLabel: "07/16", totalRevenue: 3410000, totalOrders: 189, aov: 18042 },
    { periodLabel: "07/15", totalRevenue: 2780000, totalOrders: 151, aov: 18411 },
    { periodLabel: "07/14", totalRevenue: 3050000, totalOrders: 168, aov: 18155 },
    { periodLabel: "07/13", totalRevenue: 3600000, totalOrders: 201, aov: 17910 },
    { periodLabel: "07/12", totalRevenue: 2890000, totalOrders: 159, aov: 18176 },
  ],
  weekly: [
    {
      periodLabel: "07/12~07/18",
      totalRevenue: 21920000,
      totalOrders: 1208,
      dailyAvgRevenue: 3131429,
      dailyAvgOrders: 173,
      aov: 18148,
    },
    {
      periodLabel: "07/05~07/11",
      totalRevenue: 20150000,
      totalOrders: 1120,
      dailyAvgRevenue: 2878571,
      dailyAvgOrders: 160,
      aov: 17991,
    },
    {
      periodLabel: "06/28~07/04",
      totalRevenue: 19800000,
      totalOrders: 1095,
      dailyAvgRevenue: 2828571,
      dailyAvgOrders: 156,
      aov: 18082,
    },
    {
      periodLabel: "06/21~06/27",
      totalRevenue: 21050000,
      totalOrders: 1150,
      dailyAvgRevenue: 3007143,
      dailyAvgOrders: 164,
      aov: 18304,
    },
  ],
  monthly: [
    {
      periodLabel: "2026년 7월",
      totalRevenue: 92400000,
      totalOrders: 5120,
      dailyAvgRevenue: 2980645,
      dailyAvgOrders: 165,
      aov: 18047,
    },
    {
      periodLabel: "2026년 6월",
      totalRevenue: 88700000,
      totalOrders: 4890,
      dailyAvgRevenue: 2956667,
      dailyAvgOrders: 163,
      aov: 18139,
    },
    {
      periodLabel: "2026년 5월",
      totalRevenue: 90150000,
      totalOrders: 4950,
      dailyAvgRevenue: 2908065,
      dailyAvgOrders: 160,
      aov: 18212,
    },
  ],
};

const HOUR_LABELS = ["06-09", "09-11", "11-13", "13-15", "15-17", "17-19", "19-21"];

export const posHourly: Record<string, HourlyBucket[]> = {
  daily: [22, 45, 68, 95, 52, 48, 30].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  weekly: [154, 315, 476, 665, 364, 336, 210].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
  monthly: [660, 1350, 2040, 2850, 1560, 1440, 900].map((v, i) => ({ label: HOUR_LABELS[i], value: v })),
};

export const posOnlineOffline: Record<string, OnlineOfflineRatio> = {
  daily: { online: 42, offline: 58 },
  weekly: { online: 40, offline: 60 },
  monthly: { online: 39, offline: 61 },
};
