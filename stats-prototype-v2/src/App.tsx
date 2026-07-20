import { useState } from "react";
import MobileFrame from "./components/MobileFrame";
import SegmentedNav from "./components/SegmentedNav";
import DrawerNav from "./components/DrawerNav";
import PlaceholderScreen from "./components/PlaceholderScreen";
import IndicatorPanel from "./components/IndicatorPanel";
import PeriodFilterButton from "./components/PeriodFilterButton";
import PeriodFilterModal from "./components/PeriodFilterModal";
import PosScreen from "./screens/PosScreen";
import CustomerCompositionScreen from "./screens/CustomerCompositionScreen";
import CustomerDetailScreen from "./screens/CustomerDetailScreen";
import MembershipScreen from "./screens/MembershipScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import { IndicatorContext } from "./context/IndicatorContext";
import { DataProvider, useAppData } from "./context/DataContext";
import { DEFAULT_PERIOD, type PeriodSelection } from "./lib/period";
import type { Indicator } from "./data/types";

interface MenuItem {
  key: string;
  label: string;
}

interface SystemDef {
  key: string;
  label: string;
  menus: MenuItem[];
}

const SYSTEMS: SystemDef[] = [
  {
    key: "happy",
    label: "해피포인트",
    menus: [
      { key: "home", label: "홈" },
      { key: "pos", label: "전체 매출 통계" },
      { key: "customerComposition", label: "고객 구성" },
      { key: "customerDetail", label: "고객 상세분석" },
      { key: "membership", label: "멤버십 가치 분석" },
    ],
  },
  {
    key: "delivery",
    label: "딜리버리",
    menus: [
      { key: "home", label: "홈" },
      { key: "deliveryStats", label: "딜리버리 통계" },
      { key: "settlement", label: "정산" },
      { key: "orderManagement", label: "주문관리" },
      { key: "productManagement", label: "상품관리" },
      { key: "storeManagement", label: "매장관리" },
    ],
  },
];

const CUSTOMER_GROUP_MENUS: MenuItem[] = [
  { key: "customerComposition", label: "고객 구성" },
  { key: "customerDetail", label: "고객 상세분석" },
  { key: "membership", label: "멤버십 가치 분석" },
];
const CUSTOMER_GROUP_KEYS = CUSTOMER_GROUP_MENUS.map((m) => m.key);

const STATUS_LABEL: Record<string, string> = {
  loading: "구글시트 연결 중…",
  live: "구글시트 데이터 연결됨",
  fallback: "기본 데이터 표시 중 (시트 미연결)",
};

function DataStatusBadge() {
  const { status } = useAppData();
  return <span className={`data-status data-status--${status}`}>{STATUS_LABEL[status]}</span>;
}

function AppShell() {
  const [system, setSystem] = useState("happy");
  const [menu, setMenu] = useState("pos");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodSelection>(DEFAULT_PERIOD);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelIndicators, setPanelIndicators] = useState<Indicator[]>([]);
  const [panelLabel, setPanelLabel] = useState("");

  const toggle = (id: string) => setActiveId((prev) => (prev === id ? null : id));
  const clear = () => setActiveId(null);

  const handlePanelChange = (indicators: Indicator[], label: string) => {
    setPanelIndicators(indicators);
    setPanelLabel(label);
  };

  const handleNavigate = (systemKey: string, menuKey: string) => {
    setSystem(systemKey);
    setMenu(menuKey);
    setDrawerOpen(false);
    setPanelIndicators([]);
    setPanelLabel("");
    clear();
  };

  const handleGroupTabChange = (menuKey: string) => {
    setMenu(menuKey);
    setPanelIndicators([]);
    setPanelLabel("");
    clear();
  };

  const currentSystem = SYSTEMS.find((s) => s.key === system) ?? SYSTEMS[0];
  const currentMenuLabel = currentSystem.menus.find((m) => m.key === menu)?.label ?? "";

  const renderScreen = () => {
    if (system === "happy") {
      if (CUSTOMER_GROUP_KEYS.includes(menu)) {
        return (
          <div className="screen">
            <SegmentedNav options={CUSTOMER_GROUP_MENUS} active={menu} onChange={handleGroupTabChange} size="sm" />
            <div className="screen__period-bar">
              <PeriodFilterButton value={period} onClick={() => setPeriodModalOpen(true)} />
            </div>
            {menu === "customerComposition" && (
              <CustomerCompositionScreen period={period} onPanelChange={handlePanelChange} />
            )}
            {menu === "customerDetail" && <CustomerDetailScreen period={period} onPanelChange={handlePanelChange} />}
            {menu === "membership" && <MembershipScreen period={period} onPanelChange={handlePanelChange} />}
            <PeriodFilterModal
              open={periodModalOpen}
              value={period}
              onApply={setPeriod}
              onClose={() => setPeriodModalOpen(false)}
            />
          </div>
        );
      }
      if (menu === "pos") return <PosScreen onPanelChange={handlePanelChange} />;
      return <PlaceholderScreen title={currentMenuLabel} />;
    }

    if (menu === "deliveryStats") return <DeliveryScreen onPanelChange={handlePanelChange} />;
    return <PlaceholderScreen title={currentMenuLabel} />;
  };

  return (
    <IndicatorContext.Provider value={{ activeId, toggle, clear }}>
      <div className="app">
        <div className="app__intro">
          <h1>사장님앱 통계 메뉴 프로토타입 v2</h1>
          <p>
            좌측 상단 메뉴 버튼으로 해피포인트/딜리버리 화면을 전환할 수 있습니다. 각 차트의 식별자(예:{" "}
            <b>data_001</b>)를 클릭하면 우측 지표 표에서 해당 행이 강조되고 나머지는 흐려집니다.
          </p>
          <DataStatusBadge />
        </div>
        <div className="layout" onClick={clear}>
          <MobileFrame>
            <div className="app-bar">
              <button
                type="button"
                className="hamburger-btn"
                aria-label="메뉴 열기"
                onClick={(e) => {
                  e.stopPropagation();
                  setDrawerOpen(true);
                }}
              >
                <span />
                <span />
                <span />
              </button>
              <div className="app-bar__titles">
                <span className="app-bar__system">{currentSystem.label}</span>
                <span className="app-bar__title">{currentMenuLabel}</span>
              </div>
            </div>
            {renderScreen()}
            <DrawerNav
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              systems={SYSTEMS}
              activeSystem={system}
              activeMenu={menu}
              onNavigate={handleNavigate}
            />
          </MobileFrame>
          <IndicatorPanel indicators={panelIndicators} tabLabel={panelLabel} />
        </div>
      </div>
    </IndicatorContext.Provider>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  );
}
