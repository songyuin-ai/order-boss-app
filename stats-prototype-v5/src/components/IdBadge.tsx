import { useContext } from "react";
import { IndicatorContext } from "../context/IndicatorContext";

// inline: 카드 우상단에 절대위치로 붙는 기본 배지 대신, 텍스트 옆에 자연스럽게 흘러가는 배지로 렌더
// (한 카드 안에 지표 ID가 여러 개 붙는 필드 단위 매핑에 사용 — 예: 세그먼트 카드 상세의 5개 필드별 배지)
export default function IdBadge({ id, inline = false }: { id: string; inline?: boolean }) {
  const { activeId, toggle } = useContext(IndicatorContext);
  const isActive = activeId === id;

  return (
    <span
      className={`id-badge${inline ? " id-badge--inline" : ""}${isActive ? " is-active" : ""}`}
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
