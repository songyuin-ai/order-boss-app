import { useEffect } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import { useAppData } from "../context/DataContext";
import { formatWon, formatCompactWon, formatSignedNumber } from "../utils/format";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  onNavigate: (menuKey: string) => void;
}

export default function HomeScreen({ onPanelChange, onNavigate }: Props) {
  const { homeRealtimeIndicators, homeRealtime } = useAppData();
  const { revenue, orders, aov, weekCumulative, weeklyHourly, last30, updatedAtLabel } = homeRealtime;

  const indicators: Indicator[] = [
    homeRealtimeIndicators.revenue,
    homeRealtimeIndicators.orders,
    homeRealtimeIndicators.aov,
    homeRealtimeIndicators.weekCumulative,
    homeRealtimeIndicators.weeklyHourly,
    homeRealtimeIndicators.last30,
  ];

  useEffect(() => {
    onPanelChange(indicators, "홈 · 실시간 대시보드");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeRealtimeIndicators]);

  return (
    <div className="screen">
      <div className="screen__cards">
        <div className="home-updated">
          <span>홈 · 실시간 · {updatedAtLabel}</span>
        </div>

        <button type="button" className="daterange-entry" onClick={() => onNavigate("dateRangeView")}>
          <span>날짜별 보기 (일간 · 주간 · 월간)</span>
          <span className="daterange-entry__chevron">›</span>
        </button>

        {/* 1~3. 일간 매출/주문건수/객단가 누적 (전일 대비 · 지역 평균 대비) */}
        <Card title="일간 매출 누적" indicator={homeRealtimeIndicators.revenue}>
          <div className="realtime-kpi__value">{formatWon(revenue.value)}</div>
          <div className="realtime-kpi__badges">
            <span className="badge">전일 대비 {formatSignedNumber(revenue.vsYesterdayPct, "%")}</span>
            <span className="badge">지역 평균 대비 {formatSignedNumber(revenue.vsRegionPct, "%")}</span>
          </div>
        </Card>

        <Card title="일간 주문건수 누적" indicator={homeRealtimeIndicators.orders}>
          <div className="realtime-kpi__value">{orders.value.toLocaleString("ko-KR")}건</div>
          <div className="realtime-kpi__badges">
            <span className="badge">전일 대비 {formatSignedNumber(orders.vsYesterdayPct, "%")}</span>
            <span className="badge">지역 평균 대비 {formatSignedNumber(orders.vsRegionPct, "%")}</span>
          </div>
        </Card>

        <Card title="일간 객단가 누적" indicator={homeRealtimeIndicators.aov}>
          <div className="realtime-kpi__value">{formatWon(aov.value)}</div>
          <div className="realtime-kpi__badges">
            <span className="badge">전일 대비 {formatSignedNumber(aov.vsYesterdayPct, "%")}</span>
            <span className="badge">지역 평균 대비 {formatSignedNumber(aov.vsRegionPct, "%")}</span>
          </div>
        </Card>

        {/* 4. 주간 매출 누적 막대 그래프 (요일별 매출·객단가, 아직 도래하지 않은 요일은 막대 없음) */}
        <Card title="주간 매출 누적 (이번 주)" indicator={homeRealtimeIndicators.weekCumulative}>
          <div className="weekday-strip">
            {weekCumulative.map((d) => (
              <div key={d.label} className={`weekday-strip__col${d.isToday ? " is-today" : ""}`}>
                <span className="weekday-strip__day">{d.label}</span>
                <span className="weekday-strip__revenue">
                  {d.revenue !== null ? formatCompactWon(d.revenue) : "–"}
                </span>
                <span className="weekday-strip__aov">
                  {d.aov !== null ? `객단가 ${formatCompactWon(d.aov)}` : "예정"}
                </span>
              </div>
            ))}
          </div>
          <BarChart
            data={weekCumulative.map((d) => ({
              label: d.label,
              value: d.revenue,
              highlight: d.isToday,
            }))}
          />
        </Card>

        {/* 5. 주간 시간대별 주문건수 */}
        <Card title="주간 시간대별 주문건수" indicator={homeRealtimeIndicators.weeklyHourly}>
          <BarChart
            data={weeklyHourly.map((h) => ({
              label: h.label,
              value: h.value,
              valueLabel: `${h.value}건`,
            }))}
            showValueLabels
          />
        </Card>

        {/* 6. 최근 30일 매출 - 포인트/딜리버리 연관 비중 (각각 독립 표시, 드릴다운 진입점) */}
        <Card title="최근 30일 매출" indicator={homeRealtimeIndicators.last30}>
          <div className="home-headline" style={{ padding: 0, marginBottom: 12 }}>
            <span className="home-headline__label">총 매출</span>
            <span className="home-headline__value" style={{ fontSize: 22 }}>
              {formatWon(last30.totalRevenue)}
            </span>
          </div>

          <div className="meter-row" onClick={() => onNavigate("membership")} role="button" tabIndex={0}>
            <div className="meter-row__head">
              <span className="meter-row__label">포인트 연관 매출 비중</span>
              <span className="meter-row__pct">{last30.membershipRevenuePct}%</span>
            </div>
            <div className="meter-bar">
              <div className="meter-bar__fill" style={{ width: `${last30.membershipRevenuePct}%` }} />
            </div>
            <span className="meter-row__cta">멤버십 고객 분석 상세보기 ›</span>
          </div>

          <div className="meter-row" onClick={() => onNavigate("deliveryCustomer")} role="button" tabIndex={0}>
            <div className="meter-row__head">
              <span className="meter-row__label">딜리버리 연관 매출 비중</span>
              <span className="meter-row__pct">{last30.deliveryRevenuePct}%</span>
            </div>
            <div className="meter-bar">
              <div className="meter-bar__fill meter-bar__fill--alt" style={{ width: `${last30.deliveryRevenuePct}%` }} />
            </div>
            <span className="meter-row__cta">딜리버리 고객 분석 상세보기 ›</span>
          </div>

          <p className="chart-note">
            ※ 두 비중은 서로 다른 기준(포인트 적립·사용 여부 / 배달앱 채널 여부)으로 각각 집계되어 일부 주문에서
            중첩될 수 있습니다 (예: 배달 주문에서 포인트 적립·사용). 두 비중의 합은 전체 매출 비중을 의미하지
            않습니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
