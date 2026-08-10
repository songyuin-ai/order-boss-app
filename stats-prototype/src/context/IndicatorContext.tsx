import { createContext } from "react";

export interface IndicatorCtx {
  activeId: string | null;
  toggle: (id: string) => void;
  clear: () => void;
}

export const IndicatorContext = createContext<IndicatorCtx>({
  activeId: null,
  toggle: () => {},
  clear: () => {},
});
