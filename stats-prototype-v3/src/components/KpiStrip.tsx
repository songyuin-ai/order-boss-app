import Card from "./Card";
import type { Indicator } from "../data/types";

interface Props {
  periodLabel: string;
  memberCustomerCount: number;
  memberOrderPct: number;
  regionAvgMemberOrderPct: number;
  hValuePct: number;
  regionAvgHValuePct: number;
  memberCustomersIndicator: Indicator;
  hValueIndicator: Indicator;
}

const GAUGE_MAX = 200; // 게이지 바가 표현하는 최대 스케일(%). 100%에 기준선 마커 표시

function CompareBadge({ diff }: { diff: number }) {
  const isAbove = diff >= 0;
  return (
    <div className={`kpi-tile__badge ${isAbove ? "kpi-tile__badge--up" : "kpi-tile__badge--down"}`}>
      주변매장 평균보다 {Math.abs(diff)}%p {isAbove ? "높아요" : "낮아요"}
    </div>
  );
}

export default function KpiStrip({
  periodLabel,
  memberCustomerCount,
  memberOrderPct,
  regionAvgMemberOrderPct,
  hValuePct,
  regionAvgHValuePct,
  memberCustomersIndicator,
  hValueIndicator,
}: Props) {
  const orderShareGap = Math.round((memberOrderPct - regionAvgMemberOrderPct) * 10) / 10;
  const hValueGap = hValuePct - regionAvgHValuePct;
  const gaugeFillPct = Math.min(hValuePct, GAUGE_MAX);

  return (
    <div className="kpi-strip">
      <Card className="kpi-tile" indicator={memberCustomersIndicator}>
        <div className="kpi-tile__label">멤버십 손님</div>
        <div className="kpi-tile__value">{memberCustomerCount.toLocaleString("ko-KR")}명</div>
        <div className="kpi-tile__sub">
          {periodLabel} 방문 · 전체 주문의 {memberOrderPct}%
        </div>
        <CompareBadge diff={orderShareGap} />
      </Card>

      <Card className="kpi-tile" indicator={hValueIndicator}>
        <div className="kpi-tile__label">포인트 활용 지표</div>
        <div className="kpi-tile__value">{hValuePct}%</div>
        <div className="kpi-tile__sub">적립부담금 1원당 사용매출 {(hValuePct / 100).toFixed(2)}원</div>
        <div className="gauge">
          <div className="gauge__track">
            <div className="gauge__fill" style={{ width: `${(gaugeFillPct / GAUGE_MAX) * 100}%` }} />
            <div className="gauge__marker" style={{ left: `${(100 / GAUGE_MAX) * 100}%` }} />
          </div>
        </div>
        <CompareBadge diff={hValueGap} />
      </Card>
    </div>
  );
}
