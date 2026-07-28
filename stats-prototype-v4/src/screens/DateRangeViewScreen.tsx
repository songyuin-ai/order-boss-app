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
  const isDaily = tab === "daily";

  // 마감된 기간은 전일/전주/전월 대비 배지를 보여주고, 진행 중인 현재 기간(오늘/이번 주/이번 달)은
  // 지역 평균 대비 배지만 보여줌 — period.xxxDeltaBadge 유무 자체가 마감 여부를 나타냄
  const tabIndicators: Indicator[] = [
    homeIndicators.revenue,
    homeIndicators.orders,
    homeIndicators.aov,
    ...(!isDaily ? [homeIndicators.weekday] : []),
    homeIndicators.onlineOffline,
    homeIndicators.channelRevenue,
    homeIndicators.topProducts,
    homeIndicators.hourlyOrders,
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
          <div className="daily-summary__badges">
            {period.revenueDeltaBadge && <span className="badge badge--primary">{period.revenueDeltaBadge}</span>}
            <span className="badge badge--muted">{period.revenueRegionBadge}</span>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-cell">
            <IdBadge id={homeIndicators.orders.id} />
            <div className="kpi-cell__label">주문건수</div>
            <div className="kpi-cell__value">{period.orders.toLocaleString("ko-KR")}건</div>
            <div className="kpi-cell__badges">
              {period.ordersDeltaBadge && <span className="badge badge--primary">{period.ordersDeltaBadge}</span>}
              <span className="badge badge--muted">{period.ordersRegionBadge}</span>
            </div>
          </div>
          <div className="kpi-cell">
            <IdBadge id={homeIndicators.aov.id} />
            <div className="kpi-cell__label">객단가</div>
            <div className="kpi-cell__value">{formatWon(period.aov)}</div>
            <div className="kpi-cell__badges">
              {period.aovDeltaBadge && <span className="badge badge--primary">{period.aovDeltaBadge}</span>}
              <span className="badge badge--muted">{period.aovRegionBadge}</span>
            </div>
          </div>
        </div>

        {/* 일간 탭에는 요일별 매출을 노출하지 않음 (하루치 조회에는 요일 분포 차트가 맞지 않음) */}
        {!isDaily && (
          <Card title="요일별 매출" indicator={homeIndicators.weekday}>
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
        )}

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

        <Card title="인기상품 TOP3" indicator={homeIndicators.topProducts}>
          <ul className="menu-list">
            {data.topProducts.map((p) => (
              <li className="menu-list__item" key={p.rank}>
                <span className="menu-list__rank">{p.rank}</span>
                <span className="menu-list__name">{p.name}</span>
                <span className="menu-list__count">{p.orderCount}건</span>
                <span className="badge badge--muted">매출 비중 {p.revenueSharePct}%</span>
              </li>
            ))}
          </ul>
          <p className="chart-note">※ 주문건수 기준 상위 3개 상품이에요.</p>
        </Card>

        <Card
          title={isDaily ? "시간대별 주문건수" : "시간대별 주문건수 (일평균)"}
          indicator={homeIndicators.hourlyOrders}
        >
          <BarChart
            data={data.hourlyOrders.map((h) => ({
              label: h.label,
              value: h.value,
              valueLabel: `${h.value}건`,
            }))}
            showValueLabels
          />
        </Card>
      </div>
    </div>
  );
}
