import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import SegmentedNav from "../components/SegmentedNav";
import DateNav from "../components/DateNav";
import IdBadge from "../components/IdBadge";
import { IndicatorContext } from "../context/IndicatorContext";
import { useAppData } from "../context/DataContext";
import { formatWon, formatCompactWon } from "../utils/format";
import type { Indicator } from "../data/types";

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

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  onNavigate: (menuKey: string) => void;
}

export default function DateRangeViewScreen({ onPanelChange, onNavigate }: Props) {
  const [tab, setTab] = useState("daily");
  const [periodIndex, setPeriodIndex] = useState(0);
  const { clear } = useContext(IndicatorContext);
  const { homeIndicators, home } = useAppData();

  const data = home[tab as keyof typeof home];
  const periods = data.kpiPeriods;
  const period = periods[periodIndex] ?? periods[0];
  const isToday = tab === "daily" && periodIndex === 0;

  const tabIndicators: Indicator[] = [
    homeIndicators.revenue,
    homeIndicators.orders,
    homeIndicators.aov,
    ...(isToday ? [homeIndicators.live] : []),
    homeIndicators.weekday,
    homeIndicators.onlineOffline,
    homeIndicators.channelRevenue,
  ];

  useEffect(() => {
    onPanelChange(tabIndicators, TAB_LABEL[tab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, periodIndex, homeIndicators]);

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
        <button type="button" className="screen-back" onClick={() => onNavigate("home")}>
          ‹ 홈
        </button>
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
      <button type="button" className="screen-back" onClick={() => onNavigate("home")}>
        ‹ 홈
      </button>
      <SegmentedNav options={TABS} active={tab} onChange={handleTabChange} size="sm" />
      <div className="screen__cards">
        <DateNav
          label={period.periodLabel}
          onPrev={() => handlePeriodChange(1)}
          onNext={() => handlePeriodChange(-1)}
          canPrev={periodIndex < periods.length - 1}
          canNext={periodIndex > 0}
        />

        <div className="home-headline">
          <IdBadge id={homeIndicators.revenue.id} />
          <span className="home-headline__label">전체 매출 (POS)</span>
          <span className="home-headline__value">{formatWon(period.revenue)}</span>
          <span className="badge">{period.revenueComparisonBadge}</span>
        </div>

        <div className="kpi-grid">
          <div className="kpi-cell">
            <IdBadge id={homeIndicators.orders.id} />
            <div className="kpi-cell__label">주문건수</div>
            <div className="kpi-cell__value">{period.orders.toLocaleString("ko-KR")}건</div>
          </div>
          {isToday && period.liveRevenue !== undefined && (
            <div className="kpi-cell kpi-cell--live">
              <IdBadge id={homeIndicators.live.id} />
              <div className="kpi-cell__label">
                <span className="live-dot" />
                실시간
              </div>
              <div className="kpi-cell__value">{formatCompactWon(period.liveRevenue)}</div>
              <div className="kpi-cell__delta">{period.liveOrders}건</div>
            </div>
          )}
        </div>

        <Card title="객단가 · 요일별 매출" indicator={homeIndicators.weekday}>
          <div className="home-aov-row">
            <span className="home-aov-row__value">{formatWon(period.aov)}</span>
            {period.aovComparisonBadge && <span className="badge">{period.aovComparisonBadge}</span>}
          </div>
          <BarChart
            data={data.weekday.map((w) => ({
              label: w.label,
              value: w.value,
              highlight: w.isToday,
              valueLabel: w.value !== null ? formatCompactWon(w.value) : "",
            }))}
            showValueLabels
          />
        </Card>

        <Card title="온라인/오프라인 점유율" indicator={homeIndicators.onlineOffline}>
          <DonutChart
            primaryValue={data.onlineOffline.offline}
            secondaryValue={data.onlineOffline.online}
            primaryLabel="오프라인"
            secondaryLabel="온라인"
          />
        </Card>

        <Card title="채널별 매출" indicator={homeIndicators.channelRevenue}>
          <BarChart
            data={data.channelRevenue.map((c, i) => ({
              label: c.channel,
              value: c.value,
              valueLabel: formatCompactWon(c.value),
              opacity: 1 - i * 0.13,
            }))}
            showValueLabels
          />
        </Card>
      </div>
    </div>
  );
}
