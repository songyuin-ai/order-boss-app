import { useContext } from "react";
import { IndicatorContext } from "../context/IndicatorContext";

export default function IdBadge({ id }: { id: string }) {
  const { activeId, toggle } = useContext(IndicatorContext);
  const isActive = activeId === id;

  return (
    <span
      className={`id-badge${isActive ? " is-active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        toggle(id);
      }}
      role="button"
      tabIndex={0}
    >
      {id}
    </span>
  );
}
