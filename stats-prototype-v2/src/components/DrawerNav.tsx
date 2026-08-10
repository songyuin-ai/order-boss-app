interface MenuItem {
  key: string;
  label: string;
}

interface SystemDef {
  key: string;
  label: string;
  menus: MenuItem[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  systems: SystemDef[];
  activeSystem: string;
  activeMenu: string;
  onNavigate: (system: string, menu: string) => void;
}

export default function DrawerNav({ open, onClose, systems, activeSystem, activeMenu, onNavigate }: Props) {
  const current = systems.find((s) => s.key === activeSystem) ?? systems[0];

  return (
    <>
      <div className={`drawer-backdrop${open ? " is-open" : ""}`} onClick={onClose} />
      <div className={`drawer${open ? " is-open" : ""}`}>
        <div className="drawer__title">메뉴</div>
        <div className="drawer__systems">
          {systems.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`drawer__system-btn${s.key === activeSystem ? " is-active" : ""}`}
              onClick={() => onNavigate(s.key, s.menus[0].key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="drawer__menus">
          {current.menus.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`drawer__menu-btn${m.key === activeMenu ? " is-active" : ""}`}
              onClick={() => onNavigate(current.key, m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
