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
import type { DeliveryTabData } from "../data/deliveryDummy";
import type { deliveryIndicators as DeliveryIndicatorMap } from "../data/deliveryIndicators";

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

type IndicatorMap = typeof DeliveryIndicatorMap;

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
      indicators.dailyAvgRevenue,
      indicators.dailyAvgOrders,
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
      indicators.dailyAvgRevenue,
      indicators.dailyAvgOrders,
      indicators.hourly,
      indicators.weekdayAverage,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
  };
}

function HourlyCard({ data, indicators }: { data: DeliveryTabData; indicators: IndicatorMap }) {
  return (
    <Card title="시간대별 분포" indicator={indicators.hourly}>
      <BarChart
        data={data.hourly.map((h) => ({ label: h.label, value: h.value, valueLabel: `${h.value}건` }))}
        showValueLabels
      />
    </Card>
  );
}

function KpiCard({ data, indicators, withDailyAvg }: { data: DeliveryTabData; indicators: IndicatorMap; withDailyAvg?: boolean }) {
  return (
    <KpiGrid
      data={data.kpi}
      indicators={{
        revenue: indicators.revenue,
        orders: indicators.orders,
        aov: indicators.aov,
        cancelRate: indicators.cancelRate,
      }}
      dailyAvgIndicators={
        withDailyAvg ? { revenue: indicators.dailyAvgRevenue, orders: indicators.dailyAvgOrders } : undefined
      }
    />
  );
}

function TopMenuCard({ data, indicators }: { data: DeliveryTabData; indicators: IndicatorMap }) {
  return (
    <Card title="인기 메뉴 Top 3" indicator={indicators.topMenu}>
      <TopMenuList items={data.topMenu} />
    </Card>
  );
}

function DeliveryRatioCard({ data, indicators }: { data: DeliveryTabData; indicators: IndicatorMap }) {
  return (
    <Card title="배달/픽업 비중" indicator={indicators.deliveryRatio}>
      <DonutChart
        primaryValue={data.deliveryRatio.delivery}
        secondaryValue={data.deliveryRatio.pickup}
        primaryLabel="배달"
        secondaryLabel="픽업"
      />
    </Card>
  );
}

function ChannelCard({ data, indicators }: { data: DeliveryTabData; indicators: IndicatorMap }) {
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

function WeekdayCumulativeCard({ data, indicators }: { data: DeliveryTabData; indicators: IndicatorMap }) {
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

function WeekdayAverageCard({ data, indicators }: { data: DeliveryTabData; indicators: IndicatorMap }) {
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

export default function DeliveryScreen({ onPanelChange }: Props) {
  const [tab, setTab] = useState("today");
  const { clear } = useContext(IndicatorContext);
  const { deliveryIndicators, delivery } = useAppData();
  const data = delivery[tab as keyof typeof delivery];
  const tabIndicators = buildTabIndicators(deliveryIndicators);

  useEffect(() => {
    onPanelChange(tabIndicators[tab], TAB_LABEL[tab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, deliveryIndicators]);

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
            <KpiCard data={data} indicators={deliveryIndicators} />
            <HourlyCard data={data} indicators={deliveryIndicators} />
            <TopMenuCard data={data} indicators={deliveryIndicators} />
            <DeliveryRatioCard data={data} indicators={deliveryIndicators} />
            <ChannelCard data={data} indicators={deliveryIndicators} />
          </>
        )}
        {tab === "week" && (
          <>
            <WeekdayCumulativeCard data={data} indicators={deliveryIndicators} />
            <KpiCard data={data} indicators={deliveryIndicators} withDailyAvg />
            <HourlyCard data={data} indicators={deliveryIndicators} />
            <TopMenuCard data={data} indicators={deliveryIndicators} />
            <DeliveryRatioCard data={data} indicators={deliveryIndicators} />
            <ChannelCard data={data} indicators={deliveryIndicators} />
          </>
        )}
        {tab === "month" && (
          <>
            <KpiCard data={data} indicators={deliveryIndicators} withDailyAvg />
            <HourlyCard data={data} indicators={deliveryIndicators} />
            <WeekdayAverageCard data={data} indicators={deliveryIndicators} />
            <TopMenuCard data={data} indicators={deliveryIndicators} />
            <DeliveryRatioCard data={data} indicators={deliveryIndicators} />
            <ChannelCard data={data} indicators={deliveryIndicators} />
          </>
        )}
      </div>
    </div>
  );
}
