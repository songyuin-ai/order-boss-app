import type { CustomerSegmentInfo, SegmentKey } from "../data/customerSegmentsDummy";

interface Props {
  segments: CustomerSegmentInfo[];
  openKey: SegmentKey | null;
  onToggle: (key: SegmentKey) => void;
}

export default function CustomerSegmentCards({ segments, openKey, onToggle }: Props) {
  return (
    <div className="segment-cards">
      {segments.map((s) => {
        const isOpen = openKey === s.key;
        return (
          <div key={s.key} className={`segment-card${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="segment-card__row"
              onClick={() => onToggle(s.key)}
              aria-expanded={isOpen}
            >
              <span className="segment-card__dot" style={{ background: s.color }} />
              <span className="segment-card__body">
                <span className="segment-card__top">
                  <span className="segment-card__name">{s.label}</span>
                  <span className="segment-card__count">{s.count}명</span>
                </span>
                <span className="segment-card__desc">{s.desc}</span>
              </span>
              <span className="segment-card__chevron">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="segment-card__detail">
                <p className="segment-card__period-note">※ {s.periodNote}</p>

                <div className="stat-tile-grid">
                  <div className="stat-tile stat-tile--accent">
                    <div className="stat-tile__label">매출 기여도</div>
                    <div className="stat-tile__value">{s.revenueSharePct}%</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile__label">주 방문 시간대</div>
                    <div className="stat-tile__value">{s.peakHour}</div>
                  </div>
                </div>

                <div className="story-card__block">
                  <div className="story-card__block-label">인기 메뉴 TOP3</div>
                  <div className="chip-row">
                    {s.topProducts.map((p) => (
                      <span key={p.name} className="chip chip--category">
                        {p.name} {p.pct}%
                      </span>
                    ))}
                  </div>
                </div>

                <div className="story-card__block">
                  <div className="story-card__block-label">주 고객층</div>
                  <p className="segment-detail__demographic">{s.demographicTop}</p>
                </div>

                <div className="segment-detail__cta">{s.cta}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
