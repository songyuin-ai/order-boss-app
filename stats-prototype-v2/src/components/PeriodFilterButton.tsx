import type { PeriodSelection } from "../lib/period";
import { periodDefLabel } from "../lib/period";

interface Props {
  value: PeriodSelection;
  onClick: () => void;
}

export default function PeriodFilterButton({ value, onClick }: Props) {
  return (
    <button type="button" className="period-trigger" onClick={onClick}>
      <span className="period-trigger__label">{periodDefLabel(value)}</span>
      <span className="period-trigger__chevron">▾</span>
    </button>
  );
}
