import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import SegmentedNav from "../components/SegmentedNav";
import DateNav from "../components/DateNav";
import IdBadge from "../components/IdBadge";
import { IndicatorContext } from "../context/IndicatorContext";
import { useAppData } from "../context/DataContext";
import { formatWon } from "../utils/format";
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
}

export default function PosScreen({ onPanelChange }: Props) {
  const [tab, setTab] = useState("daily");
  const [periodIndex, setPeriodIndex] = useState(0);
  const { clear } = useContext(IndicatorContext);
  const { posIndicators, pos } = useAppData();

  const periods = pos.kpiPeriods[tab] ?? [];
  const period = periods[periodIndex] ?? periods[0];
  const hourly = pos.hourly[tab] ?? [];
  const ratio = pos.onlineOffline[tab];
  const showDailyAvg = tab !== "daily";

  const tabIndicators: Indicator[] = [
    posIndicators.totalRevenue,
    posIndicators.totalOrders,
    ...(showDailyAvg ? [posIndicators.dailyAvgRevenue, posIndicators.dailyAvgOrders] : []),
    posIndicators.onlineOffline,
    posIndicators.aov,
    posIndicators.hourly,
  ];

  useEffect(() => {
    onPanelChange(tabIndicators, TAB_LABEL[tab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, posIndicators]);

  const handleTabChange = (t: string) => {
    setTab(t);
    setPeriodIndex(0);
    clear();
  };

  const handlePeriodChange = (delta: number) => {
    setPeriodIndex((i) => Math.min(Math.max(i + delta, 0), periods.length - 1));
    clear();
  };

  if (!period || !ratio) {
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

        <div className="kpi-grid">
          <div className="kpi-cell">
            <IdBadge id={posIndicators.totalRevenue.id} />
            <div className="kpi-cell__label">전체 매출</div>
            <div className="kpi-cell__value">{formatWon(period.totalRevenue)}</div>
          </div>
          <div className="kpi-cell">
            <IdBadge id={posIndicators.totalOrders.id} />
            <div className="kpi-cell__label">전체 건수</div>
            <div className="kpi-cell__value">{period.totalOrders.toLocaleString("ko-KR")}건</div>
          </div>
          {showDailyAvg && period.dailyAvgRevenue !== undefined && (
            <div className="kpi-cell">
              <IdBadge id={posIndicators.dailyAvgRevenue.id} />
              <div className="kpi-cell__label">일평균 매출</div>
              <div className="kpi-cell__value">{formatWon(Math.round(period.dailyAvgRevenue))}</div>
            </div>
          )}
          {showDailyAvg && period.dailyAvgOrders !== undefined && (
            <div className="kpi-cell">
              <IdBadge id={posIndicators.dailyAvgOrders.id} />
              <div className="kpi-cell__label">일평균 건수</div>
              <div className="kpi-cell__value">{Math.round(period.dailyAvgOrders).toLocaleString("ko-KR")}건</div>
            </div>
          )}
          <div className="kpi-cell">
            <IdBadge id={posIndicators.aov.id} />
            <div className="kpi-cell__label">객단가</div>
            <div className="kpi-cell__value">{formatWon(period.aov)}</div>
          </div>
        </div>

        <Card title="오프라인/온라인 점유율" indicator={posIndicators.onlineOffline}>
          <DonutChart
            primaryValue={ratio.offline}
            secondaryValue={ratio.online}
            primaryLabel="오프라인"
            secondaryLabel="온라인"
          />
        </Card>

        <Card title="시간대별 주문현황" indicator={posIndicators.hourly}>
          <BarChart
            data={hourly.map((h) => ({ label: h.label, value: h.value, valueLabel: `${h.value}건` }))}
            showValueLabels
          />
        </Card>
      </div>
    </div>
  );
}
