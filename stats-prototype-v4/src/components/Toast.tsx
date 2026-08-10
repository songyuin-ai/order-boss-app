import { useEffect } from "react";

interface Props {
  message: string | null;
  onDismiss: () => void;
}

const DISPLAY_MS = 2500;

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  );
}
