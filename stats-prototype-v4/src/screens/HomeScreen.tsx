import { useEffect, useState } from "react";
import Card from "../components/Card";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import IdBadge from "../components/IdBadge";
import { useAppData } from "../context/DataContext";
import { MEMBER_ORDER_COUNT_BY_CASE } from "../data/homeDummy";
import { formatWon, formatCompactWon, formatSignedNumber } from "../utils/format";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  onNavigate: (menuKey: string) => void;
}

export default function HomeScreen({ onPanelChange, onNavigate }: Props) {
  const { homeRealtimeIndicators, homeRealtime } = useAppData();
  const { revenue, orders, aov, weekCumulative, weekTotal, last30, updatedAtLabel } = homeRealtime;

  // 프로토타입 데모용 — 주변매장 평균 대비 적음/많음 두 시나리오를 케이스 전환 버튼으로 바로 보여줌
  const [memberCase, setMemberCase] = useState<"low" | "high">("low");
  const memberOrderCount = MEMBER_ORDER_COUNT_BY_CASE[memberCase];

  // (v4) POS 전체 주문건수 분모 없이, HPC 적립·사용 주문건수(절대값)끼리만 비교
  const regionGapCount = memberOrderCount - last30.regionAvgMemberOrderCount;
  const isBelowRegionAvg = regionGapCount < 0;
  // 주변매장 평균보다 적음 = 포모(뒤처지고 있다는 위기감), 많음 = 우월감·유지 동기 — 색·문구를 케이스별로 다르게
  const caseTone = isBelowRegionAvg ? "warning" : "success";
  const caseToneColor = isBelowRegionAvg ? "var(--warning)" : "var(--success)";

  // 1순위(일간 요약) → 2순위(30일 후킹) → 3순위(주간 보충) 순서로, 지표표에도 동일한 우선순위로 노출
  const indicators: Indicator[] = [
    homeRealtimeIndicators.revenue,
    homeRealtimeIndicators.orders,
    homeRealtimeIndicators.aov,
    homeRealtimeIndicators.last30,
    homeRealtimeIndicators.deliveryShare,
    homeRealtimeIndicators.weekCumulative,
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

        {/* [1순위] 일간 요약 — 매출/주문건수/객단가를 카드 3장이 아니라 하나의 압축 블록으로
            "오늘"은 아직 마감되지 않은 진행 중인 기간이라 전일 대비는 표시하지 않음 (지역 평균 대비만 상시 표시) */}
        <div className="daily-summary">
          <div className="daily-summary__headline">
            <IdBadge id={homeRealtimeIndicators.revenue.id} />
            <span className="daily-summary__label">오늘 매출</span>
            <span className="daily-summary__value">{formatWon(revenue.value)}</span>
            <div className="daily-summary__badges">
              <span className="badge badge--muted">지역 평균 대비 {formatSignedNumber(revenue.vsRegionPct, "%")}</span>
            </div>
          </div>

          <div className="daily-summary__grid">
            <div className="daily-summary__stat">
              <IdBadge id={homeRealtimeIndicators.orders.id} />
              <span className="daily-summary__stat-label">주문건수</span>
              <span className="daily-summary__stat-value">{orders.value.toLocaleString("ko-KR")}건</span>
              <span className="daily-summary__stat-delta">지역 {formatSignedNumber(orders.vsRegionPct, "%")}</span>
            </div>
            <div className="daily-summary__stat">
              <IdBadge id={homeRealtimeIndicators.aov.id} />
              <span className="daily-summary__stat-label">객단가</span>
              <span className="daily-summary__stat-value">{formatWon(aov.value)}</span>
              <span className="daily-summary__stat-delta">지역 {formatSignedNumber(aov.vsRegionPct, "%")}</span>
            </div>
          </div>
        </div>

        {/* [2순위] 지난 달 상세분석 리포트 후킹 카드
            "리포트 제공"(혜택)과 "포인트 적립·사용 주문 기준"(조건)을 별개 정보로 나열하지 않고
            한 문장으로 묶어 인과관계 자체가 후킹이 되도록 함. 그다음 성장 동기 → 지역 비교가
            구분선 없이 자연스러운 문단 흐름으로 이어짐.
            (v4) 멤버십 고객 분석 화면이 "지난 주/지난 달" 고정 탭으로 바뀌어 이 카드도 "지난 달" 기준으로 맞춤
            (필드명 last30/memberOrderCount 등은 내부 식별자라 그대로 유지) */}
        <Card
          title="지난 달 상세분석 리포트 보기"
          indicator={homeRealtimeIndicators.last30}
          className={`hook-card hook-card--${caseTone}`}
        >
          <div className="hook-cta" onClick={() => onNavigate("membership")} role="button" tabIndex={0}>
            <div className="merged-sentence">
              지난 달 해피포인트 적립·사용 주문{" "}
              <span className="merged-sentence__num" style={{ color: caseToneColor }}>
                {memberOrderCount.toLocaleString("ko-KR")}건
              </span>{" "}
              기반으로, 손님 상세분석 리포트를 보여드려요
            </div>

            <p className="grow-line">적립·사용이 늘어날수록 리포트는 더 정확하고 쓸모 있어져요.</p>

            <p className="region-line" style={{ color: caseToneColor }}>
              주변매장 평균보다 {Math.abs(regionGapCount).toLocaleString("ko-KR")}건{" "}
              {isBelowRegionAvg ? "적어요" : "더 많아요! 계속 유지해보세요"}{" "}
              <span className="region-badge">주변매장 평균 {last30.regionAvgMemberOrderCount.toLocaleString("ko-KR")}건</span>
            </p>

            <div className="hook-cta__button">
              상세분석 리포트 보기 <span className="hook-cta__button-arrow">→</span>
            </div>
          </div>
          <div className="case-toggle-row">
            <button
              type="button"
              className="case-toggle-link"
              onClick={() => setMemberCase((c) => (c === "low" ? "high" : "low"))}
            >
              케이스 전환
            </button>
          </div>
        </Card>

        {/* 딜리버리 점유율 — 포인트 리포트와 기준(주문건수 절대값 vs 매출 비중)이 달라 별도 섹션으로 분리 */}
        <Card title="딜리버리 점유율 (최근 30일)" indicator={homeRealtimeIndicators.deliveryShare}>
          <div className="delivery-share" onClick={() => onNavigate("deliveryCustomer")} role="button" tabIndex={0}>
            <DonutChart
              primaryValue={last30.deliveryRevenuePct}
              secondaryValue={Math.round((100 - last30.deliveryRevenuePct) * 10) / 10}
              primaryLabel="딜리버리"
              secondaryLabel="그 외"
            />
            <div className="delivery-share__body">
              <span className="meter-row__cta">딜리버리 고객 분석 상세보기 ›</span>
            </div>
          </div>
          <p className="chart-note">
            ※ 위 리포트는 적립·사용 주문 건수(절대값) 기준, 딜리버리 점유율은 매출 비중(%) 기준으로 서로 다른 지표예요.
          </p>
        </Card>

        {/* [3순위] 주간 상세 — 관심 있는 점주만 스크롤해서 보는 보충 자료 */}
        <div className="section-label">주간 상세</div>

        <Card title="주간 매출 누적 (이번 주)" indicator={homeRealtimeIndicators.weekCumulative}>
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
