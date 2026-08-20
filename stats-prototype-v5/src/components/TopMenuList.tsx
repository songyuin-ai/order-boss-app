import type { MenuItem } from "../data/types";

export default function TopMenuList({ items }: { items: MenuItem[] }) {
  return (
    <ol className="menu-list">
      {items.map((item) => (
        <li key={item.rank} className="menu-list__item">
          <span className="menu-list__rank">{item.rank}</span>
          <span className="menu-list__name">{item.name}</span>
          <span className="menu-list__count">{item.count.toLocaleString("ko-KR")}건</span>
        </li>
      ))}
    </ol>
  );
}
