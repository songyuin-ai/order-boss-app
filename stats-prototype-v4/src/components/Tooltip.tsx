import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  content?: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; bottom: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // 표가 스크롤 컨테이너(overflow) 안에 있어서, 버블을 그 안에 그대로 두면 잘려 보임 —
  // body에 포털로 그리고 트리거 위치를 뷰포트 좌표로 직접 계산해서 붙임
  useEffect(() => {
    if (!open) return;
    const updatePos = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setPos({ left: rect.left, bottom: window.innerHeight - rect.top + 8 });
    };
    updatePos();
    // 스크롤/리사이즈되면 위치가 어긋나므로 닫음 (표 내부 스크롤 포함, capture:true로 모든 상위 스크롤 컨테이너 감지)
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  if (!content) return null;

  return (
    <span className="tooltip">
      <button
        ref={triggerRef}
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
      {open &&
        pos &&
        createPortal(
          <span
            className="tooltip__bubble tooltip__bubble--portal"
            style={{ left: pos.left, bottom: pos.bottom }}
          >
            {content.split("\n").map((line, i) => (
              <span key={i} className="tooltip__line">
                {line}
              </span>
            ))}
          </span>,
          document.body
        )}
    </span>
  );
}
