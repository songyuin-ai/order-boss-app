import type { SegmentKey } from "../data/segmentDetailDummy";

export interface SegmentRatioSlice {
  key: SegmentKey;
  label: string;
  pct: number;
  customerCount: number;
}

interface Props {
  segments: SegmentRatioSlice[];
  active: SegmentKey;
  onSelect: (key: SegmentKey) => void;
}

// 사장님앱 카테고리컬 팔레트에서 세그먼트 4종에 고정 배정 (찐단골/떠나려는 단골/단골 후보 손님/가끔 오시는 손님)
const COLORS: Record<SegmentKey, string> = {
  realRegular: "#2a78d6",
  leavingRegular: "#eda100",
  candidate: "#1baf7a",
  occasional: "#8a94a6",
};

const SIZE = 96;
const CENTER = SIZE / 2;
const OUTER_R = 46;
const INNER_R = 26;

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

// 도넛 한 조각의 SVG path (바깥 호 → 안쪽으로 꺾어 안쪽 호를 반대 방향으로 그림)
function donutSlicePath(startDeg: number, endDeg: number) {
  const startOuter = polarToCartesian(startDeg, OUTER_R);
  const endOuter = polarToCartesian(endDeg, OUTER_R);
  const startInner = polarToCartesian(endDeg, INNER_R);
  const endInner = polarToCartesian(startDeg, INNER_R);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

// 클릭 가능한 도넛 조각 + 범례. 조각/범례 어느 쪽을 눌러도 같은 onSelect가 호출되어
// 상위 화면의 세그먼트 선택 상태(비율차트·상세분석 탭·추이차트 공유)와 동기화됨
export default function SegmentRatioChart({ segments, active, onSelect }: Props) {
  let cumulative = 0;
  const slices = segments.map((s) => {
    const start = cumulative * 3.6;
    cumulative += s.pct;
    const end = cumulative * 3.6;
    return { ...s, start, end };
  });

  return (
    <div className="segment-ratio">
      <svg
        className="segment-ratio__chart"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="손님 세그먼트 비율"
      >
        {slices.map((s) => (
          <path
            key={s.key}
            d={donutSlicePath(s.start, s.end)}
            fill={COLORS[s.key]}
            opacity={active === s.key ? 1 : 0.4}
            onClick={() => onSelect(s.key)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
      <div className="segment-ratio__legend">
        {segments.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`segment-ratio__legend-item${active === s.key ? " is-active" : ""}`}
            onClick={() => onSelect(s.key)}
          >
            <span className="dot" style={{ background: COLORS[s.key] }} />
            <span className="segment-ratio__legend-label">{s.label}</span>
            <span className="segment-ratio__legend-pct">{s.pct}%</span>
            <span className="segment-ratio__legend-count">{s.customerCount.toLocaleString("ko-KR")}명</span>
          </button>
        ))}
      </div>
    </div>
  );
}
