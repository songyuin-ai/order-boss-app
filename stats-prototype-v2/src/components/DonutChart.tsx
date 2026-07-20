interface Props {
  primaryValue: number;
  secondaryValue: number;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export default function DonutChart({
  primaryValue,
  secondaryValue,
  primaryLabel = "배달",
  secondaryLabel = "픽업",
}: Props) {
  const deg = primaryValue * 3.6;

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{
          background: `conic-gradient(var(--accent) 0deg ${deg}deg, var(--track) ${deg}deg 360deg)`,
        }}
      >
        <div className="donut__hole">
          <span className="donut__value">{primaryValue}%</span>
          <span className="donut__label">{primaryLabel}</span>
        </div>
      </div>
      <div className="donut-legend">
        <div className="donut-legend__item">
          <span className="dot dot--accent" />
          {primaryLabel} {primaryValue}%
        </div>
        <div className="donut-legend__item">
          <span className="dot dot--muted" />
          {secondaryLabel} {secondaryValue}%
        </div>
      </div>
    </div>
  );
}
