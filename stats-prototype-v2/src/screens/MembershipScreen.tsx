import { useEffect } from "react";
import Card from "../components/Card";
import SegmentTable from "../components/SegmentTable";
import { useAppData } from "../context/DataContext";
import { formatCompactWon } from "../utils/format";
import type { Indicator } from "../data/types";

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function MembershipScreen({ onPanelChange }: Props) {
  const { membershipIndicators: indicators, membership: data } = useAppData();

  useEffect(() => {
    onPanelChange(
      [indicators.hValue, indicators.segmentContribution, indicators.membershipRevenue],
      "멤버십 가치 분석 기준"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators]);

  return (
    <div className="screen__cards">
      <Card title="포인트 활용 지표(H값)" indicator={indicators.hValue} tone="dark">
        <div className="h-value">
          <span className="h-value__pct">{data.hValue.pct}%</span>
          <span className="h-value__delta">{data.hValue.deltaLabel}</span>
        </div>
      </Card>

      <Card title="세그먼트별 매출 기여도" indicator={indicators.segmentContribution}>
        <SegmentTable rows={data.segmentContribution} />
      </Card>

      <Card title="멤버십 연관매출" indicator={indicators.membershipRevenue}>
        <div className="membership-revenue">
          <div className="membership-revenue__pct">{data.membershipRevenue.pct}%</div>
          <div className="membership-revenue__delta">{data.membershipRevenue.deltaLabel}</div>
          <div className="compare-card">
            <div className="compare-card__col">
              <span className="compare-card__title">멤버십 연관매출</span>
              <span className="compare-card__metric">{formatCompactWon(data.membershipRevenue.memberRevenue)}</span>
            </div>
            <div className="compare-card__divider" />
            <div className="compare-card__col">
              <span className="compare-card__title">전체매출(POS)</span>
              <span className="compare-card__metric">{formatCompactWon(data.membershipRevenue.totalRevenue)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
