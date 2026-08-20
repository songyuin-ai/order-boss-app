export function formatWon(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatCompactWon(value: number): string {
  if (Math.abs(value) >= 10000) {
    const man = value / 10000;
    const rounded = Math.round(man * 10) / 10;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}만원`;
  }
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatSignedNumber(value: number, unit: string): string {
  if (value > 0) return `+${value}${unit}`;
  if (value < 0) return `${value}${unit}`;
  return `±0${unit}`;
}
