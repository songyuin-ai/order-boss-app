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
  const { homeIndicators, posIndicators, homeRealtime, home } = useAppData();
  const { revenue, orders, aov, weekCumulative, weekTotal, updatedAtLabel } = homeRealtime;

  // 1순위(일간 요약) → 2순위(상세분석 리포트 진입) → 3순위(주간 보충) 순서로, 지표표에도 동일한 우선순위로 노출
  // (v5) 상세분석 리포트 후킹 카드(data_012)는 UX라이팅 확정 전까지 회색 플레이스홀더라 지표표 연동 대상에서 제외
  const indicators: Indicator[] = [
    posIndicators.totalRevenue,
    posIndicators.totalOrders,
    posIndicators.aov,
    posIndicators.onlineOffline,
    homeIndicators.weekdayCumulative,
  ];

  useEffect(() => {
    onPanelChange(indicators, "홈 · 실시간 대시보드");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeIndicators, posIndicators]);

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

        {/* [1순위] 일간 요약 — 매출/주문건수/객단가를 카드 3장이 아니라 하나의 압축 블록으로
            "오늘"은 아직 마감되지 않은 진행 중인 기간이라 전일 대비는 표시하지 않음 (지역 평균 대비만 상시 표시) */}
        <div className="daily-summary">
          <div className="daily-summary__headline">
            <IdBadge id={posIndicators.totalRevenue.id} />
            <span className="daily-summary__label">오늘 매출</span>
            <span className="daily-summary__value">{formatWon(revenue.value)}</span>
            <div className="daily-summary__badges">
              <span className="badge badge--muted">지역 평균 대비 {formatSignedNumber(revenue.vsRegionPct, "%")}</span>
            </div>
          </div>

          <div className="daily-summary__grid">
            <div className="daily-summary__stat">
              <IdBadge id={posIndicators.totalOrders.id} />
              <span className="daily-summary__stat-label">주문건수</span>
              <span className="daily-summary__stat-value">{orders.value.toLocaleString("ko-KR")}건</span>
              <span className="daily-summary__stat-delta">지역 {formatSignedNumber(orders.vsRegionPct, "%")}</span>
            </div>
            <div className="daily-summary__stat">
              <IdBadge id={posIndicators.aov.id} />
              <span className="daily-summary__stat-label">객단가</span>
              <span className="daily-summary__stat-value">{formatWon(aov.value)}</span>
              <span className="daily-summary__stat-delta">지역 {formatSignedNumber(aov.vsRegionPct, "%")}</span>
            </div>
          </div>
        </div>

        {/* [2순위] 상세분석 리포트 후킹 카드 — 포인트 사용금액 기반 후킹 카피가 UX라이팅 진행 중이라
            확정 전까지는 회색 플레이스홀더만 노출. 탭하면 기존과 동일하게 멤버십 고객 분석 화면으로 이동 */}
        <div
          className="hook-card hook-card--placeholder"
          onClick={() => onNavigate("membership")}
          role="button"
          tabIndex={0}
        >
          <p className="hook-card__placeholder-text">UX라이팅 진행 중</p>
        </div>

        {/* 온라인/오프라인 매출 점유율 — 포인트 리포트와 기준(주문건수 절대값 vs 매출 비중)이 달라 별도 섹션으로 분리
            (v4) "딜리버리 점유율"(배달앱만)과 "온라인 점유율"(배달+픽업)이 용어만 다르고 헷갈린다는 피드백으로 온라인 점유율로 통일 */}
        <Card title="온라인 매출 점유율 (오늘)" indicator={posIndicators.onlineOffline}>
          <div className="delivery-share" onClick={() => onNavigate("deliveryCustomer")} role="button" tabIndex={0}>
            <DonutChart
              primaryValue={home.daily.onlineOffline.online}
              secondaryValue={home.daily.onlineOffline.offline}
              primaryLabel="온라인"
              secondaryLabel="오프라인"
            />
            <div className="delivery-share__body">
              <span className="meter-row__cta">딜리버리 통계 자세히 보기 ›</span>
            </div>
          </div>
        </Card>

        {/* [3순위] 주간 상세 — 관심 있는 점주만 스크롤해서 보는 보충 자료 */}
        <div className="section-label">주간 상세</div>

        <Card title="주간 매출 누적 (이번 주)" indicator={homeIndicators.weekdayCumulative}>
          <div className="week-total">
            <span className="week-total__value">{formatWon(weekTotal.value)}</span>
            <div className="week-total__badges">
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
      </div>
    </div>
  );
}
