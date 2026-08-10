export type PeriodTab = "lastWeek" | "lastMonth";

export const PERIOD_TABS: { key: PeriodTab; label: string }[] = [
  { key: "lastWeek", label: "지난 주" },
  { key: "lastMonth", label: "지난 달" },
];

export const DEFAULT_PERIOD_TAB: PeriodTab = "lastMonth";
