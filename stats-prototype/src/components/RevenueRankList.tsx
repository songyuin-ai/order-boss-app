import { formatCompactWon } from "../utils/format";

interface Item {
  name: string;
  revenue: number;
}

export default function RevenueRankList({ items }: { items: Item[] }) {
  return (
    <ol className="menu-list">
      {items.map((item, i) => (
        <li key={item.name} className="menu-list__item">
          <span className="menu-list__rank">{i + 1}</span>
          <span className="menu-list__name">{item.name}</span>
          <span className="menu-list__count">{formatCompactWon(item.revenue)}</span>
        </li>
      ))}
    </ol>
  );
}
