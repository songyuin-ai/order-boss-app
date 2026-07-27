import { useEffect, useState } from "react";
import Card from "../components/Card";
import PeriodFilterButton from "../components/PeriodFilterButton";
import PeriodFilterModal from "../components/PeriodFilterModal";
import SegmentPieChart from "../components/SegmentPieChart";
import TrendChart from "../components/TrendChart";
import SegmentStoryCard from "../components/SegmentStoryCard";
import AgePopularProductsTable from "../components/AgePopularProductsTable";
import SegmentTable from "../components/SegmentTable";
import { useAppData } from "../context/DataContext";
import { formatCompactWon } from "../utils/format";
import { DEFAULT_PERIOD, periodKey, periodDefLabel, type PeriodSelection } from "../lib/period";
import { ageGenderRatios } from "../data/customerCompositionDummy";
import type { SegmentKey } from "../data/segmentDetailDummy";
import type { GenderFilter } from "../data/customerDetailDummy";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
  storeName: string;
}

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

export default function MembershipCustomerAnalysisScreen({ onPanelChange, storeName }: Props) {
  const {
    customerCompositionIndicators,
    customerComposition,
    segmentDetailIndicators,
    segmentDetail,
    customerDetailIndicators,
    customerDetail,
    membershipIndicators,
    membership,
  } = useAppData();

  const [period, setPeriod] = useState<PeriodSelection>(DEFAULT_PERIOD);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [segment, setSegment] = useState<SegmentKey>("all");
  const [gender, setGender] = useState<GenderFilter>("all");

  const key = periodKey(period);
  const periodLabel = periodDefLabel(period);
  const composition = customerComposition.byPeriod[key] ?? customerComposition.byPeriod.recent30;
  const segmentData = segmentDetail.byPeriod[key] ?? segmentDetail.byPeriod.recent30;
  const detail = customerDetail.byPeriod[key] ?? customerDetail.byPeriod.recent30;
  const membershipData = membership.byPeriod[key] ?? membership.byPeriod.recent30;
  const showRevisitCycle = period.mode !== "recent7";

  const loyalHighlight = highlightLabel(composition.demographicDistribution, "loyalRatio");
  const dormantHighlight = highlightLabel(composition.demographicDistribution, "dormantRatio");

  useEffect(() => {
    onPanelChange(
      [
        customerCompositionIndicators.composition,
        segmentDetailIndicators.segmentStory,
        customerCompositionIndicators.trend,
        customerCompositionIndicators.demographic,
        customerDetailIndicators.agePreferred,
        ...(showRevisitCycle ? [customerDetailIndicators.revisitCycle] : []),
        membershipIndicators.hValue,
        membershipIndicators.segmentContribution,
        membershipIndicators.membershipRevenue,
      ],
      `멤버십 고객 분석 기준 · ${periodLabel}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return (
    <div className="screen">
      <p className="chart-note chart-note--banner">
        ※ 이 리포트는 해피포인트 적립·사용이 발생한 주문 건만 기준으로 분석돼요. POS 전체 매출/객단가와는 다른
        수치예요.
      </p>
      <div className="screen__period-bar">
        <PeriodFilterButton value={period} onClick={() => setPeriodModalOpen(true)} />
      </div>

      <div className="screen__cards">
        <Card title="우리 매장 고객 구성" indicator={customerCompositionIndicators.composition}>
          <SegmentPieChart
            segments={[
              { label: "단골", pct: composition.customerComposition.chips.find((c) => c.label === "단골")!.pct },
              { label: "신규", pct: composition.customerComposition.chips.find((c) => c.label === "신규")!.pct },
              { label: "일반", pct: composition.customerComposition.chips.find((c) => c.label === "일반")!.pct },
              { label: "휴면", pct: composition.customerComposition.chips.find((c) => c.label === "휴면")!.pct },
            ]}
          />
          <div className="composition__delta">{composition.customerComposition.deltaLabel}</div>
        </Card>

        <Card title="손님 상세 분석" indicator={segmentDetailIndicators.segmentStory}>
          <SegmentStoryCard
            data={segmentData}
            segment={segment}
            onSegmentChange={setSegment}
            periodLabel={periodLabel}
            storeName={storeName}
          />
        </Card>

        <Card title="단골·신규 추이 (최근 3개월)" indicator={customerCompositionIndicators.trend}>
          <TrendChart data={customerComposition.segmentTrend} />
        </Card>

        <Card title="연령/성별 세그먼트" indicator={customerCompositionIndicators.demographic}>
          <SegmentPieChart
            segments={composition.demographicDistribution}
            highlightLoyalLabel={loyalHighlight}
            highlightDormantLabel={dormantHighlight}
          />
        </Card>

        <Card title="연령대별 인기상품" indicator={customerDetailIndicators.agePreferred}>
          <AgePopularProductsTable
            data={detail.agePreferredProductsByGender[gender]}
            gender={gender}
            onGenderChange={setGender}
          />
        </Card>

        {showRevisitCycle && (
          <Card title="재방문 주기(고착도)" indicator={customerDetailIndicators.revisitCycle}>
            <div className="big-stat">
              <span className="big-stat__value">{detail.revisitCycle.value}</span>
              <span className="big-stat__label">{detail.revisitCycle.label}</span>
            </div>
          </Card>
        )}

        <Card title="포인트 활용 지표(H값)" indicator={membershipIndicators.hValue} tone="dark">
          <div className="h-value">
            <span className="h-value__pct">{membershipData.hValue.pct}%</span>
            <span className="h-value__delta">{membershipData.hValue.deltaLabel}</span>
          </div>
        </Card>

        <Card title="멤버십 매출 기여도" indicator={membershipIndicators.membershipRevenue}>
          <div className="membership-revenue">
            <div className="membership-revenue__pct">{membershipData.membershipRevenue.pct}%</div>
            <div className="membership-revenue__delta">{membershipData.membershipRevenue.deltaLabel}</div>
            <div className="compare-card">
              <div className="compare-card__col">
                <span className="compare-card__title">멤버십 연관매출</span>
                <span className="compare-card__metric">
                  {formatCompactWon(membershipData.membershipRevenue.memberRevenue)}
                </span>
              </div>
              <div className="compare-card__divider" />
              <div className="compare-card__col">
                <span className="compare-card__title">전체매출(POS)</span>
                <span className="compare-card__metric">
                  {formatCompactWon(membershipData.membershipRevenue.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
          <SegmentTable
            rows={[
              { segment: "단골", contributionPct: segmentData.loyal.revenueContributionPct },
              { segment: "신규", contributionPct: segmentData.new.revenueContributionPct },
              { segment: "일반", contributionPct: segmentData.general.revenueContributionPct },
            ]}
          />
        </Card>
      </div>

      <PeriodFilterModal
        open={periodModalOpen}
        value={period}
        onApply={setPeriod}
        onClose={() => setPeriodModalOpen(false)}
      />
    </div>
  );
}
