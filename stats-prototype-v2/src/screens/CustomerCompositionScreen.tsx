import { useEffect } from "react";
import Card from "../components/Card";
import TrendChart from "../components/TrendChart";
import SegmentPieChart from "../components/SegmentPieChart";
import { useAppData } from "../context/DataContext";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function CustomerCompositionScreen({ onPanelChange }: Props) {
  const { customerCompositionIndicators: indicators, customerComposition: data } = useAppData();

  useEffect(() => {
    onPanelChange(
      [indicators.composition, indicators.demographic, indicators.trend, indicators.couponCta],
      "고객 구성 기준"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators]);

  return (
    <div className="screen__cards">
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
    </div>
  );
}
