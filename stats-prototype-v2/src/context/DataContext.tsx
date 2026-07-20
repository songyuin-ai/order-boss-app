import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Indicator, PosKpiPeriod, HourlyBucket, OnlineOfflineRatio } from "../data/types";
import { deliveryIndicators as defaultDeliveryIndicators } from "../data/deliveryIndicators";
import { customerCompositionIndicators as defaultCustomerCompositionIndicators } from "../data/customerCompositionIndicators";
import { customerDetailIndicators as defaultCustomerDetailIndicators } from "../data/customerDetailIndicators";
import { membershipIndicators as defaultMembershipIndicators } from "../data/membershipIndicators";
import { posIndicators as defaultPosIndicators } from "../data/posIndicators";
import {
  daily as defaultDaily,
  weekly as defaultWeekly,
  monthly as defaultMonthly,
  type DeliveryPeriodSetData,
  type DeliveryKpiPeriod,
} from "../data/deliveryDummy";
import {
  byPeriod as defaultCustomerCompositionByPeriod,
  segmentTrend as defaultSegmentTrend,
  type CustomerCompositionPeriodData,
} from "../data/customerCompositionDummy";
import { byPeriod as defaultCustomerDetailByPeriod, type CustomerDetailPeriodData } from "../data/customerDetailDummy";
import { byPeriod as defaultMembershipByPeriod, type MembershipPeriodData } from "../data/membershipDummy";
import { posKpiPeriods as defaultPosKpiPeriods, posHourly as defaultPosHourly, posOnlineOffline as defaultPosOnlineOffline } from "../data/posDummy";
import { loadLiveData, type LiveData } from "../lib/loadLiveData";
import { SHEET_ID } from "../config";

interface PosData {
  kpiPeriods: Record<string, PosKpiPeriod[]>;
  hourly: Record<string, HourlyBucket[]>;
  onlineOffline: Record<string, OnlineOfflineRatio>;
}

type IndicatorMap = Record<string, Indicator>;

function mergeIndicators<T extends IndicatorMap>(defaults: T, byId: Record<string, Indicator>): T {
  const merged = {} as T;
  (Object.keys(defaults) as (keyof T)[]).forEach((key) => {
    const def = defaults[key];
    const fetched = byId[def.id];
    merged[key] = (fetched ? { ...fetched } : def) as T[keyof T];
  });
  return merged;
}

function mergeLatestPeriod<T extends { periodLabel: string }>(periods: T[], override?: Partial<T>): T[] {
  if (!override || !periods.length) return periods;
  return [{ ...periods[0], ...override }, ...periods.slice(1)];
}

interface DataShape {
  deliveryIndicators: typeof defaultDeliveryIndicators;
  customerCompositionIndicators: typeof defaultCustomerCompositionIndicators;
  customerDetailIndicators: typeof defaultCustomerDetailIndicators;
  membershipIndicators: typeof defaultMembershipIndicators;
  posIndicators: typeof defaultPosIndicators;
  delivery: { daily: DeliveryPeriodSetData; weekly: DeliveryPeriodSetData; monthly: DeliveryPeriodSetData };
  customerComposition: { byPeriod: Record<string, CustomerCompositionPeriodData>; segmentTrend: typeof defaultSegmentTrend };
  customerDetail: { byPeriod: Record<string, CustomerDetailPeriodData> };
  membership: { byPeriod: Record<string, MembershipPeriodData> };
  pos: PosData;
  status: "loading" | "live" | "fallback";
}

const defaultShape: DataShape = {
  deliveryIndicators: defaultDeliveryIndicators,
  customerCompositionIndicators: defaultCustomerCompositionIndicators,
  customerDetailIndicators: defaultCustomerDetailIndicators,
  membershipIndicators: defaultMembershipIndicators,
  posIndicators: defaultPosIndicators,
  delivery: { daily: defaultDaily, weekly: defaultWeekly, monthly: defaultMonthly },
  customerComposition: { byPeriod: defaultCustomerCompositionByPeriod, segmentTrend: defaultSegmentTrend },
  customerDetail: { byPeriod: defaultCustomerDetailByPeriod },
  membership: { byPeriod: defaultMembershipByPeriod },
  pos: { kpiPeriods: defaultPosKpiPeriods, hourly: defaultPosHourly, onlineOffline: defaultPosOnlineOffline },
  status: SHEET_ID ? "loading" : "fallback",
};

const DataContext = createContext<DataShape>(defaultShape);

export function useAppData() {
  return useContext(DataContext);
}

interface DeliveryTabOverride {
  kpi?: Partial<DeliveryKpiPeriod>;
  hourly?: DeliveryPeriodSetData["hourly"];
  topMenu?: DeliveryPeriodSetData["topMenu"];
  deliveryRatio?: DeliveryPeriodSetData["deliveryRatio"];
  channelRevenue?: DeliveryPeriodSetData["channelRevenue"];
  weekdayCumulative?: DeliveryPeriodSetData["weekdayCumulative"];
  weekdayAverage?: DeliveryPeriodSetData["weekdayAverage"];
}

function mergeDeliveryTab(base: DeliveryPeriodSetData, override: DeliveryTabOverride): DeliveryPeriodSetData {
  return {
    kpiPeriods: mergeLatestPeriod(base.kpiPeriods, override.kpi),
    hourly: override.hourly ?? base.hourly,
    topMenu: override.topMenu ?? base.topMenu,
    deliveryRatio: override.deliveryRatio ?? base.deliveryRatio,
    channelRevenue: override.channelRevenue ?? base.channelRevenue,
    weekdayCumulative: override.weekdayCumulative ?? base.weekdayCumulative,
    weekdayAverage: override.weekdayAverage ?? base.weekdayAverage,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataShape>(defaultShape);

  useEffect(() => {
    if (!SHEET_ID) return;

    let cancelled = false;
    loadLiveData()
      .then((live: LiveData) => {
        if (cancelled) return;
        setData({
          deliveryIndicators: mergeIndicators(defaultDeliveryIndicators, live.indicatorsById),
          customerCompositionIndicators: mergeIndicators(defaultCustomerCompositionIndicators, live.indicatorsById),
          customerDetailIndicators: mergeIndicators(defaultCustomerDetailIndicators, live.indicatorsById),
          membershipIndicators: mergeIndicators(defaultMembershipIndicators, live.indicatorsById),
          posIndicators: mergeIndicators(defaultPosIndicators, live.indicatorsById),
          delivery: {
            daily: mergeDeliveryTab(defaultDaily, live.delivery.daily),
            weekly: mergeDeliveryTab(defaultWeekly, live.delivery.weekly),
            monthly: mergeDeliveryTab(defaultMonthly, live.delivery.monthly),
          },
          // 라이브 시트는 "최근 30일" 스냅샷만 덮어씀 - 최근 7일/월별 값은 항상 더미데이터
          customerComposition: {
            byPeriod: {
              ...defaultCustomerCompositionByPeriod,
              recent30: { ...defaultCustomerCompositionByPeriod.recent30, ...live.customerComposition },
            },
            segmentTrend: live.customerComposition.segmentTrend ?? defaultSegmentTrend,
          },
          customerDetail: {
            byPeriod: {
              ...defaultCustomerDetailByPeriod,
              recent30: { ...defaultCustomerDetailByPeriod.recent30, ...live.customerDetail },
            },
          },
          membership: {
            byPeriod: {
              ...defaultMembershipByPeriod,
              recent30: { ...defaultMembershipByPeriod.recent30, ...live.membership },
            },
          },
          pos: {
            kpiPeriods: live.pos.kpiPeriods ?? defaultPosKpiPeriods,
            hourly: live.pos.hourly ?? defaultPosHourly,
            onlineOffline: live.pos.onlineOffline ?? defaultPosOnlineOffline,
          },
          status: "live",
        });
      })
      .catch(() => {
        if (!cancelled) setData((prev) => ({ ...prev, status: "fallback" }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
