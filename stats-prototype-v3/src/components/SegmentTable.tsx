interface Row {
  segment: string;
  contributionPct: number;
}

export default function SegmentTable({ rows }: { rows: Row[] }) {
  return (
    <table className="segment-table">
      <thead>
        <tr>
          <th>세그먼트</th>
          <th>POS 대비 매출 기여도</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.segment}>
            <td>{r.segment}</td>
            <td>{r.contributionPct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
