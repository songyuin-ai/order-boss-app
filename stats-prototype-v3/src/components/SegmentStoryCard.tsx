import SegmentedNav from "./SegmentedNav";
import type { SegmentDetailPeriodData, SegmentKey } from "../data/segmentDetailDummy";
import { formatCompactWon } from "../utils/format";

const SEGMENT_TABS: { key: SegmentKey; label: string; icon: string }[] = [
  { key: "all", label: "전체", icon: "👥" },
  { key: "loyal", label: "단골", icon: "🧡" },
  { key: "new", label: "신규", icon: "⭐" },
  { key: "general", label: "일반", icon: "🙂" },
  { key: "dormant", label: "휴면", icon: "😴" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "커피/음료": "☕",
  디저트: "🍰",
  케이크: "🎂",
  "빙수/아이스크림": "🍧",
  "샌드위치/샐러드": "🥪",
};

interface Props {
  data: SegmentDetailPeriodData;
  segment: SegmentKey;
  onSegmentChange: (segment: SegmentKey) => void;
  periodLabel: string; // A
  storeName: string;
}

export default function SegmentStoryCard({ data, segment, onSegmentChange, periodLabel, storeName }: Props) {
  const tab = SEGMENT_TABS.find((t) => t.key === segment)!;

  return (
    <div className="story-card">
      <SegmentedNav
        options={SEGMENT_TABS.map((t) => ({ key: t.key, label: `${t.icon} ${t.label}` }))}
        active={segment}
        onChange={(k) => onSegmentChange(k as SegmentKey)}
        size="sm"
      />
      {segment === "dormant" ? (
        <div className="story-card__dormant">
          <div className="story-card__headline">
            <span className="story-card__icon">{tab.icon}</span>
            <div>
              <div className="story-card__headline-value">{data.dormant.customerCount.toLocaleString("ko-KR")}명</div>
              <div className="story-card__headline-sub">{storeName} 휴면 손님</div>
            </div>
          </div>
          <p className="story-card__dormant-note">{data.dormant.lastPurchaseNote}</p>
        </div>
      ) : (
        (() => {
          const seg = data[segment];
          const avgOrders = seg.orderCount / seg.customerCount;
          const perVisitSpend = Math.round(seg.revenue / seg.customerCount);
          return (
            <div>
              <div className="story-card__headline">
                <span className="story-card__icon">{tab.icon}</span>
                <div>
                  <div className="story-card__headline-value">{seg.customerCount.toLocaleString("ko-KR")}명</div>
                  <div className="story-card__headline-sub">
                    {periodLabel} {storeName} {tab.label}손님 방문
                  </div>
                </div>
              </div>

              <div className="stat-tile-grid">
                <div className="stat-tile">
                  <div className="stat-tile__label">주문수</div>
                  <div className="stat-tile__value">{seg.orderCount.toLocaleString("ko-KR")}회</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile__label">매출</div>
                  <div className="stat-tile__value">{formatCompactWon(seg.revenue)}</div>
                </div>
                <div className="stat-tile stat-tile--accent">
                  <div className="stat-tile__label">매출기여도</div>
                  <div className="stat-tile__value">{seg.revenueContributionPct}%</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile__label">평균 방문</div>
                  <div className="stat-tile__value">{avgOrders.toFixed(1)}회</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile__label">객단가</div>
                  <div className="stat-tile__value">{formatCompactWon(perVisitSpend)}</div>
                </div>
              </div>

              <div className="story-card__block">
                <div className="story-card__block-label">인기 카테고리</div>
                <div className="chip-row">
                  {seg.topCategories.map((c) => (
                    <span key={c.name} className="chip chip--category">
                      {CATEGORY_ICONS[c.name] ?? "🍽"} {c.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="story-card__block">
                <div className="story-card__block-label">구성</div>
                <ol className="ranked-list">
                  {seg.demographicTop3.map((d, i) => (
                    <li key={d.name} className="ranked-list__item">
                      <span className="ranked-list__rank">{i + 1}</span>
                      {d.name}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
