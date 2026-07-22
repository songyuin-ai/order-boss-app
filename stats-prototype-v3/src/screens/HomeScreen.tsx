import { useEffect } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import IdBadge from "../components/IdBadge";
import { useAppData } from "../context/DataContext";
import { formatWon, formatCompactWon, formatSignedNumber } from "../utils/format";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  onNavigate: (menuKey: string) => void;
}

export default function HomeScreen({ onPanelChange, onNavigate }: Props) {
  const { homeRealtimeIndicators, homeRealtime } = useAppData();
  const { revenue, orders, aov, weekCumulative, weekTotal, weekdayHourly, last30, updatedAtLabel } = homeRealtime;

  // 1순위(일간 요약) → 2순위(30일 후킹) → 3순위(주간 보충) 순서로, 지표표에도 동일한 우선순위로 노출
  const indicators: Indicator[] = [
    homeRealtimeIndicators.revenue,
    homeRealtimeIndicators.orders,
    homeRealtimeIndicators.aov,
    homeRealtimeIndicators.last30,
    homeRealtimeIndicators.weekCumulative,
    homeRealtimeIndicators.weeklyHourly,
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

        {/* [1순위] 일간 요약 — 매출/주문건수/객단가를 카드 3장이 아니라 하나의 압축 블록으로 */}
        <div className="daily-summary">
          <div className="daily-summary__headline">
            <IdBadge id={homeRealtimeIndicators.revenue.id} />
            <span className="daily-summary__label">오늘 매출</span>
            <span className="daily-summary__value">{formatWon(revenue.value)}</span>
            <div className="daily-summary__badges">
              <span className="badge badge--primary">전일 대비 {formatSignedNumber(revenue.vsYesterdayPct, "%")}</span>
              <span className="badge badge--muted">지역 평균 대비 {formatSignedNumber(revenue.vsRegionPct, "%")}</span>
            </div>
          </div>

          <div className="daily-summary__grid">
            <div className="daily-summary__stat">
              <IdBadge id={homeRealtimeIndicators.orders.id} />
              <span className="daily-summary__stat-label">주문건수</span>
              <span className="daily-summary__stat-value">{orders.value.toLocaleString("ko-KR")}건</span>
              <span className="daily-summary__stat-delta">
                전일 {formatSignedNumber(orders.vsYesterdayPct, "%")} · 지역 {formatSignedNumber(orders.vsRegionPct, "%")}
              </span>
            </div>
            <div className="daily-summary__stat">
              <IdBadge id={homeRealtimeIndicators.aov.id} />
              <span className="daily-summary__stat-label">객단가</span>
              <span className="daily-summary__stat-value">{formatWon(aov.value)}</span>
              <span className="daily-summary__stat-delta">
                전일 {formatSignedNumber(aov.vsYesterdayPct, "%")} · 지역 {formatSignedNumber(aov.vsRegionPct, "%")}
              </span>
            </div>
          </div>
        </div>

        {/* [2순위] 최근 30일 매출 후킹 카드 — 상세분석 관심을 끌어올리는 지점 */}
        <Card title="최근 30일 매출, 얼마나 알고 계세요?" indicator={homeRealtimeIndicators.last30} className="hook-card">
          <div className="home-headline" style={{ padding: 0, marginBottom: 14 }}>
            <span className="home-headline__label">최근 30일 총 매출</span>
            <span className="home-headline__value" style={{ fontSize: 22 }}>
              {formatWon(last30.totalRevenue)}
            </span>
          </div>

          <div className="meter-row" onClick={() => onNavigate("membership")} role="button" tabIndex={0}>
            <div className="meter-row__head">
              <span className="meter-row__label">포인트 연관 매출</span>
              <span className="meter-row__pct">{last30.membershipRevenuePct}%</span>
            </div>
            <div className="meter-row__amount">{formatWon(last30.membershipRevenueAmount)}</div>
            <div className="meter-bar">
              <div className="meter-bar__fill" style={{ width: `${last30.membershipRevenuePct}%` }} />
              <div className="meter-bar__marker" style={{ left: `${last30.membershipRegionAvgPct}%` }} />
            </div>
            <div className="meter-row__region-caption">▸ 지역 평균 {last30.membershipRegionAvgPct}%</div>
            <span className="meter-row__hook">
              포인트 연관 매출은 고객 상세분석까지 확인할 수 있어요 — 인근매장은 평균{" "}
              {last30.membershipRegionAvgPct}%까지 분석 가능해요
            </span>
            <span className="meter-row__cta">멤버십 고객 분석 상세보기 ›</span>
          </div>

          <div className="meter-row" onClick={() => onNavigate("deliveryCustomer")} role="button" tabIndex={0}>
            <div className="meter-row__head">
              <span className="meter-row__label">딜리버리 매출 비중</span>
              <span className="meter-row__pct">{last30.deliveryRevenuePct}%</span>
            </div>
            <div className="meter-row__amount">{formatWon(last30.deliveryRevenueAmount)}</div>
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

        {/* [3순위] 주간 상세 — 관심 있는 점주만 스크롤해서 보는 보충 자료 */}
        <div className="section-label">주간 상세</div>

        <Card title="주간 매출 누적 (이번 주)" indicator={homeRealtimeIndicators.weekCumulative}>
          <div className="week-total">
            <span className="week-total__value">{formatWon(weekTotal.value)}</span>
            <div className="week-total__badges">
              <span className="badge badge--primary">전주 대비 {formatSignedNumber(weekTotal.vsLastWeekPct, "%")}</span>
              <span className="badge badge--muted">지역 평균 대비 {formatSignedNumber(weekTotal.vsRegionPct, "%")}</span>
            </div>
          </div>
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

        <Card title="주간 시간대별 주문건수" indicator={homeRealtimeIndicators.weeklyHourly}>
          {weekdayHourly.map((day) => (
            <div key={day.day} className="weekday-hourly-group">
              <div className="weekday-hourly-group__day">
                {day.day}
                {day.isToday ? " (오늘)" : ""}
              </div>
              <BarChart
                data={day.hourly.map((h) => ({
                  label: h.label,
                  value: h.value,
                  valueLabel: h.value !== null ? `${h.value}건` : "",
                }))}
                height={64}
                showValueLabels
              />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
