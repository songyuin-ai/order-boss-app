import type { KpiData, Indicator } from "../data/types";
import { formatSignedNumber, formatWon } from "../utils/format";
import IndicatorHover from "./IndicatorHover";

interface Props {
  data: KpiData;
  indicators: {
    revenue: Indicator;
    orders: Indicator;
    aov: Indicator;
    cancelRate: Indicator;
  };
}

export default function KpiGrid({ data, indicators }: Props) {
  const cells = [
    {
      key: "revenue",
      indicator: indicators.revenue,
      label: "매출액",
      value: formatWon(data.revenue),
      delta: `${formatSignedNumber(data.revenueDelta, "%")} ${data.compareLabel}`,
      isUp: data.revenueDelta >= 0,
    },
    {
      key: "orders",
      indicator: indicators.orders,
      label: "주문 건수",
      value: `${data.orders.toLocaleString("ko-KR")}건`,
      delta: `${formatSignedNumber(data.ordersDelta, "건")} ${data.compareLabel}`,
      isUp: data.ordersDelta >= 0,
    },
    {
      key: "aov",
      indicator: indicators.aov,
      label: "객단가",
      value: formatWon(Math.round(data.aov)),
      delta: `${formatSignedNumber(data.aovDelta, "%")} ${data.compareLabel}`,
      isUp: data.aovDelta >= 0,
    },
    {
      key: "cancelRate",
      indicator: indicators.cancelRate,
      label: "취소율",
      value: `${data.cancelRate}%`,
      delta: `${formatSignedNumber(data.cancelDelta, "%p")} ${data.compareLabel}`,
      // 취소율은 증가가 나쁨 -> 부호 반전
      isUp: data.cancelDelta <= 0,
    },
  ];

  return (
    <div className="kpi-grid">
      {cells.map((cell) => (
        <IndicatorHover key={cell.key} indicator={cell.indicator} className="kpi-cell">
          <div className="kpi-cell__label">{cell.label}</div>
          <div className="kpi-cell__value">{cell.value}</div>
          <div className={`kpi-cell__delta ${cell.isUp ? "is-up" : "is-down"}`}>{cell.delta}</div>
        </IndicatorHover>
      ))}
    </div>
  );
}
