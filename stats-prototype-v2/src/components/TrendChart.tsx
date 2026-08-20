interface MonthDatum {
  month: string;
  단골: number;
  신규: number;
}

export default function TrendChart({ data }: { data: MonthDatum[] }) {
  const max = Math.max(...data.flatMap((d) => [d.단골, d.신규]), 1);

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
      </div>
    </div>
  );
}
