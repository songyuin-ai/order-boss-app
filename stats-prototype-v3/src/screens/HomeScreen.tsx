import { useEffect } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
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
    homeRealtimeIndicators.deliveryShare,
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

        {/* [2순위] 최근 30일 상세분석 리포트 후킹 카드 — 게이지 하나에 우리 수치·지역 평균을 모두 담아 중복 설명 없이 바로 이해되게 */}
        <Card title="최근 30일 상세분석 리포트 보기" indicator={homeRealtimeIndicators.last30} className="hook-card">
          <div className="hook-cta" onClick={() => onNavigate("membership")} role="button" tabIndex={0}>
            <div className="gauge-hero">
              <div
                className="gauge-hero__ring"
                style={{
                  background: `conic-gradient(from -90deg, var(--accent) 0deg, var(--accent) ${
                    last30.membershipCustomerPct * 1.8
                  }deg, var(--track) ${last30.membershipCustomerPct * 1.8}deg 180deg, transparent 180deg 360deg)`,
                }}
              />
              <div
                className="gauge-hero__marker"
                style={{ transform: `translateX(-50%) rotate(${(last30.membershipRegionAvgPct - 50) * 1.8}deg)` }}
              />
              <div className="gauge-hero__hole">
                <div className="gauge-hero__num">{last30.membershipCustomerPct}%</div>
                <div className="gauge-hero__caption">상세분석 가능한 손님 비율</div>
                <div className="gauge-hero__region">
                  지역 평균 <b>{last30.membershipRegionAvgPct}%</b>
                </div>
              </div>
            </div>
            <p className="hook-cta__desc">
              포인트를 적립·사용한 손님만큼 상세분석이 가능해요. 적립 손님이 늘수록 리포트도 더 자세해져요.
            </p>
            <span className="meter-row__cta">상세분석 리포트 보기 ›</span>
          </div>
        </Card>

        {/* 딜리버리 점유율 — 포인트 리포트와 기준(손님 수 vs 매출)이 달라 별도 섹션으로 분리 */}
        <Card title="딜리버리 점유율" indicator={homeRealtimeIndicators.deliveryShare}>
          <div className="delivery-share" onClick={() => onNavigate("deliveryCustomer")} role="button" tabIndex={0}>
            <DonutChart
              primaryValue={last30.deliveryRevenuePct}
              secondaryValue={Math.round((100 - last30.deliveryRevenuePct) * 10) / 10}
              primaryLabel="딜리버리"
              secondaryLabel="그 외"
            />
            <div className="delivery-share__body">
              <div className="delivery-share__amount">최근 30일 딜리버리 매출 {formatWon(last30.deliveryRevenueAmount)}</div>
              <span className="meter-row__cta">딜리버리 고객 분석 상세보기 ›</span>
            </div>
          </div>
          <p className="chart-note">
            ※ 위 상세분석 리포트 비율은 손님 수 기준, 딜리버리 점유율은 매출 기준으로 서로 다른 지표예요.
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
