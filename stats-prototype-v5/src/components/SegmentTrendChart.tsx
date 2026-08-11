import type { SegmentTrendPoint } from "../data/customerSegmentsDummy";

export default function SegmentTrendChart({ data }: { data: SegmentTrendPoint[] }) {
  const max = Math.max(...data.flatMap((r) => [r.storeCount, r.regionAvgCount]), 1);

  return (
    <div className="trend-chart">
      <div className="trend-chart__legend">
        <span className="legend-item">
          <span className="dot dot--accent" /> 우리 매장
        </span>
        <span className="legend-item">
          <span className="dot dot--muted" /> 주변매장 평균
        </span>
      </div>
      <div className="trend-chart__bars">
        {data.map((r) => {
          const diff = r.storeCount - r.regionAvgCount;
          const isUp = diff >= 0;
          return (
            <div className="trend-chart__col" key={r.month}>
              <div className={`trend-chart__diff ${isUp ? "is-up" : "is-down"}`}>
                {isUp ? "+" : ""}
                {diff}명
              </div>
              <div className="trend-chart__pair">
                <div
                  className="trend-chart__bar is-store"
                  style={{ height: `${(r.storeCount / max) * 100}%` }}
                  title={`우리 매장 ${r.storeCount}명`}
                />
                <div
                  className="trend-chart__bar is-region"
                  style={{ height: `${(r.regionAvgCount / max) * 100}%` }}
                  title={`주변매장 평균 ${r.regionAvgCount}명`}
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
