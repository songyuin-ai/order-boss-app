import { useState } from "react";
import SegmentedNav from "../components/SegmentedNav";
import PeriodFilterButton from "../components/PeriodFilterButton";
import PeriodFilterModal from "../components/PeriodFilterModal";
import PosScreen from "./PosScreen";
import CustomerCompositionScreen from "./CustomerCompositionScreen";
import CustomerDetailScreen from "./CustomerDetailScreen";
import MembershipScreen from "./MembershipScreen";
import { DEFAULT_PERIOD, type PeriodSelection } from "../lib/period";
import type { Indicator } from "../data/types";

const TABS = [
  { key: "pos", label: "POS 상세" },
  { key: "composition", label: "고객 구성" },
  { key: "detail", label: "고객 상세분석" },
  { key: "membership", label: "멤버십 가치" },
];

interface Props {
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function MembershipCustomerAnalysisScreen({ onPanelChange }: Props) {
  const [tab, setTab] = useState("pos");
  const [period, setPeriod] = useState<PeriodSelection>(DEFAULT_PERIOD);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);

  return (
    <div className="screen">
      <SegmentedNav options={TABS} active={tab} onChange={setTab} size="sm" />
      {tab !== "pos" && (
        <div className="screen__period-bar">
          <PeriodFilterButton value={period} onClick={() => setPeriodModalOpen(true)} />
        </div>
      )}
      {tab === "pos" && <PosScreen onPanelChange={onPanelChange} />}
      {tab === "composition" && <CustomerCompositionScreen period={period} onPanelChange={onPanelChange} />}
      {tab === "detail" && <CustomerDetailScreen period={period} onPanelChange={onPanelChange} />}
      {tab === "membership" && <MembershipScreen period={period} onPanelChange={onPanelChange} />}
      <PeriodFilterModal
        open={periodModalOpen}
        value={period}
        onApply={setPeriod}
        onClose={() => setPeriodModalOpen(false)}
      />
    </div>
  );
}
