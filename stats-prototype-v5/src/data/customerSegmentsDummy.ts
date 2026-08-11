// (v5, 세그먼트 전면 재설계) recGrd×ordFre 4분면 체계를 폐기하고, 사장님이 CRM 용도로 바로 활용할 수 있는
// 6개의 독립 그룹으로 교체. 그룹끼리 서로 겹칠 수 있음(예: "많이 쓰시는 손님"이면서 "배달 자주 쓰시는 손님"일 수 있음)
// — 상호 배타적 파티션이 아니므로 비율(%)이 아니라 인원수만 노출
export type SegmentKey =
  | "steady"
  | "recentFrequent"
  | "newCustomer"
  | "bigSpender"
  | "deliveryFrequent"
  | "churned";

export interface TopProduct {
  name: string;
  pct: number;
}

export interface CustomerSegmentInfo {
  key: SegmentKey;
  label: string;
  color: string;
  count: number;
  desc: string; // 고정 문구 — 특정 손님 개인이 아니라 분류된 집단이라는 점을 "묶은 그룹" 표현으로 명시
  periodNote: string; // 상세 지표(매출 기여도 등)의 관측 기간 프레이밍. "발길 끊긴 손님"은 반드시 명확한 기간(31~60일)으로 표기
  revenueSharePct: number;
  topProducts: TopProduct[]; // "많이 주문한 메뉴" TOP3 (구 "인기 메뉴" — 발길 끊긴 손님 등 비활성 그룹에도 어울리는 워딩으로 통일)
  peakHour: string;
  demographicTop: string;
  cta: string;
}

// 그룹 판정 기준 원문 (data_028 참고 필드 및 안내 바텀시트에 재사용)
export const SEGMENT_EXPLAIN: Record<SegmentKey, string> = {
  steady: "최근 30일과 그 이전 30일(31~60일 전) 모두 3번 이상 주문한 손님이에요.",
  recentFrequent: "최근 30일 동안 3번 이상 주문한 손님이에요.",
  newCustomer: "최근 30일 안에 처음 주문했고, 그 이전 30일(31~60일 전)엔 주문 이력이 없는 손님이에요.",
  bigSpender: "최근 30일 객단가가 5만원 이상인 손님이에요. (매장 상위 20% 수준으로 브랜드별 보정)",
  deliveryFrequent: "최근 30일과 그 이전 30일(31~60일 전) 모두 배달로 3번 이상 주문한 손님이에요.",
  churned: "최근 30일엔 주문이 없지만, 그 이전 30일(31~60일 전)엔 주문한 적 있는 손님이에요.",
};

// 노출 순서는 반드시 이 배열 순서를 따름(작업계획서 4-B-4) — 꾸준히→최근들어→신규→많이쓰는→배달자주→발길끊긴
export const CUSTOMER_SEGMENTS: CustomerSegmentInfo[] = [
  {
    key: "steady",
    label: "꾸준히 자주 오시는 손님",
    color: "#2a78d6",
    count: 128,
    desc: "최근 두 달 동안 꾸준히 자주 찾아주시는 손님들을 묶은 그룹이에요.",
    periodNote: "최근 30일 기준",
    revenueSharePct: 38,
    topProducts: [
      { name: "아메리카노", pct: 32 },
      { name: "티라미수", pct: 21 },
      { name: "초코케이크", pct: 17 },
    ],
    peakHour: "오후 2~4시",
    demographicTop: "30대 여성",
    cta: "감사 쿠폰 발송",
  },
  {
    key: "recentFrequent",
    label: "최근 들어 자주 오는 손님",
    color: "#1baf7a",
    count: 54,
    desc: "최근 들어 방문이 부쩍 늘어난 손님들을 묶은 그룹이에요.",
    periodNote: "최근 30일 기준",
    revenueSharePct: 14,
    topProducts: [
      { name: "딸기빙수", pct: 27 },
      { name: "초코케이크", pct: 20 },
      { name: "아메리카노", pct: 18 },
    ],
    peakHour: "오후 5~7시",
    demographicTop: "20대 여성",
    cta: "다음 방문 쿠폰(적립 2배) 발송",
  },
  {
    key: "newCustomer",
    label: "신규 손님",
    color: "#8b5cf6",
    count: 37,
    desc: "최근 30일 안에 처음 방문하신 손님들을 묶은 그룹이에요.",
    periodNote: "최근 30일 기준",
    revenueSharePct: 8,
    topProducts: [
      { name: "아메리카노", pct: 30 },
      { name: "크루아상", pct: 19 },
      { name: "카페라떼", pct: 15 },
    ],
    peakHour: "오전 11~1시",
    demographicTop: "20대 남녀",
    cta: "환영 쿠폰 발송",
  },
  {
    key: "bigSpender",
    label: "많이 쓰시는 손님",
    color: "#eda100",
    count: 41,
    desc: "한 번 올 때 많이 써주시는 손님들을 묶은 그룹이에요.",
    periodNote: "최근 30일 기준",
    revenueSharePct: 22,
    topProducts: [
      { name: "스페셜 디저트 세트", pct: 35 },
      { name: "티라미수", pct: 24 },
      { name: "콜드브루", pct: 16 },
    ],
    peakHour: "오후 3~5시",
    demographicTop: "40대 여성",
    cta: "VIP 혜택 안내",
  },
  {
    key: "deliveryFrequent",
    label: "배달 자주 쓰시는 손님",
    color: "#0ea5e9",
    count: 73,
    desc: "배달로 꾸준히 자주 주문하시는 손님들을 묶은 그룹이에요.",
    periodNote: "최근 30일 기준 · 배달 채널 한정",
    revenueSharePct: 17,
    topProducts: [
      { name: "초코케이크", pct: 26 },
      { name: "아메리카노", pct: 22 },
      { name: "마카롱 세트", pct: 18 },
    ],
    peakHour: "저녁 6~9시",
    demographicTop: "30대 여성",
    cta: "배달 전용 쿠폰 발송",
  },
  {
    key: "churned",
    label: "발길 끊긴 손님",
    color: "#e63946",
    count: 62,
    desc: "예전엔 오셨는데 최근 발걸음이 끊긴 손님들을 묶은 그룹이에요.",
    // 사용자 요청: "과거 활동 기준"처럼 모호하게 두지 말고 명확한 기간 형식으로 표기
    periodNote: "최근 31~60일 기준 (발길 끊기기 전 활동)",
    revenueSharePct: 11,
    topProducts: [
      { name: "카페라떼", pct: 29 },
      { name: "티라미수", pct: 19 },
      { name: "초코케이크", pct: 16 },
    ],
    peakHour: "오전 11~1시",
    demographicTop: "30대 여성",
    cta: "컴백 쿠폰 발송",
  },
];
