export interface MembershipActivity {
  customerCount: number; // 최근 30일간 적립·사용하며 방문한 유니크 회원 수 (보조 지표, data_034)
  earnOrderCount: number; // 최근 30일 적립 주문건수
  useOrderCount: number; // 최근 30일 사용 주문건수
  orderCount: number; // 최근 30일 적립·사용 주문건수 합계(= earnOrderCount + useOrderCount), KPI 카드 헤드라인(data_033)
  regionAvgOrderCount: number; // 주변매장 평균 적립·사용 주문건수(동일 30일 기준)
}

export interface MembershipSnapshot {
  hValue: { pct: number; regionAvgPct: number };
  activity: MembershipActivity;
}

// regionAvgPct: 주변 동일업종 매장 평균 H값(더미). 포인트 활용 지표는 전기 대비가 아니라 항상 주변매장 평균과 비교
// (v5) 조회기간 탭(지난 주/지난 달) 폐기, "최근 30일" 고정 배치 스냅샷 하나만 사용
// (2차 개정) 고객 라벨링(세그먼트)은 최근 90일 고정이지만, 구매실적성 데이터(회원 수·주문건수 등)는 화면 기본 기준인
// 최근 30일을 따름 — segmentDetailDummy.ts의 90일 totals와는 별개 데이터. 90일 세그먼트 전원(460명) 중
// recGrd 미충족(떠나려는 단골/가끔 오시는 손님) 상당수가 최근 30일 안에는 방문하지 않아 30일 표본이 더 작음
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
