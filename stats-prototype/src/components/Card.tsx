import type { ReactNode } from "react";
import type { Indicator } from "../data/types";
import IndicatorHover from "./IndicatorHover";

interface Props {
  title?: string;
  indicator: Indicator;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

export default function Card({ title, indicator, children, tone = "light", className = "" }: Props) {
  return (
    <IndicatorHover indicator={indicator} className={`card card--${tone} ${className}`}>
      {title && <div className="card__title">{title}</div>}
      <div className="card__body">{children}</div>
    </IndicatorHover>
  );
}
