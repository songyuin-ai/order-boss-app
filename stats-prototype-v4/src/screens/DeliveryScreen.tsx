import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import KpiGrid from "../components/KpiGrid";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import TopMenuList from "../components/TopMenuList";
import SegmentedNav from "../components/SegmentedNav";
import DateNav from "../components/DateNav";
import { formatCompactWon } from "../utils/format";
import { IndicatorContext } from "../context/IndicatorContext";
import { useAppData } from "../context/DataContext";
import type { Indicator } from "../data/types";
import type { DeliveryPeriodSetData } from "../data/deliveryDummy";
import type { deliveryIndicators as DeliveryIndicatorMap } from "../data/deliveryIndicators";

const TABS = [
  { key: "daily", label: "일간" },
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
];

const TAB_LABEL: Record<string, string> = {
  daily: "일간 탭 기준",
  weekly: "주간 탭 기준",
  monthly: "월간 탭 기준",
};

type IndicatorMap = typeof DeliveryIndicatorMap;

function buildTabIndicators(indicators: IndicatorMap): Record<string, Indicator[]> {
  return {
    daily: [
      indicators.revenue,
      indicators.orders,
      indicators.aov,
      indicators.cancelRate,
      indicators.hourlyOrders,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
    weekly: [
      indicators.weekdayCumulative,
      indicators.revenue,
      indicators.orders,
      indicators.aov,
      indicators.cancelRate,
      indicators.dailyAvgRevenue,
      indicators.dailyAvgOrders,
      indicators.hourlyOrdersAvg,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
    monthly: [
      indicators.revenue,
      indicators.orders,
      indicators.aov,
      indicators.cancelRate,
      indicators.dailyAvgRevenue,
      indicators.dailyAvgOrders,
      indicators.hourlyOrdersAvg,
      indicators.weekdayAverage,
      indicators.topMenu,
      indicators.deliveryRatio,
      indicators.channelRevenue,
    ],
  };
}

function HourlyCard({ tab, data, indicators }: { tab: string; data: DeliveryPeriodSetData; indicators: IndicatorMap }) {
  const isDaily = tab === "daily";
  const hourlyIndicator = isDaily ? indicators.hourlyOrders : indicators.hourlyOrdersAvg;
  return (
    <Card title={isDaily ? "시간대별 주문건수" : "시간대별 주문건수 (일평균)"} indicator={hourlyIndicator}>
      <BarChart
        data={data.hourly.map((h) => ({ label: h.label, value: h.value, valueLabel: `${h.value}건` }))}
        showValueLabels
      />
    </Card>
  );
}

function TopMenuCard({ data, indicators }: { data: DeliveryPeriodSetData; indicators: IndicatorMap }) {
  return (
    <Card title="인기 메뉴 Top 3" indicator={indicators.topMenu}>
      <TopMenuList items={data.topMenu} />
    </Card>
  );
}

function DeliveryRatioCard({ data, indicators }: { data: DeliveryPeriodSetData; indicators: IndicatorMap }) {
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

function ChannelCard({ data, indicators }: { data: DeliveryPeriodSetData; indicators: IndicatorMap }) {
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

function WeekdayCumulativeCard({ data, indicators }: { data: DeliveryPeriodSetData; indicators: IndicatorMap }) {
  if (!data.weekdayCumulative) return null;
  return (
    <Card title="요일별 누적 (최근 주)" indicator={indicators.weekdayCumulative}>
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

function WeekdayAverageCard({ data, indicators }: { data: DeliveryPeriodSetData; indicators: IndicatorMap }) {
  if (!data.weekdayAverage) return null;
  return (
    <Card title="요일별 평균 (최근 달)" indicator={indicators.weekdayAverage}>
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
  const [tab, setTab] = useState("daily");
  const [periodIndex, setPeriodIndex] = useState(0);
  const { clear } = useContext(IndicatorContext);
  const { deliveryIndicators, delivery } = useAppData();
  const data = delivery[tab as keyof typeof delivery];
  const tabIndicators = buildTabIndicators(deliveryIndicators);

  const periods = data.kpiPeriods;
  const period = periods[periodIndex] ?? periods[0];

  useEffect(() => {
    onPanelChange(tabIndicators[tab], TAB_LABEL[tab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, deliveryIndicators]);

  const handleTabChange = (t: string) => {
    setTab(t);
    setPeriodIndex(0);
    clear();
  };

  const handlePeriodChange = (delta: number) => {
    setPeriodIndex((i) => Math.min(Math.max(i + delta, 0), periods.length - 1));
    clear();
  };

  if (!period) {
    return (
      <div className="screen">
        <SegmentedNav options={TABS} active={tab} onChange={handleTabChange} size="sm" />
        <div className="screen__cards">
          <div className="placeholder">
            <div className="placeholder__text">표시할 데이터가 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <SegmentedNav options={TABS} active={tab} onChange={handleTabChange} size="sm" />
      <div className="screen__cards">
        <DateNav
          label={period.periodLabel}
          onPrev={() => handlePeriodChange(1)}
          onNext={() => handlePeriodChange(-1)}
          canPrev={periodIndex < periods.length - 1}
          canNext={periodIndex > 0}
        />

        {tab === "daily" && (
          <>
            <KpiGrid
              data={period}
              indicators={{
                revenue: deliveryIndicators.revenue,
                orders: deliveryIndicators.orders,
                aov: deliveryIndicators.aov,
                cancelRate: deliveryIndicators.cancelRate,
              }}
            />
            <HourlyCard tab={tab} data={data} indicators={deliveryIndicators} />
            <TopMenuCard data={data} indicators={deliveryIndicators} />
            <DeliveryRatioCard data={data} indicators={deliveryIndicators} />
            <ChannelCard data={data} indicators={deliveryIndicators} />
          </>
        )}
        {tab === "weekly" && (
          <>
            <WeekdayCumulativeCard data={data} indicators={deliveryIndicators} />
            <KpiGrid
              data={period}
              indicators={{
                revenue: deliveryIndicators.revenue,
                orders: deliveryIndicators.orders,
                aov: deliveryIndicators.aov,
                cancelRate: deliveryIndicators.cancelRate,
              }}
              dailyAvgIndicators={{ revenue: deliveryIndicators.dailyAvgRevenue, orders: deliveryIndicators.dailyAvgOrders }}
            />
            <HourlyCard tab={tab} data={data} indicators={deliveryIndicators} />
            <TopMenuCard data={data} indicators={deliveryIndicators} />
            <DeliveryRatioCard data={data} indicators={deliveryIndicators} />
            <ChannelCard data={data} indicators={deliveryIndicators} />
          </>
        )}
        {tab === "monthly" && (
          <>
            <KpiGrid
              data={period}
              indicators={{
                revenue: deliveryIndicators.revenue,
                orders: deliveryIndicators.orders,
                aov: deliveryIndicators.aov,
                cancelRate: deliveryIndicators.cancelRate,
              }}
              dailyAvgIndicators={{ revenue: deliveryIndicators.dailyAvgRevenue, orders: deliveryIndicators.dailyAvgOrders }}
            />
            <HourlyCard tab={tab} data={data} indicators={deliveryIndicators} />
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
