import { useState, type ReactNode } from "react";
import type { Indicator } from "../data/types";

interface Props {
  indicator: Indicator;
  children: ReactNode;
  className?: string;
}

export default function IndicatorHover({ indicator, children, className = "" }: Props) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`ind-hover ${className}`}
      onClick={() => setActive((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-label={`${indicator.지표명} 지표 설명 보기`}
    >
      {children}
      <span className="ind-hover__badge">JSON</span>
      <div className={`ind-hover__overlay${active ? " is-active" : ""}`}>
        <div className="ind-hover__hint">탭하여 닫기</div>
        <pre className="ind-hover__json">{JSON.stringify(indicator, null, 2)}</pre>
      </div>
    </div>
  );
}
