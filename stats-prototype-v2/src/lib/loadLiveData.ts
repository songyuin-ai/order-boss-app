import { fetchSheetTab, num, numOrNull, bool, str, strAny, type SheetRow } from "./googleSheet";
import type { Indicator, DeliveryRatio, ChannelRevenue, MenuItem, WeekdayBar, HourlyBucket, KpiData } from "../data/types";
import type { Track1TabData } from "../data/track1Dummy";
import type { SegmentChip } from "../data/track2Dummy";

async function safeFetch(tab: string): Promise<SheetRow[] | null> {
  try {
    return await fetchSheetTab(tab);
  } catch {
    return null;
  }
}

function compact<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(obj) as (keyof T)[]).forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

const byTab = (rows: SheetRow[] | null, tab: string) => (rows ?? []).filter((r) => r.tab === tab);

function buildKpi(rows: SheetRow[] | null, tab: string): KpiData | undefined {
  const row = (rows ?? []).find((r) => r.tab === tab);
  if (!row) return undefined;
  return {
    revenue: num(row, "revenue"),
    orders: num(row, "orders"),
    aov: num(row, "aov"),
    cancelRate: num(row, "cancelRate"),
    revenueDelta: num(row, "revenueDelta"),
    ordersDelta: num(row, "ordersDelta"),
    aovDelta: num(row, "aovDelta"),
    cancelDelta: num(row, "cancelDelta"),
    compareLabel: str(row, "compareLabel"),
  };
}

function buildHourly(rows: SheetRow[] | null, tab: string): HourlyBucket[] | undefined {
  const filtered = byTab(rows, tab);
  if (!filtered.length) return undefined;
  return filtered.map((r) => ({ label: str(r, "label"), value: num(r, "value") }));
}

function buildWeekday(rows: SheetRow[] | null, tab: string): WeekdayBar[] | undefined {
  const filtered = byTab(rows, tab);
  if (!filtered.length) return undefined;
  return filtered.map((r) => ({
    label: str(r, "label"),
    value: numOrNull(r, "value"),
    isToday: bool(r, "isToday"),
  }));
}

function buildTopMenu(rows: SheetRow[] | null, tab: string): MenuItem[] | undefined {
  const filtered = byTab(rows, tab);
  if (!filtered.length) return undefined;
  return [...filtered]
    .sort((a, b) => num(a, "rank") - num(b, "rank"))
    .map((r) => ({ rank: num(r, "rank"), name: str(r, "name"), count: num(r, "count") }));
}

function buildDelivery(rows: SheetRow[] | null, tab: string): DeliveryRatio | undefined {
  const row = (rows ?? []).find((r) => r.tab === tab);
  if (!row) return undefined;
  return { delivery: num(row, "delivery"), pickup: num(row, "pickup") };
}

function buildChannel(rows: SheetRow[] | null, tab: string): ChannelRevenue[] | undefined {
  const filtered = byTab(rows, tab);
  if (!filtered.length) return undefined;
  return filtered.map((r) => ({ channel: str(r, "channel"), value: num(r, "value") }));
}

export interface LiveData {
  indicatorsById: Record<string, Indicator>;
  track1: {
    today: Partial<Track1TabData>;
    week: Partial<Track1TabData>;
    month: Partial<Track1TabData>;
  };
  track2: {
    customerComposition?: { loyalPct: number; deltaLabel: string; chips: SegmentChip[] };
    demographicDistribution?: { label: string; pct: number }[];
    segmentTrend?: { month: string; 단골: number; 신규: number }[];
    preferredCategory?: string[];
    agePreferredProducts?: Record<string, { name: string; revenue: number }[]>;
    loyalPreferredProducts?: { name: string; revenue: number }[];
    visitTimeText?: string;
    revisitCycle?: { value: string; label: string };
    hValue?: { pct: number; deltaLabel: string };
    segmentContribution?: { segment: string; revenueShare: number; aov: number }[];
    gcrmCompare?: {
      metric: string;
      ours: string;
      nearby: string;
      secondaryMetric: string;
      oursSecondary: string;
      nearbySecondary: string;
    };
  };
}

export async function loadLiveData(): Promise<LiveData> {
  const [
    indicatorsRows,
    kpiRows,
    hourlyRows,
    weekdayRows,
    topMenuRows,
    deliveryRows,
    channelRows,
    compositionRows,
    chipsRows,
    demographicRows,
    trendRows,
    agePreferredRows,
    loyalPreferredRows,
    categoryRows,
    visitTimeRows,
    revisitCycleRows,
    hValueRows,
    segmentContributionRows,
    gcrmCompareRows,
  ] = await Promise.all([
    safeFetch("Indicators"),
    safeFetch("Track1_KPI"),
    safeFetch("Track1_Hourly"),
    safeFetch("Track1_Weekday"),
    safeFetch("Track1_TopMenu"),
    safeFetch("Track1_Delivery"),
    safeFetch("Track1_Channel"),
    safeFetch("Track2_Composition"),
    safeFetch("Track2_Chips"),
    safeFetch("Track2_Demographic"),
    safeFetch("Track2_Trend"),
    safeFetch("Track2_AgePreferred"),
    safeFetch("Track2_LoyalPreferred"),
    safeFetch("Track2_Category"),
    safeFetch("Track2_VisitTime"),
    safeFetch("Track2_RevisitCycle"),
    safeFetch("Track2_HValue"),
    safeFetch("Track2_SegmentContribution"),
    safeFetch("Track2_GcrmCompare"),
  ]);

  const indicatorsById: Record<string, Indicator> = {};
  indicatorsRows?.forEach((r) => {
    const id = str(r, "id");
    if (!id) return;
    indicatorsById[id] = {
      id,
      지표명: str(r, "지표명"),
      정의: str(r, "정의"),
      원천데이터_및_산식: str(r, "원천데이터_및_산식"),
      제공목적: str(r, "제공목적"),
      차트형태: str(r, "차트형태"),
      노출: strAny(r, ["노출", "노출시트", "노출여부", "노출 여부"]),
    };
  });

  const track1 = {
    today: compact({
      kpi: buildKpi(kpiRows, "today"),
      hourly: buildHourly(hourlyRows, "today"),
      topMenu: buildTopMenu(topMenuRows, "today"),
      deliveryRatio: buildDelivery(deliveryRows, "today"),
      channelRevenue: buildChannel(channelRows, "today"),
    }),
    week: compact({
      kpi: buildKpi(kpiRows, "week"),
      hourly: buildHourly(hourlyRows, "week"),
      weekdayCumulative: buildWeekday(weekdayRows, "week"),
      topMenu: buildTopMenu(topMenuRows, "week"),
      deliveryRatio: buildDelivery(deliveryRows, "week"),
      channelRevenue: buildChannel(channelRows, "week"),
    }),
    month: compact({
      kpi: buildKpi(kpiRows, "month"),
      hourly: buildHourly(hourlyRows, "month"),
      weekdayAverage: buildWeekday(weekdayRows, "month"),
      topMenu: buildTopMenu(topMenuRows, "month"),
      deliveryRatio: buildDelivery(deliveryRows, "month"),
      channelRevenue: buildChannel(channelRows, "month"),
    }),
  };

  const agePreferredProducts = (() => {
    if (!agePreferredRows?.length) return undefined;
    const grouped: Record<string, { name: string; revenue: number }[]> = {};
    [...agePreferredRows]
      .sort((a, b) => num(a, "rank") - num(b, "rank"))
      .forEach((r) => {
        const age = str(r, "ageGroup");
        if (!age) return;
        (grouped[age] ??= []).push({ name: str(r, "name"), revenue: num(r, "revenue") });
      });
    return grouped;
  })();

  const track2 = compact({
    customerComposition: compositionRows?.length
      ? {
          loyalPct: num(compositionRows[0], "loyalPct"),
          deltaLabel: str(compositionRows[0], "deltaLabel"),
          chips: (chipsRows ?? []).map((r) => ({ label: str(r, "label"), pct: num(r, "pct") })),
        }
      : undefined,
    demographicDistribution: demographicRows?.length
      ? demographicRows.map((r) => ({ label: str(r, "label"), pct: num(r, "pct") }))
      : undefined,
    segmentTrend: trendRows?.length
      ? trendRows.map((r) => ({ month: str(r, "month"), 단골: num(r, "단골"), 신규: num(r, "신규") }))
      : undefined,
    preferredCategory: categoryRows?.length
      ? [...categoryRows].sort((a, b) => num(a, "order") - num(b, "order")).map((r) => str(r, "value"))
      : undefined,
    agePreferredProducts,
    loyalPreferredProducts: loyalPreferredRows?.length
      ? [...loyalPreferredRows]
          .sort((a, b) => num(a, "rank") - num(b, "rank"))
          .map((r) => ({ name: str(r, "name"), revenue: num(r, "revenue") }))
      : undefined,
    visitTimeText: visitTimeRows?.length ? str(visitTimeRows[0], "text") : undefined,
    revisitCycle: revisitCycleRows?.length
      ? { value: str(revisitCycleRows[0], "value"), label: str(revisitCycleRows[0], "label") }
      : undefined,
    hValue: hValueRows?.length
      ? { pct: num(hValueRows[0], "pct"), deltaLabel: str(hValueRows[0], "deltaLabel") }
      : undefined,
    segmentContribution: segmentContributionRows?.length
      ? segmentContributionRows.map((r) => ({
          segment: str(r, "segment"),
          revenueShare: num(r, "revenueShare"),
          aov: num(r, "aov"),
        }))
      : undefined,
    gcrmCompare: gcrmCompareRows?.length
      ? {
          metric: str(gcrmCompareRows[0], "metric"),
          ours: str(gcrmCompareRows[0], "ours"),
          nearby: str(gcrmCompareRows[0], "nearby"),
          secondaryMetric: str(gcrmCompareRows[0], "secondaryMetric"),
          oursSecondary: str(gcrmCompareRows[0], "oursSecondary"),
          nearbySecondary: str(gcrmCompareRows[0], "nearbySecondary"),
        }
      : undefined,
  });

  return { indicatorsById, track1, track2 };
}
