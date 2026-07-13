import { useState } from "react";
import MobileFrame from "./components/MobileFrame";
import SegmentedNav from "./components/SegmentedNav";
import Track1Screen from "./screens/Track1Screen";
import Track2Screen from "./screens/Track2Screen";

const MENUS = [
  { key: "track1", label: "실시간 매출 통계" },
  { key: "track2", label: "고객 심층 분석" },
];

export default function App() {
  const [menu, setMenu] = useState("track1");

  return (
    <div className="app">
      <div className="app__intro">
        <h1>사장님앱 통계 메뉴 프로토타입</h1>
        <p>
          더미데이터 기반 6화면 프로토타입입니다. 각 카드에 마우스를 올리거나 탭하면 우측 상단의{" "}
          <span className="app__intro-badge">JSON</span> 배지가 활성화되며, 해당 차트의 원천데이터·산식이
          담긴 지표 설명이 팝업으로 노출됩니다.
        </p>
      </div>
      <MobileFrame>
        <div className="app-bar">
          <span className="app-bar__title">사장님앱 · 통계</span>
        </div>
        <SegmentedNav options={MENUS} active={menu} onChange={setMenu} />
        {menu === "track1" ? <Track1Screen /> : <Track2Screen />}
      </MobileFrame>
    </div>
  );
}
