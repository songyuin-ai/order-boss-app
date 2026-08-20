interface Segment {
  label: string;
  pct: number;
}

// 사장님앱 카테고리컬 팔레트 슬롯 1~5 (blue/aqua/yellow/green/violet), 고정 순서
const COLORS = ["#2a78d6", "#1baf7a", "#eda100", "#008300", "#4a3aa7"];

export default function SegmentPieChart({ segments }: { segments: Segment[] }) {
  let cumulative = 0;
  const stops = segments
    .map((s, i) => {
      const start = cumulative * 3.6;
      cumulative += s.pct;
      const end = cumulative * 3.6;
      return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="pie-wrap">
      <div className="pie" style={{ background: `conic-gradient(${stops})` }} />
      <div className="pie-legend">
        {segments.map((s, i) => (
          <div key={s.label} className="pie-legend__item">
            <span className="dot" style={{ background: COLORS[i % COLORS.length] }} />
            {s.label} {s.pct}%
          </div>
        ))}
      </div>
    </div>
  );
}
