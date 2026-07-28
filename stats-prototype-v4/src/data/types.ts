export interface Indicator {
  id: string;
  지표명: string;
  실시간여부: "Y" | "N";
  실시간참고?: string; // "실시간" 배지 옆 ⓘ 툴팁 — 탭 기반 화면처럼 진행 중 기간에만 실시간이 적용되는 경우의 예외 설명
  정의: string;
  원천데이터_및_산식: string;
  제공목적: string;
  차트형태: string;
  노출?: string;
  참고?: string;
}

export interface PosKpiPeriod {
  periodLabel: string;
  totalRevenue: number;
  totalOrders: number;
  dailyAvgRevenue?: number;
  dailyAvgOrders?: number;
  aov: number;
}

export interface OnlineOfflineRatio {
  online: number;
  offline: number;
}

export interface HourlyBucket {
  label: string;
  value: number;
}

export interface WeekdayBar {
  label: string;
  value: number | null;
  isToday?: boolean;
}

export interface MenuItem {
  rank: number;
  name: string;
  count: number;
}

export interface DeliveryRatio {
  delivery: number;
  pickup: number;
}

export interface ChannelRevenue {
  channel: string;
  value: number;
}
