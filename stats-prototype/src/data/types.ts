export interface Indicator {
  id: string;
  지표명: string;
  정의: string;
  원천데이터_및_산식: string;
  제공목적: string;
  차트형태: string;
}

export interface KpiData {
  revenue: number;
  orders: number;
  aov: number;
  cancelRate: number;
  revenueDelta: number;
  ordersDelta: number;
  aovDelta: number;
  cancelDelta: number;
  compareLabel: string;
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
