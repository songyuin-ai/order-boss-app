import { useEffect, useState } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import IdBadge from "../components/IdBadge";
import { useAppData } from "../context/DataContext";
import { MEMBERSHIP_CUSTOMER_PCT_BY_CASE } from "../data/homeDummy";
import { formatWon, formatCompactWon, formatSignedNumber } from "../utils/format";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  onNavigate: (menuKey: string) => void;
}

export default function HomeScreen({ onPanelChange, onNavigate }: Props) {
  const { homeRealtimeIndicators, homeRealtime } = useAppData();
  const { revenue, orders, aov, weekCumulative, weekTotal, weekdayHourly, last30, updatedAtLabel } = homeRealtime;

  // 프로토타입 데모용 — 지역 평균 대비 낮음/높음 두 시나리오를 케이스 전환 버튼으로 바로 보여줌
  const [membershipCase, setMembershipCase] = useState<"low" | "high">("low");
  const membershipCustomerPct = MEMBERSHIP_CUSTOMER_PCT_BY_CASE[membershipCase];

  const regionGapRaw = last30.membershipRegionAvgPct - membershipCustomerPct;
  const isBelowRegionAvg = regionGapRaw > 0;
  const regionGap = Math.round(Math.abs(regionGapRaw) * 10) / 10;

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

        {/* [2순위] 최근 30일 상세분석 리포트 후킹 카드
            읽는 순서 = 기대(혜택) → 질문 → 숫자(답) → 이유 → 지역 비교 → CTA.
            숫자·조건을 헤드라인에 먼저 밝히면 "아 일부만이네"로 곧장 넘어가버려 기대감이 생략되므로,
            일반적인 혜택 문장을 먼저 보여준 뒤에야 게이지 숫자를 그 질문에 대한 답처럼 등장시킴 */}
        <Card title="최근 30일 상세분석 리포트 보기" indicator={homeRealtimeIndicators.last30} className="hook-card">
          <div className="hook-cta" onClick={() => onNavigate("membership")} role="button" tabIndex={0}>
            <div className="benefit-lead">우리 매장 손님, 상세히 알 수 있어요</div>
            <div className="gauge-question">몇 명이나 확인할 수 있을까요?</div>

            <div className="gauge-mini">
              <div
                className="gauge-mini__ring"
                style={{
                  background: `conic-gradient(from -90deg, var(--accent) 0deg, var(--accent) ${
                    membershipCustomerPct * 1.8
                  }deg, var(--track) ${membershipCustomerPct * 1.8}deg 180deg, transparent 180deg 360deg)`,
                }}
              />
              <div
                className="gauge-mini__marker"
                style={{ transform: `translateX(-50%) rotate(${(last30.membershipRegionAvgPct - 50) * 1.8}deg)` }}
              />
              <div className="gauge-mini__hole">
                <div className="gauge-mini__num">{membershipCustomerPct}%</div>
              </div>
            </div>

            <p className="hook-cta__desc">
              포인트를 적립·사용한 손님만 보여드려요. 지역 평균보다{" "}
              <b>{regionGap}%p</b> {isBelowRegionAvg ? "낮아요" : "더 많아요"}.
            </p>
            <p className="hook-cta__desc hook-cta__desc--muted">적립 손님이 늘수록 이 숫자도 함께 올라가요.</p>
            <span className="meter-row__cta">상세분석 리포트 보기 ›</span>
          </div>
          <div className="case-toggle-row">
            <button
              type="button"
              className="case-toggle-link"
              onClick={() => setMembershipCase((c) => (c === "low" ? "high" : "low"))}
            >
              케이스 전환
            </button>
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
