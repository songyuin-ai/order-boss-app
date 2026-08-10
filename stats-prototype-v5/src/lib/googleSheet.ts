import { SHEET_ID } from "../config";

export type SheetRow = Record<string, string>;

interface GvizCell {
  v: string | number | boolean | null;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

interface GvizCol {
  label: string;
  id: string;
}

interface GvizResponse {
  table: {
    cols: GvizCol[];
    rows: GvizRow[];
  };
}

function parseGvizResponse(text: string): GvizResponse {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return JSON.parse(text.slice(start, end + 1));
}

export async function fetchSheetTab(tabName: string): Promise<SheetRow[]> {
  if (!SHEET_ID) {
    throw new Error("SHEET_ID가 설정되지 않았습니다 (src/config.ts)");
  }
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`시트 탭 "${tabName}" 응답 실패 (${res.status})`);
  }
  const text = await res.text();
  const json = parseGvizResponse(text);
  const cols = json.table.cols.map((c) => c.label || c.id);

  return json.table.rows.map((row) => {
    const obj: SheetRow = {};
    cols.forEach((colName, i) => {
      const cell = row.c[i];
      obj[colName] = cell && cell.v !== null && cell.v !== undefined ? String(cell.v) : "";
    });
    return obj;
  });
}

export function num(row: SheetRow, key: string, fallback = 0): number {
  const raw = row[key];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isNaN(n) ? fallback : n;
}

export function numOrNull(row: SheetRow, key: string): number | null {
  const raw = row[key];
  if (raw === undefined || raw === "") return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export function bool(row: SheetRow, key: string): boolean {
  return String(row[key]).trim().toUpperCase() === "TRUE";
}

export function str(row: SheetRow, key: string, fallback = ""): string {
  return row[key] !== undefined && row[key] !== "" ? row[key] : fallback;
}

// 시트 작성자가 컬럼명을 살짝 다르게 적어도(예: "노출" vs "노출시트") 인식되도록
// 후보 헤더명을 순서대로 시도
export function strAny(row: SheetRow, keys: string[], fallback = ""): string {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== "") return row[key];
  }
  return fallback;
}
