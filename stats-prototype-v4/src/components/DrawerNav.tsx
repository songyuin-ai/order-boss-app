import { useEffect, useState } from "react";

export interface DrawerMenuItem {
  key: string;
  label: string;
  children?: DrawerMenuItem[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: DrawerMenuItem[];
  activeKey: string;
  onNavigate: (key: string) => void;
}

export default function DrawerNav({ open, onClose, items, activeKey, onNavigate }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const parent = items.find((it) => it.children?.some((c) => c.key === activeKey));
    if (parent) setExpanded((prev) => new Set(prev).add(parent.key));
  }, [activeKey, items]);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <div className={`drawer-backdrop${open ? " is-open" : ""}`} onClick={onClose} />
      <nav className={`drawer${open ? " is-open" : ""}`}>
        <div className="drawer__title">전체 메뉴</div>
        {items.map((item) =>
          item.children ? (
            <div key={item.key} className={`drawer__group${expanded.has(item.key) ? " is-expanded" : ""}`}>
              <button type="button" className="drawer__item drawer__group-head" onClick={() => toggle(item.key)}>
                <span>{item.label}</span>
                <span className="drawer__group-arrow">›</span>
              </button>
              <div className="drawer__group-children">
                {item.children.map((child) => (
                  <button
                    key={child.key}
                    type="button"
                    className={`drawer__item drawer__item--child${child.key === activeKey ? " is-active" : ""}`}
                    onClick={() => onNavigate(child.key)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              key={item.key}
              type="button"
              className={`drawer__item${item.key === activeKey ? " is-active" : ""}`}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          )
        )}
        <div className="drawer__note">※ 멤버십/딜리버리 고객 분석은 홈의 드릴다운 카드에서도 동일하게 진입 가능</div>
      </nav>
    </>
  );
}
