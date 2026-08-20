import type { RepurchaseRankEntry } from "../data/customerDetailDummy";

export default function RepurchaseRankList({ items }: { items: RepurchaseRankEntry[] }) {
  return (
    <ol className="menu-list">
      {items.map((item) => (
        <li key={item.rank} className="menu-list__item">
          <span className="menu-list__rank">{item.rank}</span>
          <span className="menu-list__name">{item.name}</span>
          <span className="menu-list__count">{item.repurchaseRatePct.toFixed(1)}%</span>
        </li>
      ))}
    </ol>
  );
}
