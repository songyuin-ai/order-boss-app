interface MonthDatum {
  month: string;
  단골: number;
  신규: number;
  regionAvgLoyal: number;
  regionAvgNew: number;
}

export default function TrendChart({ data }: { data: MonthDatum[] }) {
  const regionAvgLoyal = Math.round(data.reduce((sum, d) => sum + d.regionAvgLoyal, 0) / data.length);
  const regionAvgNew = Math.round(data.reduce((sum, d) => sum + d.regionAvgNew, 0) / data.length);
  const max = Math.max(...data.flatMap((d) => [d.단골, d.신규, d.regionAvgLoyal, d.regionAvgNew]), 1);

  return (
    <div className="trend-chart">
      <div className="trend-chart__legend">
        <span className="legend-item">
          <span className="dot dot--accent" /> 단골
        </span>
        <span className="legend-item">
          <span className="dot dot--muted" /> 신규
        </span>
      </div>
      <div className="trend-chart__bars">
        {data.map((d) => (
          <div className="trend-chart__col" key={d.month}>
            <div className="trend-chart__pair">
              <div
                className="trend-chart__bar is-loyal"
                style={{ height: `${(d.단골 / max) * 100}%` }}
                title={`단골 ${d.단골}명`}
              />
              <div
                className="trend-chart__bar is-new"
                style={{ height: `${(d.신규 / max) * 100}%` }}
                title={`신규 ${d.신규}명`}
              />
            </div>
            <div className="trend-chart__label">{d.month}</div>
          </div>
        ))}
        <div className="trend-chart__divider" />
        <div className="trend-chart__col trend-chart__col--region">
          <div className="trend-chart__pair">
            <div
              className="trend-chart__bar is-loyal is-region"
              style={{ height: `${(regionAvgLoyal / max) * 100}%` }}
              title={`주변매장 평균 단골 ${regionAvgLoyal}명`}
            />
            <div
              className="trend-chart__bar is-new is-region"
              style={{ height: `${(regionAvgNew / max) * 100}%` }}
              title={`주변매장 평균 신규 ${regionAvgNew}명`}
            />
          </div>
          <div className="trend-chart__label">주변매장 평균</div>
        </div>
      </div>
    </div>
  );
}
