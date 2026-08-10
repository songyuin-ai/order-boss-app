import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import IdBadge from "../components/IdBadge";
import SegmentRatioChart from "../components/SegmentRatioChart";
import SegmentDetailPanel from "../components/SegmentDetailPanel";
import SegmentTrendChart from "../components/SegmentTrendChart";
import SegmentPieChart from "../components/SegmentPieChart";
import AgePopularProductsTable from "../components/AgePopularProductsTable";
import RepurchaseRankList from "../components/RepurchaseRankList";
import KpiStrip from "../components/KpiStrip";
import { useAppData } from "../context/DataContext";
import { ageGenderRatios } from "../data/customerCompositionDummy";
import { SEGMENT_TABS } from "../data/segmentMeta";
import type { SegmentKey } from "../data/segmentDetailDummy";
import type { GenderFilter } from "../data/customerDetailDummy";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

// "최근 30일" 고정 기준 — 3장(조회기간 체계 변경) 참고. 실시간 롤링이 아니라 1일 1회 배치가 갱신하는 스냅샷
const PERIOD_LABEL = "최근 30일";

function highlightLabel(
  demographics: { label: string; pct: number }[],
  ratioKey: "loyalRatio" | "dormantRatio"
): string | undefined {
  let best: string | undefined;
  let bestValue = -1;
  demographics.forEach((d) => {
    const ratio = ageGenderRatios[d.label];
    if (ratio && ratio[ratioKey] > bestValue) {
      bestValue = ratio[ratioKey];
      best = d.label;
    }
  });
  return best;
}

export default function MembershipCustomerAnalysisScreen({ onPanelChange }: Props) {
  const {
    customerCompositionIndicators,
    customerComposition,
    segmentTrend,
    segmentDetailIndicators,
    segmentDetail,
    customerDetailIndicators,
    agePreferredProductsByGender,
    repurchaseTop5,
    membershipIndicators,
    membership,
    kpiIndicators,
  } = useAppData();

  const [segment, setSegment] = useState<SegmentKey>("realRegular");
  const [gender, setGender] = useState<GenderFilter>("all");
  const [avgOrdFilterOn, setAvgOrdFilterOn] = useState(false);

  // 4-7절 — 객단가(avgOrd) 필터는 세그먼트 비율·상세분석에만 적용, 상단 KPI 스트립은 항상 필터 미적용 기준
  const activeSnapshot = avgOrdFilterOn ? segmentDetail.avgOrdFiltered : segmentDetail.default;

  const ratioSlices = useMemo(
    () =>
      SEGMENT_TABS.map((t) => ({
        key: t.key,
        label: t.label,
        pct: activeSnapshot[t.key].customerSharePct,
        customerCount: activeSnapshot[t.key].customerCount,
      })),
    [activeSnapshot]
  );

  const loyalHighlight = highlightLabel(customerComposition.demographicDistribution, "loyalRatio");
  const dormantHighlight = highlightLabel(customerComposition.demographicDistribution, "dormantRatio");

  useEffect(() => {
    onPanelChange(
      [
        kpiIndicators.memberCustomers,
        kpiIndicators.memberOrderShare,
        membershipIndicators.hValue,
        customerCompositionIndicators.segmentRatio,
        segmentDetailIndicators.segmentDetail,
        customerCompositionIndicators.trend,
        customerCompositionIndicators.demographic,
        customerDetailIndicators.agePreferred,
        customerDetailIndicators.repurchaseTop5,
      ],
      `멤버십 고객 분석 기준 · ${PERIOD_LABEL}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen">
      <div className="intro-banner">
        <p className="intro-banner__headline">해피포인트 멤버십을 적립·사용한 손님 데이터를 기반으로 분석했어요</p>
        <p className="intro-banner__caption">POS 전체 매출/객단가와는 다른 수치예요 · {PERIOD_LABEL} 기준(매일 갱신)</p>
      </div>

      <KpiStrip
        periodLabel={PERIOD_LABEL}
        memberCustomerCount={segmentDetail.default.totals.customerCount}
        memberOrderCount={segmentDetail.default.totals.orderCount}
        regionAvgMemberOrderCount={segmentDetail.default.totals.regionAvgMemberOrderCount}
        hValuePct={membership.hValue.pct}
        regionAvgHValuePct={membership.hValue.regionAvgPct}
        memberCustomersIndicator={kpiIndicators.memberCustomers}
        hValueIndicator={membershipIndicators.hValue}
      />

      <div className="screen__cards">
        {/* 세그먼트 비율과 상세분석을 한 카드로 이어 붙여, 비율 → 상세 스토리로 자연스럽게 읽히게 함 */}
        <Card title="우리가게 손님 구성" indicator={customerCompositionIndicators.segmentRatio}>
          <div className="avgord-toggle">
            <span className="avgord-toggle__label" title="1회 소비액이 상위 20%에 해당하는 손님입니다">
              객단가 높은 손님만 보기
            </span>
            <button
              type="button"
              className={`avgord-toggle__switch${avgOrdFilterOn ? " is-on" : ""}`}
              aria-pressed={avgOrdFilterOn}
              onClick={() => setAvgOrdFilterOn((v) => !v)}
            />
          </div>
          <SegmentRatioChart segments={ratioSlices} active={segment} onSelect={setSegment} />

          <div className="segment-combined__subheader">
            <span className="segment-combined__subheader-label">세그먼트별 상세분석</span>
            <IdBadge id={segmentDetailIndicators.segmentDetail.id} />
          </div>
          <SegmentDetailPanel
            data={activeSnapshot}
            segment={segment}
            onSegmentChange={setSegment}
            avgOrdFilterOn={avgOrdFilterOn}
          />
        </Card>

        <Card title={`세그먼트 추이 (최근 3개월) · ${SEGMENT_TABS.find((t) => t.key === segment)!.label}`} indicator={customerCompositionIndicators.trend}>
          <SegmentTrendChart data={segmentTrend[segment]} />
        </Card>

        <Card title="연령/성별 구성" indicator={customerCompositionIndicators.demographic}>
          <SegmentPieChart
            segments={customerComposition.demographicDistribution}
            highlightLoyalLabel={loyalHighlight}
            highlightDormantLabel={dormantHighlight}
          />
        </Card>

        <Card title="연령대별 인기상품" indicator={customerDetailIndicators.agePreferred}>
          <AgePopularProductsTable
            data={agePreferredProductsByGender[gender]}
            gender={gender}
            onGenderChange={setGender}
          />
        </Card>

        <Card title="재구매율 높은 상품 TOP5" indicator={customerDetailIndicators.repurchaseTop5}>
          <RepurchaseRankList items={repurchaseTop5} />
        </Card>
      </div>
    </div>
  );
}
