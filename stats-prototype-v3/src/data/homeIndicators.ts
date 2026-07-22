import type { Indicator } from "./types";
import { posIndicators } from "./posIndicators";

// 홈(사장님앱 통합 메인화면). 매출/건수/객단가/온오프라인은 POS 지표(data_023/024/027/028)를 그대로 재사용
export const homeIndicators: Record<string, Indicator> = {
  revenue: posIndicators.totalRevenue,
  orders: posIndicators.totalOrders,
  aov: posIndicators.aov,
  onlineOffline: posIndicators.onlineOffline,
  live: {
    id: "data_033",
    지표명: "실시간 매출·건수",
    정의: "일간 탭 · 오늘 기준, 지금까지 진행 중인 누적 매출/건수",
    원천데이터_및_산식: "당일 주문 실시간 SUM/COUNT (자정부터 현재까지)",
    제공목적: "당일 영업 현황 실시간 파악",
    차트형태: "KPI 카드 (LIVE 표시, 일간 탭의 오늘 기준에서만 노출)",
  },
  weekday: {
    id: "data_034",
    지표명: "요일별 매출 (홈)",
    정의: "선택 탭(일간/주간/월간) 기준 요일별 매출 분포",
    원천데이터_및_산식: "주문일시 요일 추출 GROUP BY, POS 전체 매출 기준",
    제공목적: "요일 패턴 파악",
    차트형태: "요일별 막대차트 (월~일 7개, 오늘은 강조색)",
  },
  channelRevenue: {
    id: "data_035",
    지표명: "채널별 매출 (홈, POS 기준)",
    정의: "오프라인 매장 + 배달앱 채널별 매출 breakdown, 선택 탭 기준",
    원천데이터_및_산식: "POS 매출 중 오프라인/온라인 구분 후, 온라인은 채널 필드로 세분화",
    제공목적: "채널별 성과 비교",
    차트형태: "세로 막대차트 (오프라인 포함 6개 채널, 투명도 단계 적용)",
  },
};
