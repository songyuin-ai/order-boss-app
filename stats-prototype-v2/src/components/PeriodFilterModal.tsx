import { useEffect, useState } from "react";
import type { PeriodSelection } from "../lib/period";
import { MONTH_OPTIONS, recentRangeLabel } from "../lib/period";

interface Props {
  open: boolean;
  value: PeriodSelection;
  onApply: (v: PeriodSelection) => void;
  onClose: () => void;
}

export default function PeriodFilterModal({ open, value, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<PeriodSelection>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  if (!open) return null;

  const monthValue = draft.mode === "monthly" ? draft.month : MONTH_OPTIONS[0].key;

  return (
    <>
      <div className="period-modal-backdrop" onClick={onClose} />
      <div className="period-modal" onClick={(e) => e.stopPropagation()}>
        <div className="period-modal__head">
          <button type="button" className="period-modal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
          <span className="period-modal__title">기간</span>
        </div>

        <div className="period-modal__options">
          <div className="period-option">
            <label className="period-option__radio">
              <input
                type="radio"
                name="period-mode"
                checked={draft.mode === "recent7"}
                onChange={() => setDraft({ mode: "recent7" })}
              />
              <span className="period-option__body">
                <span className="period-option__label">최근 7일</span>
                <span className="period-option__range">{recentRangeLabel(7)}</span>
              </span>
            </label>
          </div>

          <div className="period-option">
            <label className="period-option__radio">
              <input
                type="radio"
                name="period-mode"
                checked={draft.mode === "recent30"}
                onChange={() => setDraft({ mode: "recent30" })}
              />
              <span className="period-option__body">
                <span className="period-option__label">최근 30일</span>
                <span className="period-option__range">{recentRangeLabel(30)}</span>
              </span>
            </label>
          </div>

          <div className="period-option">
            <label className="period-option__radio">
              <input
                type="radio"
                name="period-mode"
                checked={draft.mode === "monthly"}
                onChange={() => setDraft({ mode: "monthly", month: monthValue })}
              />
              <span className="period-option__label">월별 조회</span>
            </label>
            <select
              className="period-option__select"
              value={monthValue}
              onChange={(e) => setDraft({ mode: "monthly", month: e.target.value })}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="period-modal__note">최근 3개월 동안의 내역만 볼 수 있어요.</p>

        <button
          type="button"
          className="period-modal__apply"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
        >
          적용
        </button>
      </div>
    </>
  );
}
