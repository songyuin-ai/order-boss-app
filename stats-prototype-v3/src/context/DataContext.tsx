import { createContext, useContext, type ReactNode } from "react";
import { homeIndicators } from "../data/homeIndicators";
import { homeDaily, homeWeekly, homeMonthly, type HomeTabData } from "../data/homeDummy";
import { deliveryIndicators } from "../data/deliveryIndicators";
import { daily as deliveryDaily, weekly as deliveryWeekly, monthly as deliveryMonthly, type DeliveryPeriodSetData } from "../data/deliveryDummy";
import { customerCompositionIndicators } from "../data/customerCompositionIndicators";
import { byPeriod as customerCompositionByPeriod, segmentTrend, type CustomerCompositionPeriodData } from "../data/customerCompositionDummy";
import { customerDetailIndicators } from "../data/customerDetailIndicators";
import { byPeriod as customerDetailByPeriod, type CustomerDetailPeriodData } from "../data/customerDetailDummy";
import { membershipIndicators } from "../data/membershipIndicators";
import { byPeriod as membershipByPeriod, type MembershipPeriodData } from "../data/membershipDummy";
import { posIndicators } from "../data/posIndicators";
import { posKpiPeriods, posHourly, posOnlineOffline } from "../data/posDummy";
import type { PosKpiPeriod, HourlyBucket, OnlineOfflineRatio } from "../data/types";

interface DataShape {
  homeIndicators: typeof homeIndicators;
  home: { daily: HomeTabData; weekly: HomeTabData; monthly: HomeTabData };
  deliveryIndicators: typeof deliveryIndicators;
  delivery: { daily: DeliveryPeriodSetData; weekly: DeliveryPeriodSetData; monthly: DeliveryPeriodSetData };
  customerCompositionIndicators: typeof customerCompositionIndicators;
  customerComposition: { byPeriod: Record<string, CustomerCompositionPeriodData>; segmentTrend: typeof segmentTrend };
  customerDetailIndicators: typeof customerDetailIndicators;
  customerDetail: { byPeriod: Record<string, CustomerDetailPeriodData> };
  membershipIndicators: typeof membershipIndicators;
  membership: { byPeriod: Record<string, MembershipPeriodData> };
  posIndicators: typeof posIndicators;
  pos: {
    kpiPeriods: Record<string, PosKpiPeriod[]>;
    hourly: Record<string, HourlyBucket[]>;
    onlineOffline: Record<string, OnlineOfflineRatio>;
  };
}

// v3는 구글시트 연동 없이 더미데이터만 사용 (화면 구조가 먼저 정리된 뒤 별도 요청 시 연동 예정)
const data: DataShape = {
  homeIndicators,
  home: { daily: homeDaily, weekly: homeWeekly, monthly: homeMonthly },
  deliveryIndicators,
  delivery: { daily: deliveryDaily, weekly: deliveryWeekly, monthly: deliveryMonthly },
  customerCompositionIndicators,
  customerComposition: { byPeriod: customerCompositionByPeriod, segmentTrend },
  customerDetailIndicators,
  customerDetail: { byPeriod: customerDetailByPeriod },
  membershipIndicators,
  membership: { byPeriod: membershipByPeriod },
  posIndicators,
  pos: { kpiPeriods: posKpiPeriods, hourly: posHourly, onlineOffline: posOnlineOffline },
};

const DataContext = createContext<DataShape>(data);

export function useAppData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
