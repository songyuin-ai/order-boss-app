interface Props {
  delivery: number;
  pickup: number;
}

export default function DonutChart({ delivery, pickup }: Props) {
  const deg = delivery * 3.6;

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{
          background: `conic-gradient(var(--accent) 0deg ${deg}deg, var(--track) ${deg}deg 360deg)`,
        }}
      >
        <div className="donut__hole">
          <span className="donut__value">{delivery}%</span>
          <span className="donut__label">배달</span>
        </div>
      </div>
      <div className="donut-legend">
        <div className="donut-legend__item">
          <span className="dot dot--accent" />
          배달 {delivery}%
        </div>
        <div className="donut-legend__item">
          <span className="dot dot--muted" />
          픽업 {pickup}%
        </div>
      </div>
    </div>
  );
}
