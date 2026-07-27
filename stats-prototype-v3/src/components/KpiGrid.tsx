import type { Indicator } from "../data/types";
import type { DeliveryKpiPeriod } from "../data/deliveryDummy";
import { formatWon } from "../utils/format";
import IdBadge from "./IdBadge";

interface Props {
  data: DeliveryKpiPeriod;
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
      deltaBadge: data.revenueDeltaBadge,
      regionBadge: data.revenueRegionBadge,
    },
    {
      key: "orders",
      indicator: indicators.orders,
      label: "주문 건수",
      value: `${data.orders.toLocaleString("ko-KR")}건`,
      deltaBadge: data.ordersDeltaBadge,
      regionBadge: data.ordersRegionBadge,
    },
    {
      key: "aov",
      indicator: indicators.aov,
      label: "객단가",
      value: formatWon(Math.round(data.aov)),
      deltaBadge: data.aovDeltaBadge,
      regionBadge: data.aovRegionBadge,
    },
    {
      key: "cancelRate",
      indicator: indicators.cancelRate,
      label: "취소율",
      value: `${data.cancelRate}%`,
      deltaBadge: data.cancelRateDeltaBadge,
      regionBadge: data.cancelRateRegionBadge,
    },
  ];

  return (
    <div className="kpi-grid">
      {cells.map((cell) => (
        <div key={cell.key} className="kpi-cell">
          <IdBadge id={cell.indicator.id} />
          <div className="kpi-cell__label">{cell.label}</div>
          <div className="kpi-cell__value">{cell.value}</div>
          <div className="kpi-cell__badges">
            {cell.deltaBadge && <span className="badge badge--primary">{cell.deltaBadge}</span>}
            <span className="badge badge--muted">{cell.regionBadge}</span>
          </div>
        </div>
      ))}
      {dailyAvgIndicators && data.dailyAvgRevenue !== undefined && data.dailyAvgOrders !== undefined && (
        <>
          <div className="kpi-cell">
            <IdBadge id={dailyAvgIndicators.revenue.id} />
            <div className="kpi-cell__label">일평균 매출</div>
            <div className="kpi-cell__value">{formatWon(Math.round(data.dailyAvgRevenue))}</div>
          </div>
          <div className="kpi-cell">
            <IdBadge id={dailyAvgIndicators.orders.id} />
            <div className="kpi-cell__label">일평균 건수</div>
            <div className="kpi-cell__value">{Math.round(data.dailyAvgOrders).toLocaleString("ko-KR")}건</div>
          </div>
        </>
      )}
    </div>
  );
}
