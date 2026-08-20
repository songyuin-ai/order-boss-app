import { useEffect } from "react";
import Card from "../components/Card";
import TrendChart from "../components/TrendChart";
import SegmentPieChart from "../components/SegmentPieChart";
import Tooltip from "../components/Tooltip";
import { useAppData } from "../context/DataContext";
import { periodKey, periodDefLabel, type PeriodSelection } from "../lib/period";
import type { Indicator } from "../data/types";

interface Props {
  period: PeriodSelection;
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function CustomerCompositionScreen({ period, onPanelChange }: Props) {
  const { customerCompositionIndicators: indicators, customerComposition } = useAppData();
  const data = customerComposition.byPeriod[periodKey(period)] ?? customerComposition.byPeriod.recent30;

  useEffect(() => {
    onPanelChange(
      [indicators.composition, indicators.demographic, indicators.trend, indicators.couponCta],
      `고객 구성 기준 · ${periodDefLabel(period)}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators, period]);

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
          <div className="composition__segment-info">
            <Tooltip content={indicators.composition.참고}>세그먼트 정의 보기 ⓘ</Tooltip>
          </div>
        </div>
      </Card>

      <Card title="인구통계별 분포" indicator={indicators.demographic}>
        <SegmentPieChart segments={data.demographicDistribution} />
      </Card>

      <Card title="단골·신규 추이 (최근 3개월)" indicator={indicators.trend}>
        <TrendChart data={customerComposition.segmentTrend} />
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
