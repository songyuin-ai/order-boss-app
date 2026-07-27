import { useState } from "react";
import MobileFrame from "./components/MobileFrame";
import DrawerNav, { type DrawerMenuItem } from "./components/DrawerNav";
import AccountSwitchSheet from "./components/AccountSwitchSheet";
import AddAccountModal from "./components/AddAccountModal";
import PlaceholderScreen from "./components/PlaceholderScreen";
import IndicatorPanel from "./components/IndicatorPanel";
import HomeScreen from "./screens/HomeScreen";
import DateRangeViewScreen from "./screens/DateRangeViewScreen";
import MembershipCustomerAnalysisScreen from "./screens/MembershipCustomerAnalysisScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import LoginScreen from "./screens/LoginScreen";
import { IndicatorContext } from "./context/IndicatorContext";
import { DataProvider } from "./context/DataContext";
import { useRealtimeRevenue } from "./hooks/useRealtimeRevenue";
import type { Indicator } from "./data/types";
import type { StoreAccount } from "./data/accounts";

interface Session {
  accounts: StoreAccount[];
  activeStoreId: string;
}

const MENU: DrawerMenuItem[] = [
  { key: "home", label: "홈" },
  { key: "orderManagement", label: "주문관리" },
  { key: "productManagement", label: "상품관리(품절처리)" },
  {
    key: "settlement",
    label: "정산",
    children: [
      { key: "settlement-order", label: "오더 정산내역" },
      { key: "settlement-vat", label: "오더 부가세신고자료" },
      { key: "settlement-happycon", label: "해피콘 정산내역" },
      { key: "settlement-happycon-vat", label: "해피콘 부가세신고자료" },
    ],
  },
  {
    key: "salesCustomerAnalysis",
    label: "우리매장 매출/고객분석",
    children: [
      { key: "membership", label: "멤버십 고객 분석" },
      { key: "deliveryCustomer", label: "딜리버리 고객 분석" },
    ],
  },
  { key: "storeManagement", label: "매장관리" },
  {
    key: "marketing",
    label: "우리매장 마케팅",
    children: [
      { key: "coupon", label: "우리매장 쿠폰" },
      { key: "pushBenefit", label: "우리매장 혜택 알림(푸시발송)" },
    ],
  },
  { key: "notice", label: "공지사항" },
  { key: "settings", label: "설정" },
];

// 드로어 메뉴에는 없지만 홈에서 드릴다운으로 진입하는 화면들의 타이틀
const DRILLDOWN_LABELS: Record<string, string> = {
  dateRangeView: "날짜별 보기",
};

function findLabel(items: DrawerMenuItem[], key: string): string {
  for (const item of items) {
    if (item.key === key) return item.label;
    const child = item.children?.find((c) => c.key === key);
    if (child) return child.label;
  }
  return DRILLDOWN_LABELS[key] ?? "";
}

function AppShell({ session, setSession }: { session: Session; setSession: (session: Session) => void }) {
  const [menu, setMenu] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelIndicators, setPanelIndicators] = useState<Indicator[]>([]);
  const [panelLabel, setPanelLabel] = useState("");
  const revenueByStoreId = useRealtimeRevenue();

  const toggle = (id: string) => setActiveId((prev) => (prev === id ? null : id));
  const clear = () => setActiveId(null);

  const handlePanelChange = (indicators: Indicator[], label: string) => {
    setPanelIndicators(indicators);
    setPanelLabel(label);
  };

  const navigateTo = (key: string) => {
    setMenu(key);
    setDrawerOpen(false);
    setPanelIndicators([]);
    setPanelLabel("");
    clear();
  };

  const currentStore = session.accounts.find((s) => s.id === session.activeStoreId) ?? session.accounts[0];
  const currentMenuLabel = findLabel(MENU, menu);

  const renderScreen = () => {
    switch (menu) {
      case "home":
        return <HomeScreen onPanelChange={handlePanelChange} onNavigate={navigateTo} />;
      case "dateRangeView":
        return <DateRangeViewScreen onPanelChange={handlePanelChange} onNavigate={navigateTo} />;
      case "membership":
        return <MembershipCustomerAnalysisScreen onPanelChange={handlePanelChange} storeName={currentStore.name} />;
      case "deliveryCustomer":
        return <DeliveryScreen onPanelChange={handlePanelChange} />;
      default:
        return <PlaceholderScreen title={currentMenuLabel} />;
    }
  };

  return (
    <IndicatorContext.Provider value={{ activeId, toggle, clear }}>
      <div className="app">
        <div className="app__intro">
          <h1>사장님앱 통계 프로토타입 v3</h1>
          <p>
            좌측 상단 메뉴 버튼으로 전체 메뉴(9개)를 열 수 있습니다. 홈에서 드릴다운 카드로도 멤버십/딜리버리 고객
            분석에 바로 들어갈 수 있습니다. 각 차트의 식별자(예: <b>data_001</b>)를 클릭하면 우측 지표 표에서 해당
            행이 강조됩니다.
          </p>
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
                <span className="app-bar__system">{currentStore.name}</span>
                <span className="app-bar__title">{currentMenuLabel}</span>
              </div>
              <button
                type="button"
                className="iconbtn"
                aria-label="계정 전환"
                onClick={(e) => {
                  e.stopPropagation();
                  setSheetOpen(true);
                }}
              >
                👤
              </button>
            </div>
            {renderScreen()}
            <DrawerNav
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              items={MENU}
              activeKey={menu}
              onNavigate={navigateTo}
            />
            <AccountSwitchSheet
              open={sheetOpen}
              currentStoreId={session.activeStoreId}
              accounts={session.accounts}
              revenueByStoreId={revenueByStoreId}
              onClose={() => setSheetOpen(false)}
              onSwitch={(id) => {
                setSession({ ...session, activeStoreId: id });
                setSheetOpen(false);
              }}
              onAddAccount={() => {
                setSheetOpen(false);
                setAddAccountOpen(true);
              }}
            />
            <AddAccountModal
              open={addAccountOpen}
              onClose={() => setAddAccountOpen(false)}
              onAdded={(store) => {
                setSession({ ...session, accounts: [...session.accounts, store] });
              }}
            />
          </MobileFrame>
          <IndicatorPanel indicators={panelIndicators} tabLabel={panelLabel} />
        </div>
      </div>
    </IndicatorContext.Provider>
  );
}

function AppRoot() {
  const [session, setSession] = useState<Session | null>(null);

  if (!session) {
    return (
      <div className="app">
        <div className="app__intro">
          <h1>사장님앱 통계 프로토타입 v3</h1>
          <p>매장 계정으로 로그인해주세요. 계정은 가입이 아니라 본사에서 매장당 1개씩 발급합니다.</p>
        </div>
        <div className="layout">
          <MobileFrame>
            <LoginScreen onSuccess={(store) => setSession({ accounts: [store], activeStoreId: store.id })} />
          </MobileFrame>
        </div>
      </div>
    );
  }

  return <AppShell session={session} setSession={setSession} />;
}

export default function App() {
  return (
    <DataProvider>
      <AppRoot />
    </DataProvider>
  );
}
