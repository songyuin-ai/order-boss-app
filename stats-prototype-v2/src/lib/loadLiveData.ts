import { fetchSheetTab, num, numOrNull, bool, str, strAny, type SheetRow } from "./googleSheet";
import type {
  Indicator,
  DeliveryRatio,
  ChannelRevenue,
  MenuItem,
  WeekdayBar,
  HourlyBucket,
  KpiData,
  PosKpiPeriod,
  OnlineOfflineRatio,
} from "../data/types";
import type { DeliveryTabData } from "../data/deliveryDummy";
import type { SegmentChip } from "../data/customerCompositionDummy";

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
    dailyAvgRevenue: row.dailyAvgRevenue ? num(row, "dailyAvgRevenue") : undefined,
    dailyAvgOrders: row.dailyAvgOrders ? num(row, "dailyAvgOrders") : undefined,
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

function buildDeliveryRatio(rows: SheetRow[] | null, tab: string): DeliveryRatio | undefined {
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
  delivery: {
    today: Partial<DeliveryTabData>;
    week: Partial<DeliveryTabData>;
    month: Partial<DeliveryTabData>;
  };
  customerComposition: {
    customerComposition?: { loyalPct: number; deltaLabel: string; chips: SegmentChip[] };
    demographicDistribution?: { label: string; pct: number }[];
    segmentTrend?: { month: string; 단골: number; 신규: number }[];
  };
  customerDetail: {
    preferredCategory?: string[];
    agePreferredProducts?: Record<string, { name: string; revenue: number }[]>;
    loyalPreferredProducts?: { name: string; revenue: number }[];
    visitTimeText?: string;
    revisitCycle?: { value: string; label: string };
  };
  membership: {
    hValue?: { pct: number; deltaLabel: string };
    segmentContribution?: { segment: string; revenueShare: number; aov: number }[];
    membershipRevenue?: { memberRevenue: number; totalRevenue: number; pct: number; deltaLabel: string };
  };
  pos: {
    kpiPeriods?: Record<string, PosKpiPeriod[]>;
    hourly?: Record<string, HourlyBucket[]>;
    onlineOffline?: Record<string, OnlineOfflineRatio>;
  };
}

const POS_TABS = ["daily", "weekly", "monthly"];

export async function loadLiveData(): Promise<LiveData> {
  const [
    indicatorsRows,
    posKpiRows,
    posHourlyRows,
    posOnlineOfflineRows,
    compositionRows,
    chipsRows,
    demographicRows,
    trendRows,
    categoryRows,
    agePreferredRows,
    loyalPreferredRows,
    visitTimeRows,
    revisitCycleRows,
    hValueRows,
    segmentContributionRows,
    membershipRevenueRows,
    deliveryKpiRows,
    deliveryHourlyRows,
    deliveryWeekdayRows,
    deliveryTopMenuRows,
    deliveryRatioRows,
    deliveryChannelRows,
  ] = await Promise.all([
    safeFetch("Indicators"),
    safeFetch("POS_KPI"),
    safeFetch("POS_Hourly"),
    safeFetch("POS_OnlineOffline"),
    safeFetch("CustomerComposition"),
    safeFetch("CustomerComposition_Chips"),
    safeFetch("CustomerComposition_Demographic"),
    safeFetch("CustomerComposition_Trend"),
    safeFetch("CustomerDetail_Category"),
    safeFetch("CustomerDetail_AgePreferred"),
    safeFetch("CustomerDetail_LoyalPreferred"),
    safeFetch("CustomerDetail_VisitTime"),
    safeFetch("CustomerDetail_RevisitCycle"),
    safeFetch("Membership_HValue"),
    safeFetch("Membership_SegmentContribution"),
    safeFetch("Membership_Revenue"),
    safeFetch("Delivery_KPI"),
    safeFetch("Delivery_Hourly"),
    safeFetch("Delivery_Weekday"),
    safeFetch("Delivery_TopMenu"),
    safeFetch("Delivery_DeliveryRatio"),
    safeFetch("Delivery_Channel"),
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

  const delivery = {
    today: compact({
      kpi: buildKpi(deliveryKpiRows, "today"),
      hourly: buildHourly(deliveryHourlyRows, "today"),
      topMenu: buildTopMenu(deliveryTopMenuRows, "today"),
      deliveryRatio: buildDeliveryRatio(deliveryRatioRows, "today"),
      channelRevenue: buildChannel(deliveryChannelRows, "today"),
    }),
    week: compact({
      kpi: buildKpi(deliveryKpiRows, "week"),
      hourly: buildHourly(deliveryHourlyRows, "week"),
      weekdayCumulative: buildWeekday(deliveryWeekdayRows, "week"),
      topMenu: buildTopMenu(deliveryTopMenuRows, "week"),
      deliveryRatio: buildDeliveryRatio(deliveryRatioRows, "week"),
      channelRevenue: buildChannel(deliveryChannelRows, "week"),
    }),
    month: compact({
      kpi: buildKpi(deliveryKpiRows, "month"),
      hourly: buildHourly(deliveryHourlyRows, "month"),
      weekdayAverage: buildWeekday(deliveryWeekdayRows, "month"),
      topMenu: buildTopMenu(deliveryTopMenuRows, "month"),
      deliveryRatio: buildDeliveryRatio(deliveryRatioRows, "month"),
      channelRevenue: buildChannel(deliveryChannelRows, "month"),
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

  const customerComposition = compact({
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
  });

  const customerDetail = compact({
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
  });

  const membership = compact({
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
    membershipRevenue: membershipRevenueRows?.length
      ? {
          memberRevenue: num(membershipRevenueRows[0], "memberRevenue"),
          totalRevenue: num(membershipRevenueRows[0], "totalRevenue"),
          pct: num(membershipRevenueRows[0], "pct"),
          deltaLabel: str(membershipRevenueRows[0], "deltaLabel"),
        }
      : undefined,
  });

  const posKpiByTab: Record<string, PosKpiPeriod[]> = {};
  const posHourlyByTab: Record<string, HourlyBucket[]> = {};
  const posOnlineOfflineByTab: Record<string, OnlineOfflineRatio> = {};

  POS_TABS.forEach((tab) => {
    const kpiRows = byTab(posKpiRows, tab);
    if (kpiRows.length) {
      posKpiByTab[tab] = kpiRows.map((r) => ({
        periodLabel: str(r, "periodLabel"),
        totalRevenue: num(r, "totalRevenue"),
        totalOrders: num(r, "totalOrders"),
        dailyAvgRevenue: r.dailyAvgRevenue ? num(r, "dailyAvgRevenue") : undefined,
        dailyAvgOrders: r.dailyAvgOrders ? num(r, "dailyAvgOrders") : undefined,
        aov: num(r, "aov"),
      }));
    }
    const hourlyRows = byTab(posHourlyRows, tab);
    if (hourlyRows.length) {
      posHourlyByTab[tab] = hourlyRows.map((r) => ({ label: str(r, "label"), value: num(r, "value") }));
    }
    const ratioRow = (posOnlineOfflineRows ?? []).find((r) => r.tab === tab);
    if (ratioRow) {
      posOnlineOfflineByTab[tab] = { online: num(ratioRow, "online"), offline: num(ratioRow, "offline") };
    }
  });

  const pos = compact({
    kpiPeriods: Object.keys(posKpiByTab).length ? posKpiByTab : undefined,
    hourly: Object.keys(posHourlyByTab).length ? posHourlyByTab : undefined,
    onlineOffline: Object.keys(posOnlineOfflineByTab).length ? posOnlineOfflineByTab : undefined,
  });

  return { indicatorsById, delivery, customerComposition, customerDetail, membership, pos };
}
