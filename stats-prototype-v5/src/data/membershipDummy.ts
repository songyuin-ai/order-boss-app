export interface MembershipActivity {
  customerCount: number; // 최근 30일간 적립·사용하며 방문한 유니크 회원 수 (지표 ID 없는 참고용 서술 텍스트 — "멤버십 손님 수" 지표는 폐기)
  earnOrderCount: number; // 최근 30일 적립 주문건수
  useOrderCount: number; // 최근 30일 사용 주문건수
  orderCount: number; // 최근 30일 적립·사용 주문건수 합계(= earnOrderCount + useOrderCount), KPI 카드 헤드라인(data_027)
  regionAvgOrderCount: number; // 주변매장 평균 적립·사용 주문건수(동일 30일 기준)
}

export interface MembershipSnapshot {
  hValue: { pct: number; regionAvgPct: number };
  activity: MembershipActivity;
}

// regionAvgPct: 주변 동일업종 매장 평균 H값(더미). 포인트 활용 지표는 전기 대비가 아니라 항상 주변매장 평균과 비교
// (v5) 조회기간 탭(지난 주/지난 달) 폐기, "최근 30일" 고정 배치 스냅샷 하나만 사용
// (세그먼트 전면 재설계 이후) 손님 그룹(customerSegmentsDummy.ts)도 이제 최근 30일(및 그 이전 30일) 기준이라
// 이 화면 전체가 하나의 "최근 30일" 관측 기간을 공유함 — 더 이상 별도 90일 관측 기간 예외 없음
export const membership: MembershipSnapshot = {
  hValue: { pct: 126, regionAvgPct: 129 },
  activity: {
    customerCount: 205,
    earnOrderCount: 250,
    useOrderCount: 80,
    orderCount: 330,
    regionAvgOrderCount: 370,
  },
};
