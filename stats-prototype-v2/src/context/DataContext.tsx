import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Indicator, PosKpiPeriod, HourlyBucket, OnlineOfflineRatio } from "../data/types";
import { deliveryIndicators as defaultDeliveryIndicators } from "../data/deliveryIndicators";
import { customerCompositionIndicators as defaultCustomerCompositionIndicators } from "../data/customerCompositionIndicators";
import { customerDetailIndicators as defaultCustomerDetailIndicators } from "../data/customerDetailIndicators";
import { membershipIndicators as defaultMembershipIndicators } from "../data/membershipIndicators";
import { posIndicators as defaultPosIndicators } from "../data/posIndicators";
import { today as defaultToday, week as defaultWeek, month as defaultMonth, type DeliveryTabData } from "../data/deliveryDummy";
import * as defaultCustomerCompositionDummy from "../data/customerCompositionDummy";
import type { SegmentChip } from "../data/customerCompositionDummy";
import * as defaultCustomerDetailDummy from "../data/customerDetailDummy";
import * as defaultMembershipDummy from "../data/membershipDummy";
import { posKpiPeriods as defaultPosKpiPeriods, posHourly as defaultPosHourly, posOnlineOffline as defaultPosOnlineOffline } from "../data/posDummy";
import { loadLiveData, type LiveData } from "../lib/loadLiveData";
import { SHEET_ID } from "../config";

interface CustomerCompositionData {
  customerComposition: { loyalPct: number; deltaLabel: string; chips: SegmentChip[] };
  demographicDistribution: { label: string; pct: number }[];
  segmentTrend: { month: string; 단골: number; 신규: number }[];
}

interface CustomerDetailData {
  preferredCategory: string[];
  agePreferredProducts: Record<string, { name: string; revenue: number }[]>;
  loyalPreferredProducts: { name: string; revenue: number }[];
  visitTimeText: string;
  revisitCycle: { value: string; label: string };
}

interface MembershipData {
  hValue: { pct: number; deltaLabel: string };
  segmentContribution: { segment: string; revenueShare: number; aov: number }[];
  membershipRevenue: { memberRevenue: number; totalRevenue: number; pct: number; deltaLabel: string };
}

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

interface DataShape {
  deliveryIndicators: typeof defaultDeliveryIndicators;
  customerCompositionIndicators: typeof defaultCustomerCompositionIndicators;
  customerDetailIndicators: typeof defaultCustomerDetailIndicators;
  membershipIndicators: typeof defaultMembershipIndicators;
  posIndicators: typeof defaultPosIndicators;
  delivery: { today: DeliveryTabData; week: DeliveryTabData; month: DeliveryTabData };
  customerComposition: CustomerCompositionData;
  customerDetail: CustomerDetailData;
  membership: MembershipData;
  pos: PosData;
  status: "loading" | "live" | "fallback";
}

const defaultShape: DataShape = {
  deliveryIndicators: defaultDeliveryIndicators,
  customerCompositionIndicators: defaultCustomerCompositionIndicators,
  customerDetailIndicators: defaultCustomerDetailIndicators,
  membershipIndicators: defaultMembershipIndicators,
  posIndicators: defaultPosIndicators,
  delivery: { today: defaultToday, week: defaultWeek, month: defaultMonth },
  customerComposition: { ...defaultCustomerCompositionDummy },
  customerDetail: { ...defaultCustomerDetailDummy },
  membership: { ...defaultMembershipDummy },
  pos: { kpiPeriods: defaultPosKpiPeriods, hourly: defaultPosHourly, onlineOffline: defaultPosOnlineOffline },
  status: SHEET_ID ? "loading" : "fallback",
};

const DataContext = createContext<DataShape>(defaultShape);

export function useAppData() {
  return useContext(DataContext);
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
            today: { ...defaultToday, ...live.delivery.today },
            week: { ...defaultWeek, ...live.delivery.week },
            month: { ...defaultMonth, ...live.delivery.month },
          },
          customerComposition: { ...defaultCustomerCompositionDummy, ...live.customerComposition },
          customerDetail: { ...defaultCustomerDetailDummy, ...live.customerDetail },
          membership: { ...defaultMembershipDummy, ...live.membership },
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
