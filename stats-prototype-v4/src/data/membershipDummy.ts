export interface MembershipPeriodData {
  hValue: { pct: number; regionAvgPct: number };
}

// regionAvgPct: 주변 동일업종 매장 평균 H값(더미). 포인트 활용 지표는 전기 대비가 아니라 항상 주변매장 평균과 비교
// 기간 탭(지난 주 / 지난 달, 고정 스냅샷)별 데이터. 배치 잡이 마감된 주/월에 대해 한 번만 계산해두는 값이라 가정
export const byPeriod: Record<string, MembershipPeriodData> = {
  lastWeek: { hValue: { pct: 132, regionAvgPct: 118 } },
  lastMonth: { hValue: { pct: 126, regionAvgPct: 129 } },
};
