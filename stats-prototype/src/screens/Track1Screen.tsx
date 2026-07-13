import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import KpiGrid from "../components/KpiGrid";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import TopMenuList from "../components/TopMenuList";
import SegmentedNav from "../components/SegmentedNav";
import { track1Indicators } from "../data/track1Indicators";
import { today, week, month, type Track1TabData } from "../data/track1Dummy";
import { formatCompactWon } from "../utils/format";
import { IndicatorContext } from "../context/IndicatorContext";
import type { Indicator } from "../data/types";

const TABS = [
  { key: "today", label: "오늘" },
  { key: "week", label: "이번 주" },
  { key: "month", label: "이번 달" },
];

const TAB_DATA: Record<string, Track1TabData> = { today, week, month };

const TAB_LABEL: Record<string, string> = {
  today: "오늘 탭 기준",
  week: "이번 주 탭 기준",
  month: "이번 달 탭 기준",
};

const TAB_INDICATORS: Record<string, Indicator[]> = {
  today: [
    track1Indicators.revenue,
    track1Indicators.orders,
    track1Indicators.aov,
    track1Indicators.cancelRate,
    track1Indicators.hourly,
    track1Indicators.topMenu,
    track1Indicators.deliveryRatio,
    track1Indicators.channelRevenue,
  ],
  week: [
    track1Indicators.weekdayCumulative,
    track1Indicators.revenue,
    track1Indicators.orders,
    track1Indicators.aov,
    track1Indicators.cancelRate,
    track1Indicators.hourly,
    track1Indicators.topMenu,
    track1Indicators.deliveryRatio,
    track1Indicators.channelRevenue,
  ],
  month: [
    track1Indicators.revenue,
    track1Indicators.orders,
    track1Indicators.aov,
    track1Indicators.cancelRate,
    track1Indicators.hourly,
    track1Indicators.weekdayAverage,
    track1Indicators.topMenu,
    track1Indicators.deliveryRatio,
    track1Indicators.channelRevenue,
  ],
};

function HourlyCard({ data }: { data: Track1TabData }) {
  return (
    <Card title="시간대별 분포" indicator={track1Indicators.hourly}>
      <BarChart
        data={data.hourly.map((h) => ({ label: h.label, value: h.value, valueLabel: `${h.value}건` }))}
        showValueLabels
      />
    </Card>
  );
}

function KpiCard({ data }: { data: Track1TabData }) {
  return (
    <KpiGrid
      data={data.kpi}
      indicators={{
        revenue: track1Indicators.revenue,
        orders: track1Indicators.orders,
        aov: track1Indicators.aov,
        cancelRate: track1Indicators.cancelRate,
      }}
    />
  );
}

function TopMenuCard({ data }: { data: Track1TabData }) {
  return (
    <Card title="인기 메뉴 Top 3" indicator={track1Indicators.topMenu}>
      <TopMenuList items={data.topMenu} />
    </Card>
  );
}

function DeliveryCard({ data }: { data: Track1TabData }) {
  return (
    <Card title="배달/픽업 비중" indicator={track1Indicators.deliveryRatio}>
      <DonutChart {...data.deliveryRatio} />
    </Card>
  );
}

function ChannelCard({ data }: { data: Track1TabData }) {
  const opacities = [1, 0.85, 0.7, 0.55, 0.4];
  return (
    <Card title="채널별 매출" indicator={track1Indicators.channelRevenue}>
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

function WeekdayCumulativeCard({ data }: { data: Track1TabData }) {
  if (!data.weekdayCumulative) return null;
  return (
    <Card title="요일별 누적 (이번 주)" indicator={track1Indicators.weekdayCumulative}>
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

function WeekdayAverageCard({ data }: { data: Track1TabData }) {
  if (!data.weekdayAverage) return null;
  return (
    <Card title="요일별 평균 (이번 달)" indicator={track1Indicators.weekdayAverage}>
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
  const data = TAB_DATA[tab];

  useEffect(() => {
    onPanelChange(TAB_INDICATORS[tab], TAB_LABEL[tab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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
            <KpiCard data={data} />
            <HourlyCard data={data} />
            <TopMenuCard data={data} />
            <DeliveryCard data={data} />
            <ChannelCard data={data} />
          </>
        )}
        {tab === "week" && (
          <>
            <WeekdayCumulativeCard data={data} />
            <KpiCard data={data} />
            <HourlyCard data={data} />
            <TopMenuCard data={data} />
            <DeliveryCard data={data} />
            <ChannelCard data={data} />
          </>
        )}
        {tab === "month" && (
          <>
            <KpiCard data={data} />
            <HourlyCard data={data} />
            <WeekdayAverageCard data={data} />
            <TopMenuCard data={data} />
            <DeliveryCard data={data} />
            <ChannelCard data={data} />
          </>
        )}
      </div>
    </div>
  );
}
