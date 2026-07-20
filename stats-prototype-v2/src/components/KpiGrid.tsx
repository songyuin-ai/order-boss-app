import type { KpiData, Indicator } from "../data/types";
import { formatSignedNumber, formatWon } from "../utils/format";
import IdBadge from "./IdBadge";

interface Props {
  data: KpiData;
  indicators: {
    revenue: Indicator;
    orders: Indicator;
    aov: Indicator;
    cancelRate: Indicator;
  };
  dailyAvgIndicators?: {
    revenue: Indicator;
    orders: Indicator;
  };
}

export default function KpiGrid({ data, indicators, dailyAvgIndicators }: Props) {
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

  if (dailyAvgIndicators && data.dailyAvgRevenue !== undefined && data.dailyAvgOrders !== undefined) {
    cells.push(
      {
        key: "dailyAvgRevenue",
        indicator: dailyAvgIndicators.revenue,
        label: "일평균 매출",
        value: formatWon(Math.round(data.dailyAvgRevenue)),
        delta: "",
        isUp: true,
      },
      {
        key: "dailyAvgOrders",
        indicator: dailyAvgIndicators.orders,
        label: "일평균 건수",
        value: `${Math.round(data.dailyAvgOrders).toLocaleString("ko-KR")}건`,
        delta: "",
        isUp: true,
      }
    );
  }

  return (
    <div className="kpi-grid">
      {cells.map((cell) => (
        <div key={cell.key} className="kpi-cell">
          <IdBadge id={cell.indicator.id} />
          <div className="kpi-cell__label">{cell.label}</div>
          <div className="kpi-cell__value">{cell.value}</div>
          {cell.delta && (
            <div className={`kpi-cell__delta ${cell.isUp ? "is-up" : "is-down"}`}>{cell.delta}</div>
          )}
        </div>
      ))}
    </div>
  );
}
