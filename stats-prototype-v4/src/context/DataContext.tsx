import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { homeIndicators as defaultHomeIndicators, homeRealtimeIndicators as defaultHomeRealtimeIndicators } from "../data/homeIndicators";
import { homeDaily, homeWeekly, homeMonthly, homeRealtime, type HomeTabData, type HomeRealtimeData } from "../data/homeDummy";
import { deliveryIndicators as defaultDeliveryIndicators } from "../data/deliveryIndicators";
import { daily as deliveryDaily, weekly as deliveryWeekly, monthly as deliveryMonthly, type DeliveryPeriodSetData } from "../data/deliveryDummy";
import { customerCompositionIndicators as defaultCustomerCompositionIndicators } from "../data/customerCompositionIndicators";
import { byPeriod as customerCompositionByPeriod, segmentTrend, type CustomerCompositionPeriodData } from "../data/customerCompositionDummy";
import { customerDetailIndicators as defaultCustomerDetailIndicators } from "../data/customerDetailIndicators";
import { byPeriod as customerDetailByPeriod, type CustomerDetailPeriodData } from "../data/customerDetailDummy";
import { segmentDetailIndicators as defaultSegmentDetailIndicators } from "../data/segmentDetailIndicators";
import { byPeriod as segmentDetailByPeriod, type SegmentDetailPeriodData } from "../data/segmentDetailDummy";
import { membershipIndicators as defaultMembershipIndicators } from "../data/membershipIndicators";
import { byPeriod as membershipByPeriod, type MembershipPeriodData } from "../data/membershipDummy";
import { kpiIndicators as defaultKpiIndicators } from "../data/kpiIndicators";
import { posIndicators as defaultPosIndicators } from "../data/posIndicators";
import { posKpiPeriods, posHourly, posOnlineOffline } from "../data/posDummy";
import type { Indicator, PosKpiPeriod, HourlyBucket, OnlineOfflineRatio } from "../data/types";
import { loadIndicators } from "../lib/loadIndicators";
import { SHEET_ID } from "../config";

interface DataShape {
  homeIndicators: typeof defaultHomeIndicators;
  homeRealtimeIndicators: typeof defaultHomeRealtimeIndicators;
  home: { daily: HomeTabData; weekly: HomeTabData; monthly: HomeTabData };
  homeRealtime: HomeRealtimeData;
  deliveryIndicators: typeof defaultDeliveryIndicators;
  delivery: { daily: DeliveryPeriodSetData; weekly: DeliveryPeriodSetData; monthly: DeliveryPeriodSetData };
  customerCompositionIndicators: typeof defaultCustomerCompositionIndicators;
  customerComposition: { byPeriod: Record<string, CustomerCompositionPeriodData>; segmentTrend: typeof segmentTrend };
  customerDetailIndicators: typeof defaultCustomerDetailIndicators;
  customerDetail: { byPeriod: Record<string, CustomerDetailPeriodData> };
  segmentDetailIndicators: typeof defaultSegmentDetailIndicators;
  segmentDetail: { byPeriod: Record<string, SegmentDetailPeriodData> };
  membershipIndicators: typeof defaultMembershipIndicators;
  membership: { byPeriod: Record<string, MembershipPeriodData> };
  kpiIndicators: typeof defaultKpiIndicators;
  posIndicators: typeof defaultPosIndicators;
  pos: {
    kpiPeriods: Record<string, PosKpiPeriod[]>;
    hourly: Record<string, HourlyBucket[]>;
    onlineOffline: Record<string, OnlineOfflineRatio>;
  };
}

// 지표 표(우측 데이터 목록)에 쓰이는 8개 지표 맵만 구글시트로 덮어씀. 차트 더미 수치(home/delivery/pos 등)는 연동 대상 아님
function mergeIndicators<T extends Record<string, Indicator>>(defaults: T, byId: Record<string, Indicator>): T {
  const merged = {} as T;
  (Object.keys(defaults) as (keyof T)[]).forEach((key) => {
    const def = defaults[key];
    const fetched = byId[def.id];
    merged[key] = (fetched ? { ...fetched } : def) as T[keyof T];
  });
  return merged;
}

const defaultShape: DataShape = {
  homeIndicators: defaultHomeIndicators,
  homeRealtimeIndicators: defaultHomeRealtimeIndicators,
  home: { daily: homeDaily, weekly: homeWeekly, monthly: homeMonthly },
  homeRealtime,
  deliveryIndicators: defaultDeliveryIndicators,
  delivery: { daily: deliveryDaily, weekly: deliveryWeekly, monthly: deliveryMonthly },
  customerCompositionIndicators: defaultCustomerCompositionIndicators,
  customerComposition: { byPeriod: customerCompositionByPeriod, segmentTrend },
  customerDetailIndicators: defaultCustomerDetailIndicators,
  customerDetail: { byPeriod: customerDetailByPeriod },
  segmentDetailIndicators: defaultSegmentDetailIndicators,
  segmentDetail: { byPeriod: segmentDetailByPeriod },
  membershipIndicators: defaultMembershipIndicators,
  membership: { byPeriod: membershipByPeriod },
  kpiIndicators: defaultKpiIndicators,
  posIndicators: defaultPosIndicators,
  pos: { kpiPeriods: posKpiPeriods, hourly: posHourly, onlineOffline: posOnlineOffline },
};

const DataContext = createContext<DataShape>(defaultShape);

export function useAppData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataShape>(defaultShape);

  // 앱 로드 시 1회만 구글시트를 읽어 지표 표 내용을 덮어씀 (실패하거나 SHEET_ID 미설정 시 내장 더미데이터 그대로 유지)
  useEffect(() => {
    if (!SHEET_ID) return;

    let cancelled = false;
    loadIndicators()
      .then((byId) => {
        if (cancelled) return;
        setData((prev) => ({
          ...prev,
          homeIndicators: mergeIndicators(defaultHomeIndicators, byId),
          homeRealtimeIndicators: mergeIndicators(defaultHomeRealtimeIndicators, byId),
          deliveryIndicators: mergeIndicators(defaultDeliveryIndicators, byId),
          customerCompositionIndicators: mergeIndicators(defaultCustomerCompositionIndicators, byId),
          customerDetailIndicators: mergeIndicators(defaultCustomerDetailIndicators, byId),
          segmentDetailIndicators: mergeIndicators(defaultSegmentDetailIndicators, byId),
          membershipIndicators: mergeIndicators(defaultMembershipIndicators, byId),
          kpiIndicators: mergeIndicators(defaultKpiIndicators, byId),
          posIndicators: mergeIndicators(defaultPosIndicators, byId),
        }));
      })
      .catch(() => {
        // 실패 시 조용히 폴백(내장 더미데이터) 유지
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
