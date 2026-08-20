interface BarDatum {
  label: string;
  value: number | null;
  highlight?: boolean;
  valueLabel?: string;
  opacity?: number;
}

interface Props {
  data: BarDatum[];
  height?: number;
  showValueLabels?: boolean;
}

export default function BarChart({ data, height = 96, showValueLabels = false }: Props) {
  const max = Math.max(...data.map((d) => d.value ?? 0), 1);

  return (
    <div className="bar-chart">
      <div className="bar-chart__bars" style={{ height }}>
        {data.map((d) => (
          <div className="bar-chart__col" key={d.label}>
            {d.value !== null && showValueLabels && (
              <span className="bar-chart__value">{d.valueLabel}</span>
            )}
            {d.value !== null && (
              <div
                className={`bar-chart__bar${d.highlight ? " is-highlight" : ""}`}
                style={{
                  height: `${Math.max((d.value / max) * 100, 4)}%`,
                  opacity: d.opacity ?? 1,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="bar-chart__labels">
        {data.map((d) => (
          <div key={d.label} className={`bar-chart__label${d.highlight ? " is-highlight" : ""}`}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
