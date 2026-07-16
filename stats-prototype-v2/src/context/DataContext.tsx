import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Indicator } from "../data/types";
import { track1Indicators as defaultTrack1Indicators } from "../data/track1Indicators";
import {
  track2Group1Indicators as defaultGroup1Indicators,
  track2Group2Indicators as defaultGroup2Indicators,
  track2Group3Indicators as defaultGroup3Indicators,
} from "../data/track2Indicators";
import { today as defaultToday, week as defaultWeek, month as defaultMonth, type Track1TabData } from "../data/track1Dummy";
import * as defaultTrack2Dummy from "../data/track2Dummy";
import type { SegmentChip } from "../data/track2Dummy";
import { loadLiveData, type LiveData } from "../lib/loadLiveData";
import { SHEET_ID } from "../config";

interface Track2Data {
  customerComposition: { loyalPct: number; deltaLabel: string; chips: SegmentChip[] };
  demographicDistribution: { label: string; pct: number }[];
  segmentTrend: { month: string; 단골: number; 신규: number }[];
  preferredCategory: string[];
  agePreferredProducts: Record<string, { name: string; revenue: number }[]>;
  loyalPreferredProducts: { name: string; revenue: number }[];
  visitTimeText: string;
  revisitCycle: { value: string; label: string };
  hValue: { pct: number; deltaLabel: string };
  segmentContribution: { segment: string; revenueShare: number; aov: number }[];
  gcrmCompare: {
    metric: string;
    ours: string;
    nearby: string;
    secondaryMetric: string;
    oursSecondary: string;
    nearbySecondary: string;
  };
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
  track1Indicators: typeof defaultTrack1Indicators;
  track2Group1Indicators: typeof defaultGroup1Indicators;
  track2Group2Indicators: typeof defaultGroup2Indicators;
  track2Group3Indicators: typeof defaultGroup3Indicators;
  track1: { today: Track1TabData; week: Track1TabData; month: Track1TabData };
  track2: Track2Data;
  status: "loading" | "live" | "fallback";
}

const defaultShape: DataShape = {
  track1Indicators: defaultTrack1Indicators,
  track2Group1Indicators: defaultGroup1Indicators,
  track2Group2Indicators: defaultGroup2Indicators,
  track2Group3Indicators: defaultGroup3Indicators,
  track1: { today: defaultToday, week: defaultWeek, month: defaultMonth },
  track2: { ...defaultTrack2Dummy },
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
          track1Indicators: mergeIndicators(defaultTrack1Indicators, live.indicatorsById),
          track2Group1Indicators: mergeIndicators(defaultGroup1Indicators, live.indicatorsById),
          track2Group2Indicators: mergeIndicators(defaultGroup2Indicators, live.indicatorsById),
          track2Group3Indicators: mergeIndicators(defaultGroup3Indicators, live.indicatorsById),
          track1: {
            today: { ...defaultToday, ...live.track1.today },
            week: { ...defaultWeek, ...live.track1.week },
            month: { ...defaultMonth, ...live.track1.month },
          },
          track2: { ...defaultTrack2Dummy, ...live.track2 },
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
