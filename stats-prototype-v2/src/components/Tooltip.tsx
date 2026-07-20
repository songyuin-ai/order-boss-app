import { useState, type ReactNode } from "react";

interface Props {
  content?: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  const [open, setOpen] = useState(false);

  if (!content) return null;

  return (
    <span className="tooltip">
      <button
        type="button"
        className="tooltip__trigger"
        aria-label="설명 보기"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {children}
      </button>
      {open && (
        <span className="tooltip__bubble">
          {content.split("\n").map((line, i) => (
            <span key={i} className="tooltip__line">
              {line}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
