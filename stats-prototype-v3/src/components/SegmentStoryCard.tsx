import SegmentedNav from "./SegmentedNav";
import type { SegmentDetailPeriodData, SegmentKey } from "../data/segmentDetailDummy";
import { formatWon } from "../utils/format";

const SEGMENT_TABS: { key: SegmentKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "loyal", label: "단골" },
  { key: "new", label: "신규" },
  { key: "general", label: "일반" },
  { key: "dormant", label: "휴면" },
];

interface Props {
  data: SegmentDetailPeriodData;
  segment: SegmentKey;
  onSegmentChange: (segment: SegmentKey) => void;
  periodLabel: string; // A
  storeName: string;
}

export default function SegmentStoryCard({ data, segment, onSegmentChange, periodLabel, storeName }: Props) {
  const segmentLabel = SEGMENT_TABS.find((t) => t.key === segment)?.label ?? "";

  return (
    <div className="story-card">
      <SegmentedNav options={SEGMENT_TABS} active={segment} onChange={(k) => onSegmentChange(k as SegmentKey)} size="sm" />
      {segment === "dormant" ? (
        <div className="story-card__lines">
          <p className="story-card__line">
            {storeName} 휴면 손님은 <b>{data.dormant.customerCount.toLocaleString("ko-KR")}명</b>이예요.
          </p>
          <p className="story-card__line">{data.dormant.lastPurchaseNote}</p>
        </div>
      ) : (
        (() => {
          const seg = data[segment];
          return (
            <div className="story-card__lines">
              <p className="story-card__line">
                {periodLabel} {storeName} {segmentLabel}손님은 <b>{seg.customerCount.toLocaleString("ko-KR")}명</b> 방문했어요
              </p>
              <p className="story-card__line">
                <b>{seg.orderCount.toLocaleString("ko-KR")}회</b> 주문하여 <b>{formatWon(seg.revenue)}</b> 구매했어요, 전체 매출 중{" "}
                <b>{seg.revenueContributionPct}%</b> 차지해요
              </p>
              <p className="story-card__line">
                {periodLabel} 간 평균 <b>{(seg.orderCount / seg.customerCount).toFixed(1)}회</b> 방문, 1회 구매 시{" "}
                <b>{formatWon(Math.round(seg.revenue / seg.customerCount))}</b> 어치 구매해요
              </p>
              <p className="story-card__line">
                주로 <b>{seg.topCategories.map((c) => c.name).join(", ")}</b> 카테고리를 구매해요
              </p>
              <p className="story-card__line">
                <b>{seg.demographicTop3.map((d) => d.name).join(", ")}</b> 로 구성되어 있어요
              </p>
            </div>
          );
        })()
      )}
    </div>
  );
}
