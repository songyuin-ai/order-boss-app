import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import KpiGrid from "../components/KpiGrid";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import TopMenuList from "../components/TopMenuList";
import SegmentedNav from "../components/SegmentedNav";
import { formatCompactWon } from "../utils/format";
import { IndicatorContext } from "../context/IndicatorContext";
import { useAppData } from "../context/DataContext";
import type { Indicator } from "../data/types";
import type { Track1TabData } from "../data/track1Dummy";
import type { track1Indicators as Track1IndicatorMap } from "../data/track1Indicators";

const TABS = [
  { key: "today", label: "오늘" },
  { key: "week", label: "이번 주" },
  { key: "month", label: "이번 달" },
];

const TAB_LABEL: Record<string, string> = {
  today: "오늘 탭 기준",
  week: "이번 주 탭 기준",
  month: "이번 달 탭 기준",
};

type IndicatorMap = typeof Track1IndicatorMap;

function buildTabIndicators(indicators: IndicatorMap): Record<string, Indicator[]> {
  return {
    today: [
      indicators.revenue,
      indicators.orders,
      indicators.aov,
      indicators.cancelRate,
      indicators.hourly,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
    week: [
      indicators.weekdayCumulative,
      indicators.revenue,
      indicators.orders,
      indicators.aov,
      indicators.cancelRate,
      indicators.hourly,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
    month: [
      indicators.revenue,
      indicators.orders,
      indicators.aov,
      indicators.cancelRate,
      indicators.hourly,
      indicators.weekdayAverage,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
  };
}

function HourlyCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  return (
    <Card title="시간대별 분포" indicator={indicators.hourly}>
      <BarChart
        data={data.hourly.map((h) => ({ label: h.label, value: h.value, valueLabel: `${h.value}건` }))}
        showValueLabels
      />
    </Card>
  );
}

function KpiCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  return (
    <KpiGrid
      data={data.kpi}
      indicators={{
        revenue: indicators.revenue,
        orders: indicators.orders,
        aov: indicators.aov,
        cancelRate: indicators.cancelRate,
      }}
    />
  );
}

function TopMenuCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  return (
    <Card title="인기 메뉴 Top 3" indicator={indicators.topMenu}>
      <TopMenuList items={data.topMenu} />
    </Card>
  );
}

function DeliveryCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  return (
    <Card title="배달/픽업 비중" indicator={indicators.deliveryRatio}>
      <DonutChart {...data.deliveryRatio} />
    </Card>
  );
}

function ChannelCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  const opacities = [1, 0.85, 0.7, 0.55, 0.4];
  return (
    <Card title="채널별 매출" indicator={indicators.channelRevenue}>
      <BarChart
        data={data.channelRevenue.map((c, i) => ({
          label: c.channel,
          value: c.value,
          valueLabel: formatCompactWon(c.value),
          opacity: opacities[i],
        }))}
        showValueLabels
      />
    </Card>
  );
}

function WeekdayCumulativeCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  if (!data.weekdayCumulative) return null;
  return (
    <Card title="요일별 누적 (이번 주)" indicator={indicators.weekdayCumulative}>
      <BarChart
        data={data.weekdayCumulative.map((w) => ({
          label: w.label,
          value: w.value,
          highlight: w.isToday,
          valueLabel: w.value !== null ? formatCompactWon(w.value) : "",
        }))}
        showValueLabels
      />
      <p className="chart-note">막대 없음 = 아직 지나지 않은 요일 · 강조색 = 오늘</p>
    </Card>
  );
}

function WeekdayAverageCard({ data, indicators }: { data: Track1TabData; indicators: IndicatorMap }) {
  if (!data.weekdayAverage) return null;
  return (
    <Card title="요일별 평균 (이번 달)" indicator={indicators.weekdayAverage}>
      <BarChart
        data={data.weekdayAverage.map((w) => ({
          label: w.label,
          value: w.value,
          valueLabel: w.value !== null ? formatCompactWon(w.value) : "",
        }))}
        showValueLabels
      />
      <p className="chart-note">요일 합계 ÷ 지나간 횟수</p>
    </Card>
  );
}

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function Track1Screen({ onPanelChange }: Props) {
  const [tab, setTab] = useState("today");
  const { clear } = useContext(IndicatorContext);
  const { track1Indicators, track1 } = useAppData();
  const data = track1[tab as keyof typeof track1];
  const tabIndicators = buildTabIndicators(track1Indicators);

  useEffect(() => {
    onPanelChange(tabIndicators[tab], TAB_LABEL[tab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, track1Indicators]);

  const handleTabChange = (t: string) => {
    setTab(t);
    clear();
  };

  return (
    <div className="screen">
      <SegmentedNav options={TABS} active={tab} onChange={handleTabChange} size="sm" />
      <div className="screen__cards">
        {tab === "today" && (
          <>
            <KpiCard data={data} indicators={track1Indicators} />
            <HourlyCard data={data} indicators={track1Indicators} />
            <TopMenuCard data={data} indicators={track1Indicators} />
            <DeliveryCard data={data} indicators={track1Indicators} />
            <ChannelCard data={data} indicators={track1Indicators} />
          </>
        )}
        {tab === "week" && (
          <>
            <WeekdayCumulativeCard data={data} indicators={track1Indicators} />
            <KpiCard data={data} indicators={track1Indicators} />
            <HourlyCard data={data} indicators={track1Indicators} />
            <TopMenuCard data={data} indicators={track1Indicators} />
            <DeliveryCard data={data} indicators={track1Indicators} />
            <ChannelCard data={data} indicators={track1Indicators} />
          </>
        )}
        {tab === "month" && (
          <>
            <KpiCard data={data} indicators={track1Indicators} />
            <HourlyCard data={data} indicators={track1Indicators} />
            <WeekdayAverageCard data={data} indicators={track1Indicators} />
            <TopMenuCard data={data} indicators={track1Indicators} />
            <DeliveryCard data={data} indicators={track1Indicators} />
            <ChannelCard data={data} indicators={track1Indicators} />
          </>
        )}
      </div>
    </div>
  );
}
