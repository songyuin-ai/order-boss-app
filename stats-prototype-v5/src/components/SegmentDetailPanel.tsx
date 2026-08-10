import SegmentedNav from "./SegmentedNav";
import type {
  SegmentDetailSnapshot,
  SegmentFullDetail,
  SegmentLeavingDetail,
  SegmentOccasionalDetail,
  SegmentKey,
} from "../data/segmentDetailDummy";
import {
  SEGMENT_TABS,
  SEGMENT_COLORS,
  getSegmentCopy,
  SEGMENT_CTA,
  SEGMENT_CTA_FILTERED,
  SEGMENT_CTA_PRIORITY,
} from "../data/segmentMeta";
import { formatCompactWon } from "../utils/format";

interface Props {
  data: SegmentDetailSnapshot;
  segment: SegmentKey;
  onSegmentChange: (segment: SegmentKey) => void;
  avgOrdFilterOn: boolean;
}

function FullStats({ d }: { d: SegmentFullDetail }) {
  return (
    <>
      <div className="stat-tile-grid">
        <div className="stat-tile stat-tile--accent">
          <div className="stat-tile__label">방문 횟수 (90일)</div>
          <div className="stat-tile__value">{d.visitCount}회</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">총 소비액 (90일)</div>
          <div className="stat-tile__value">{formatCompactWon(d.totalSpend)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">객단가</div>
          <div className="stat-tile__value">{formatCompactWon(d.aov)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">주 방문 시간대</div>
          <div className="stat-tile__value">{d.peakHour}</div>
        </div>
      </div>
      <div className="story-card__block">
        <div className="story-card__block-label">인기상품 TOP3 (비율 기준)</div>
        <div className="chip-row">
          {d.topProducts.map((p) => (
            <span key={p.name} className="chip chip--category">
              {p.name} {p.pct}%
            </span>
          ))}
        </div>
      </div>
      <div className="story-card__block">
        <div className="story-card__block-label">주 고객층</div>
        <p className="segment-detail__demographic">{d.demographicTop}</p>
      </div>
    </>
  );
}

function LeavingStats({ d }: { d: SegmentLeavingDetail }) {
  return (
    <>
      <div className="stat-tile-grid">
        <div className="stat-tile stat-tile--accent">
          <div className="stat-tile__label">방문 횟수 (90일)</div>
          <div className="stat-tile__value">{d.visitCount}회</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">총 소비액 (90일)</div>
          <div className="stat-tile__value">{formatCompactWon(d.totalSpend)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">객단가</div>
          <div className="stat-tile__value">{formatCompactWon(d.aov)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">취소율</div>
          <div className="stat-tile__value">{d.cancelRatePct}%</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__label">마지막 방문 경과</div>
          <div className="stat-tile__value">{d.lastVisitDaysAgo}일</div>
        </div>
      </div>
      <p className="segment-detail__historical-badge">과거 활동 기준</p>
      <div className="story-card__block">
        <div className="story-card__block-label">인기상품 TOP3</div>
        <div className="chip-row">
          {d.topProducts.map((p) => (
            <span key={p.name} className="chip chip--category">
              {p.name} {p.pct}%
            </span>
          ))}
        </div>
      </div>
      <div className="story-card__block">
        <div className="story-card__block-label">주 방문 시간대</div>
        <p className="segment-detail__demographic">{d.peakHour}</p>
      </div>
    </>
  );
}

function OccasionalStats({ d }: { d: SegmentOccasionalDetail }) {
  return (
    <div className="stat-tile-grid">
      <div className="stat-tile stat-tile--accent">
        <div className="stat-tile__label">방문 횟수 (90일)</div>
        <div className="stat-tile__value">{d.visitCount}회</div>
      </div>
      <div className="stat-tile">
        <div className="stat-tile__label">총 소비액 (90일)</div>
        <div className="stat-tile__value">{formatCompactWon(d.totalSpend)}</div>
      </div>
    </div>
  );
}

export default function SegmentDetailPanel({ data, segment, onSegmentChange, avgOrdFilterOn }: Props) {
  const activeMeta = SEGMENT_TABS.find((t) => t.key === segment)!;
  const seg = data[segment];
  const cta = (avgOrdFilterOn && SEGMENT_CTA_FILTERED[segment]) || SEGMENT_CTA[segment];

  return (
    <div className="story-card">
      <SegmentedNav options={SEGMENT_TABS} active={segment} onChange={(k) => onSegmentChange(k as SegmentKey)} size="xs" />

      <div className="segment-detail__group-header" style={{ color: SEGMENT_COLORS[segment] }}>
        {activeMeta.label}
      </div>

      <div className="story-card__headline">
        <div className="story-card__headline-value">{seg.customerCount.toLocaleString("ko-KR")}명</div>
        <div className="story-card__headline-sub">최근 90일 기준</div>
      </div>

      <p className="segment-detail__copy">{getSegmentCopy(segment, data)}</p>

      {segment === "occasional" && <OccasionalStats d={data.occasional} />}
      {segment === "leavingRegular" && <LeavingStats d={data.leavingRegular} />}
      {(segment === "realRegular" || segment === "candidate") && <FullStats d={data[segment]} />}

      {cta && (
        <div className={`segment-detail__cta${SEGMENT_CTA_PRIORITY[segment] ? " segment-detail__cta--priority" : ""}`}>
          {cta}
        </div>
      )}
    </div>
  );
}
