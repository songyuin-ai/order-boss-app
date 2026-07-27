import { useState } from "react";
import SegmentedNav from "./SegmentedNav";

interface MonthDatum {
  month: string;
  단골: number;
  신규: number;
  regionAvgLoyal: number;
  regionAvgNew: number;
}

type Metric = "loyal" | "new";

const METRIC_TABS = [
  { key: "loyal", label: "🧡 단골" },
  { key: "new", label: "⭐ 신규" },
];

export default function TrendChart({ data }: { data: MonthDatum[] }) {
  const [metric, setMetric] = useState<Metric>("loyal");

  const rows = data.map((d) => ({
    month: d.month,
    ours: metric === "loyal" ? d.단골 : d.신규,
    region: metric === "loyal" ? d.regionAvgLoyal : d.regionAvgNew,
  }));
  const max = Math.max(...rows.flatMap((r) => [r.ours, r.region]), 1);

  return (
    <div className="trend-chart">
      <SegmentedNav options={METRIC_TABS} active={metric} onChange={(k) => setMetric(k as Metric)} size="sm" />
      <div className="trend-chart__legend">
        <span className="legend-item">
          <span className="dot dot--accent" /> 우리 매장
        </span>
        <span className="legend-item">
          <span className="dot dot--muted" /> 주변매장 평균
        </span>
      </div>
      <div className="trend-chart__bars">
        {rows.map((r) => {
          const diff = r.ours - r.region;
          const isUp = diff >= 0;
          return (
            <div className="trend-chart__col" key={r.month}>
              <div className={`trend-chart__diff ${isUp ? "is-up" : "is-down"}`}>
                {isUp ? "+" : ""}
                {diff}명
              </div>
              <div className="trend-chart__pair">
                <div
                  className="trend-chart__bar is-loyal"
                  style={{ height: `${(r.ours / max) * 100}%` }}
                  title={`우리 매장 ${r.ours}명`}
                />
                <div
                  className="trend-chart__bar is-new is-region"
                  style={{ height: `${(r.region / max) * 100}%` }}
                  title={`주변매장 평균 ${r.region}명`}
                />
              </div>
              <div className="trend-chart__label">{r.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
