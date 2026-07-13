import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import SegmentedNav from "../components/SegmentedNav";
import TrendChart from "../components/TrendChart";
import SegmentTable from "../components/SegmentTable";
import SegmentPieChart from "../components/SegmentPieChart";
import RevenueRankList from "../components/RevenueRankList";
import {
  track2Group1Indicators,
  track2Group2Indicators,
  track2Group3Indicators,
} from "../data/track2Indicators";
import {
  customerComposition,
  demographicDistribution,
  segmentTrend,
  preferredCategory,
  AGE_GROUPS,
  agePreferredProducts,
  loyalPreferredProducts,
  visitTimeText,
  revisitCycle,
  hValue,
  segmentContribution,
  gcrmCompare,
} from "../data/track2Dummy";
import { IndicatorContext } from "../context/IndicatorContext";
import type { Indicator } from "../data/types";

const GROUPS = [
  { key: "group1", label: "누가 오는가" },
  { key: "group2", label: "왜·언제 오는가" },
  { key: "group3", label: "돈이 되는가" },
];

const GROUP_LABEL: Record<string, string> = {
  group1: "누가 오는가 그룹 기준",
  group2: "왜·언제 오는가 그룹 기준",
  group3: "돈이 되는가 그룹 기준",
};

const GROUP_INDICATORS: Record<string, Indicator[]> = {
  group1: [
    track2Group1Indicators.composition,
    track2Group1Indicators.demographic,
    track2Group1Indicators.trend,
    track2Group1Indicators.couponCta,
  ],
  group2: [
    track2Group2Indicators.category,
    track2Group2Indicators.agePreferred,
    track2Group2Indicators.loyalPreferred,
    track2Group2Indicators.visitTime,
    track2Group2Indicators.revisitCycle,
  ],
  group3: [
    track2Group3Indicators.hValue,
    track2Group3Indicators.segmentContribution,
    track2Group3Indicators.gcrmCompare,
  ],
};

function Group1() {
  return (
    <>
      <Card title="고객 구성" indicator={track2Group1Indicators.composition}>
        <div className="composition">
          <div className="composition__headline">
            <span className="composition__value">{customerComposition.loyalPct}%</span>
            <span className="composition__label">단골 비중</span>
          </div>
          <div className="composition__delta">{customerComposition.deltaLabel}</div>
          <div className="composition__chips">
            {customerComposition.chips.map((c) => (
              <span key={c.label} className="chip">
                {c.label} {c.pct}%
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card title="인구통계별 분포" indicator={track2Group1Indicators.demographic}>
        <SegmentPieChart segments={demographicDistribution} />
      </Card>

      <Card title="단골·신규 추이 (최근 6개월)" indicator={track2Group1Indicators.trend}>
        <TrendChart data={segmentTrend} />
      </Card>

      <Card title="세그먼트 타겟 쿠폰 연결" indicator={track2Group1Indicators.couponCta} className="cta-card">
        <div className="cta-card__body">
          <span>세그먼트 탭 → 쿠폰 만들기</span>
          <span className="cta-card__badge">오픈이슈</span>
        </div>
      </Card>
    </>
  );
}

function AgePreferredCard() {
  const [age, setAge] = useState<string>(AGE_GROUPS[1]);
  return (
    <Card title="연령대별 선호상품 Top3" indicator={track2Group2Indicators.agePreferred}>
      <div className="chip-row">
        {AGE_GROUPS.map((a) => (
          <button
            key={a}
            type="button"
            className={`chip chip--btn${a === age ? " is-active" : ""}`}
            onClick={() => setAge(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <RevenueRankList items={agePreferredProducts[age]} />
    </Card>
  );
}

function Group2() {
  return (
    <>
      <Card title="선호 상품·카테고리" indicator={track2Group2Indicators.category}>
        <div className="category-path">
          {preferredCategory.map((c, i) => (
            <span key={c} className="category-path__item">
              {c}
              {i < preferredCategory.length - 1 && <span className="category-path__sep">›</span>}
            </span>
          ))}
        </div>
      </Card>

      <AgePreferredCard />

      <Card title="단골 선호상품 Top3" indicator={track2Group2Indicators.loyalPreferred}>
        <RevenueRankList items={loyalPreferredProducts} />
      </Card>

      <Card title="방문 시간대" indicator={track2Group2Indicators.visitTime}>
        <div className="info-text">{visitTimeText}</div>
      </Card>

      <Card title="재방문 주기(고착도)" indicator={track2Group2Indicators.revisitCycle}>
        <div className="big-stat">
          <span className="big-stat__value">{revisitCycle.value}</span>
          <span className="big-stat__label">{revisitCycle.label}</span>
        </div>
      </Card>
    </>
  );
}

function Group3() {
  return (
    <>
      <Card
        title="포인트 활용 지표(H값)"
        indicator={track2Group3Indicators.hValue}
        tone="dark"
      >
        <div className="h-value">
          <span className="h-value__pct">{hValue.pct}%</span>
          <span className="h-value__delta">{hValue.deltaLabel}</span>
        </div>
      </Card>

      <Card title="세그먼트별 매출 기여도" indicator={track2Group3Indicators.segmentContribution}>
        <SegmentTable rows={segmentContribution} />
      </Card>

      <Card title="G-CRM 인근 가맹점 비교" indicator={track2Group3Indicators.gcrmCompare}>
        <div className="compare-card">
          <div className="compare-card__col">
            <span className="compare-card__title">우리매장</span>
            <span className="compare-card__metric">{gcrmCompare.metric} {gcrmCompare.ours}</span>
            <span className="compare-card__metric">{gcrmCompare.secondaryMetric} {gcrmCompare.oursSecondary}</span>
          </div>
          <div className="compare-card__divider" />
          <div className="compare-card__col">
            <span className="compare-card__title">인근평균</span>
            <span className="compare-card__metric">{gcrmCompare.metric} {gcrmCompare.nearby}</span>
            <span className="compare-card__metric">{gcrmCompare.secondaryMetric} {gcrmCompare.nearbySecondary}</span>
          </div>
        </div>
      </Card>
    </>
  );
}

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function Track2Screen({ onPanelChange }: Props) {
  const [group, setGroup] = useState("group1");
  const { clear } = useContext(IndicatorContext);

  useEffect(() => {
    onPanelChange(GROUP_INDICATORS[group], GROUP_LABEL[group]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const handleGroupChange = (g: string) => {
    setGroup(g);
    clear();
  };

  return (
    <div className="screen">
      <SegmentedNav options={GROUPS} active={group} onChange={handleGroupChange} size="sm" />
      <div className="screen__cards">
        {group === "group1" && <Group1 />}
        {group === "group2" && <Group2 />}
        {group === "group3" && <Group3 />}
      </div>
    </div>
  );
}
