import type { ReactNode } from "react";

export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-frame">
      <div className="mobile-frame__notch" />
      <div className="mobile-frame__screen">{children}</div>
    </div>
  );
}
