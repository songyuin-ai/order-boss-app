import { useState } from "react";
import MobileFrame from "./components/MobileFrame";
import SegmentedNav from "./components/SegmentedNav";
import IndicatorPanel from "./components/IndicatorPanel";
import Track1Screen from "./screens/Track1Screen";
import Track2Screen from "./screens/Track2Screen";
import { IndicatorContext } from "./context/IndicatorContext";
import { DataProvider, useAppData } from "./context/DataContext";
import type { Indicator } from "./data/types";

const MENUS = [
  { key: "track1", label: "실시간 매출 통계" },
  { key: "track2", label: "고객 심층 분석" },
];

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
  const [menu, setMenu] = useState("track1");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelIndicators, setPanelIndicators] = useState<Indicator[]>([]);
  const [panelLabel, setPanelLabel] = useState("");

  const toggle = (id: string) => setActiveId((prev) => (prev === id ? null : id));
  const clear = () => setActiveId(null);

  const handleMenuChange = (key: string) => {
    setMenu(key);
    clear();
  };

  return (
    <IndicatorContext.Provider value={{ activeId, toggle, clear }}>
      <div className="app">
        <div className="app__intro">
          <h1>사장님앱 통계 메뉴 프로토타입</h1>
          <p>
            더미데이터 기반 6화면 프로토타입입니다. 각 차트의 식별자(예: <b>data_001</b>)를 클릭하면
            우측 지표 표에서 해당 행이 강조되고 나머지는 흐려집니다.
          </p>
          <DataStatusBadge />
        </div>
        <div className="layout" onClick={clear}>
          <MobileFrame>
            <div className="app-bar">
              <span className="app-bar__title">사장님앱 · 통계</span>
            </div>
            <SegmentedNav options={MENUS} active={menu} onChange={handleMenuChange} />
            {menu === "track1" ? (
              <Track1Screen
                onPanelChange={(indicators, label) => {
                  setPanelIndicators(indicators);
                  setPanelLabel(label);
                }}
              />
            ) : (
              <Track2Screen
                onPanelChange={(indicators, label) => {
                  setPanelIndicators(indicators);
                  setPanelLabel(label);
                }}
              />
            )}
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
