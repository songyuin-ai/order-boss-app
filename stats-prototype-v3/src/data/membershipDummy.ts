export interface MembershipPeriodData {
  hValue: { pct: number; regionAvgPct: number };
}

// regionAvgPct: 주변 동일업종 매장 평균 H값(더미). 포인트 활용 지표는 전기 대비가 아니라 항상 주변매장 평균과 비교
// 기간 필터(최근 7일 / 최근 30일 / 월별, 최근 3개월)별 스냅샷
export const byPeriod: Record<string, MembershipPeriodData> = {
  recent7: { hValue: { pct: 132, regionAvgPct: 118 } },
  recent30: { hValue: { pct: 128, regionAvgPct: 121 } },
  "2026-07": { hValue: { pct: 130, regionAvgPct: 122 } },
  "2026-06": { hValue: { pct: 126, regionAvgPct: 129 } },
  "2026-05": { hValue: { pct: 128, regionAvgPct: 124 } },
};
