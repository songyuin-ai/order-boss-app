interface Option {
  key: string;
  label: string;
}

interface Props {
  options: Option[];
  active: string;
  onChange: (key: string) => void;
  size?: "md" | "sm";
}

export default function SegmentedNav({ options, active, onChange, size = "md" }: Props) {
  return (
    <div className={`segmented segmented--${size}`}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={`segmented__btn${active === opt.key ? " is-active" : ""}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
