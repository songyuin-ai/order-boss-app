interface Row {
  segment: string;
  revenueShare: number;
  aov: number;
}

export default function SegmentTable({ rows }: { rows: Row[] }) {
  return (
    <table className="segment-table">
      <thead>
        <tr>
          <th>세그먼트</th>
          <th>매출비중</th>
          <th>객단가</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.segment}>
            <td>{r.segment}</td>
            <td>{r.revenueShare}%</td>
            <td>{r.aov.toLocaleString("ko-KR")}원</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
