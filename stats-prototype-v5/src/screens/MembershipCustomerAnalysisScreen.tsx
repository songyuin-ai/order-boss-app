import { useEffect, useState } from "react";
import Card from "../components/Card";
import CustomerSegmentCards from "../components/CustomerSegmentCards";
import SegmentPieChart from "../components/SegmentPieChart";
import AgePopularProductsTable from "../components/AgePopularProductsTable";
import RepurchaseRankList from "../components/RepurchaseRankList";
import KpiStrip from "../components/KpiStrip";
import { useAppData } from "../context/DataContext";
import { ageGenderRatios } from "../data/customerCompositionDummy";
import type { SegmentKey } from "../data/customerSegmentsDummy";
import type { GenderFilter } from "../data/customerDetailDummy";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  onOpenSegmentInfo: () => void;
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

export default function MembershipCustomerAnalysisScreen({ onPanelChange, onOpenSegmentInfo }: Props) {
  const {
    customerCompositionIndicators,
    customerComposition,
    segmentDetailIndicators,
    customerSegments,
    customerDetailIndicators,
    agePreferredProductsByGender,
    repurchaseTop5,
    membershipIndicators,
    membership,
    kpiIndicators,
  } = useAppData();

  const [openSegment, setOpenSegment] = useState<SegmentKey | null>(customerSegments[0]?.key ?? null);
  const [gender, setGender] = useState<GenderFilter>("all");

  const loyalHighlight = highlightLabel(customerComposition.demographicDistribution, "loyalRatio");
  const dormantHighlight = highlightLabel(customerComposition.demographicDistribution, "dormantRatio");

  useEffect(() => {
    onPanelChange(
      [
        membershipIndicators.hValue,
        kpiIndicators.memberOrderCount,
        segmentDetailIndicators.customerCount,
        segmentDetailIndicators.revenueShare,
        segmentDetailIndicators.peakHour,
        segmentDetailIndicators.topMenu,
        segmentDetailIndicators.demographic,
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
        memberCustomerCount={membership.activity.customerCount}
        memberOrderCount={membership.activity.orderCount}
        memberEarnOrderCount={membership.activity.earnOrderCount}
        memberUseOrderCount={membership.activity.useOrderCount}
        regionAvgMemberOrderCount={membership.activity.regionAvgOrderCount}
        hValuePct={membership.hValue.pct}
        regionAvgHValuePct={membership.hValue.regionAvgPct}
        memberOrderIndicator={kpiIndicators.memberOrderCount}
        hValueIndicator={membershipIndicators.hValue}
      />

      <div className="screen__cards">
        <Card title="우리가게 손님 그룹" indicator={segmentDetailIndicators.customerCount}>
          <p className="chart-note">※ 최근 30일 기준이에요 (그룹은 서로 겹칠 수 있어요)</p>

          <div className="segment-combined__subheader">
            <button type="button" className="segment-info-link" onClick={onOpenSegmentInfo}>
              손님 그룹은 어떤 기준으로 구분하나요? ⓘ
            </button>
          </div>

          <CustomerSegmentCards
            segments={customerSegments}
            openKey={openSegment}
            onToggle={(key) => setOpenSegment((prev) => (prev === key ? null : key))}
            fieldIndicators={segmentDetailIndicators}
          />
        </Card>

        <Card title="연령/성별 구성" indicator={customerCompositionIndicators.demographic}>
          <p className="chart-note">※ 최근 30일 방문객 기준이에요</p>
          <SegmentPieChart
            segments={customerComposition.demographicDistribution}
            highlightLoyalLabel={loyalHighlight}
            highlightDormantLabel={dormantHighlight}
          />
        </Card>

        <Card title="연령대별 인기상품" indicator={customerDetailIndicators.agePreferred}>
          <p className="chart-note">※ 최근 30일 구매실적 기준이에요</p>
          <AgePopularProductsTable
            data={agePreferredProductsByGender[gender]}
            gender={gender}
            onGenderChange={setGender}
          />
        </Card>

        <Card title="재구매율 높은 상품 TOP5" indicator={customerDetailIndicators.repurchaseTop5}>
          <p className="chart-note">※ 최근 30일 구매실적 기준이에요</p>
          <RepurchaseRankList items={repurchaseTop5} />
        </Card>
      </div>
    </div>
  );
}
