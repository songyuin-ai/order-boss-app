import Card from "./Card";
import type { Indicator } from "../data/types";

interface Props {
  periodLabel: string;
  memberCustomerCount: number;
  memberOrderCount: number;
  memberEarnOrderCount: number;
  memberUseOrderCount: number;
  regionAvgMemberOrderCount: number;
  hValuePct: number;
  regionAvgHValuePct: number;
  memberOrderIndicator: Indicator;
  hValueIndicator: Indicator;
}

const GAUGE_MAX = 200; // 게이지 바가 표현하는 최대 스케일(%). 100%에 기준선 마커 표시

function CompareBadge({ diff, unit }: { diff: number; unit: string }) {
  const isAbove = diff >= 0;
  return (
    <div className={`kpi-tile__badge ${isAbove ? "kpi-tile__badge--up" : "kpi-tile__badge--down"}`}>
      주변매장 평균보다 {Math.abs(diff).toLocaleString("ko-KR")}
      {unit} {isAbove ? "많아요" : "적어요"}
    </div>
  );
}

export default function KpiStrip({
  periodLabel,
  memberCustomerCount,
  memberOrderCount,
  memberEarnOrderCount,
  memberUseOrderCount,
  regionAvgMemberOrderCount,
  hValuePct,
  regionAvgHValuePct,
  memberOrderIndicator,
  hValueIndicator,
}: Props) {
  // (v4) POS 전체 주문건수 분모 없이, HPC 적립·사용 주문건수(절대값)끼리만 비교
  const orderCountGap = memberOrderCount - regionAvgMemberOrderCount;
  const hValueGap = hValuePct - regionAvgHValuePct;
  const gaugeFillPct = Math.min(hValuePct, GAUGE_MAX);

  return (
    <div className="kpi-strip">
      <Card className="kpi-tile" indicator={memberOrderIndicator}>
        <div className="kpi-tile__label">적립/사용 주문건수</div>
        <div className="kpi-tile__value">{memberOrderCount.toLocaleString("ko-KR")}건</div>
        <div className="kpi-tile__sub">
          적립 {memberEarnOrderCount.toLocaleString("ko-KR")}건 · 사용 {memberUseOrderCount.toLocaleString("ko-KR")}건 ·{" "}
          {periodLabel} 손님 {memberCustomerCount.toLocaleString("ko-KR")}명 방문
        </div>
        <CompareBadge diff={orderCountGap} unit="건" />
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
        <CompareBadge diff={hValueGap} unit="%p" />
      </Card>
    </div>
  );
}
