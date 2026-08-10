interface Props {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export default function DateNav({ label, onPrev, onNext, canPrev, canNext }: Props) {
  return (
    <div className="date-nav">
      <button type="button" className="date-nav__btn" onClick={onPrev} disabled={!canPrev} aria-label="이전 기간">
        ‹
      </button>
      <span className="date-nav__label">{label}</span>
      <button type="button" className="date-nav__btn" onClick={onNext} disabled={!canNext} aria-label="다음 기간">
        ›
      </button>
    </div>
  );
}
