import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import SegmentedNav from "../components/SegmentedNav";
import TrendChart from "../components/TrendChart";
import SegmentTable from "../components/SegmentTable";
import SegmentPieChart from "../components/SegmentPieChart";
import RevenueRankList from "../components/RevenueRankList";
import { IndicatorContext } from "../context/IndicatorContext";
import { useAppData } from "../context/DataContext";
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

type AppData = ReturnType<typeof useAppData>;

function Group1({ indicators, data }: { indicators: AppData["track2Group1Indicators"]; data: AppData["track2"] }) {
  return (
    <>
      <Card title="고객 구성" indicator={indicators.composition}>
        <div className="composition">
          <div className="composition__headline">
            <span className="composition__value">{data.customerComposition.loyalPct}%</span>
            <span className="composition__label">단골 비중</span>
          </div>
          <div className="composition__delta">{data.customerComposition.deltaLabel}</div>
          <div className="composition__chips">
            {data.customerComposition.chips.map((c) => (
              <span key={c.label} className="chip">
                {c.label} {c.pct}%
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card title="인구통계별 분포" indicator={indicators.demographic}>
        <SegmentPieChart segments={data.demographicDistribution} />
      </Card>

      <Card title="단골·신규 추이 (최근 6개월)" indicator={indicators.trend}>
        <TrendChart data={data.segmentTrend} />
      </Card>

      <Card title="세그먼트 타겟 쿠폰 연결" indicator={indicators.couponCta} className="cta-card">
        <div className="cta-card__body">
          <span>세그먼트 탭 → 쿠폰 만들기</span>
          <span className="cta-card__badge">오픈이슈</span>
        </div>
      </Card>
    </>
  );
}

function AgePreferredCard({
  indicator,
  agePreferredProducts,
}: {
  indicator: Indicator;
  agePreferredProducts: AppData["track2"]["agePreferredProducts"];
}) {
  const ageGroups = Object.keys(agePreferredProducts);
  const [age, setAge] = useState<string>(ageGroups[1] ?? ageGroups[0]);
  const selected = agePreferredProducts[age] ?? agePreferredProducts[ageGroups[0]] ?? [];

  return (
    <Card title="연령대별 선호상품 Top3" indicator={indicator}>
      <div className="chip-row">
        {ageGroups.map((a) => (
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
      <RevenueRankList items={selected} />
    </Card>
  );
}

function Group2({ indicators, data }: { indicators: AppData["track2Group2Indicators"]; data: AppData["track2"] }) {
  return (
    <>
      <Card title="선호 상품·카테고리" indicator={indicators.category}>
        <div className="category-path">
          {data.preferredCategory.map((c, i) => (
            <span key={c} className="category-path__item">
              {c}
              {i < data.preferredCategory.length - 1 && <span className="category-path__sep">›</span>}
            </span>
          ))}
        </div>
      </Card>

      <AgePreferredCard indicator={indicators.agePreferred} agePreferredProducts={data.agePreferredProducts} />

      <Card title="단골 선호상품 Top3" indicator={indicators.loyalPreferred}>
        <RevenueRankList items={data.loyalPreferredProducts} />
      </Card>

      <Card title="방문 시간대" indicator={indicators.visitTime}>
        <div className="info-text">{data.visitTimeText}</div>
      </Card>

      <Card title="재방문 주기(고착도)" indicator={indicators.revisitCycle}>
        <div className="big-stat">
          <span className="big-stat__value">{data.revisitCycle.value}</span>
          <span className="big-stat__label">{data.revisitCycle.label}</span>
        </div>
      </Card>
    </>
  );
}

function Group3({ indicators, data }: { indicators: AppData["track2Group3Indicators"]; data: AppData["track2"] }) {
  return (
    <>
      <Card title="포인트 활용 지표(H값)" indicator={indicators.hValue} tone="dark">
        <div className="h-value">
          <span className="h-value__pct">{data.hValue.pct}%</span>
          <span className="h-value__delta">{data.hValue.deltaLabel}</span>
        </div>
      </Card>

      <Card title="세그먼트별 매출 기여도" indicator={indicators.segmentContribution}>
        <SegmentTable rows={data.segmentContribution} />
      </Card>

      <Card title="G-CRM 인근 가맹점 비교" indicator={indicators.gcrmCompare}>
        <div className="compare-card">
          <div className="compare-card__col">
            <span className="compare-card__title">우리매장</span>
            <span className="compare-card__metric">
              {data.gcrmCompare.metric} {data.gcrmCompare.ours}
            </span>
            <span className="compare-card__metric">
              {data.gcrmCompare.secondaryMetric} {data.gcrmCompare.oursSecondary}
            </span>
          </div>
          <div className="compare-card__divider" />
          <div className="compare-card__col">
            <span className="compare-card__title">인근평균</span>
            <span className="compare-card__metric">
              {data.gcrmCompare.metric} {data.gcrmCompare.nearby}
            </span>
            <span className="compare-card__metric">
              {data.gcrmCompare.secondaryMetric} {data.gcrmCompare.nearbySecondary}
            </span>
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
  const { track2Group1Indicators, track2Group2Indicators, track2Group3Indicators, track2 } = useAppData();

  const groupIndicators: Record<string, Indicator[]> = {
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

  useEffect(() => {
    onPanelChange(groupIndicators[group], GROUP_LABEL[group]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, track2Group1Indicators, track2Group2Indicators, track2Group3Indicators]);

  const handleGroupChange = (g: string) => {
    setGroup(g);
    clear();
  };

  return (
    <div className="screen">
      <SegmentedNav options={GROUPS} active={group} onChange={handleGroupChange} size="sm" />
      <div className="screen__cards">
        {group === "group1" && <Group1 indicators={track2Group1Indicators} data={track2} />}
        {group === "group2" && <Group2 indicators={track2Group2Indicators} data={track2} />}
        {group === "group3" && <Group3 indicators={track2Group3Indicators} data={track2} />}
      </div>
    </div>
  );
}
