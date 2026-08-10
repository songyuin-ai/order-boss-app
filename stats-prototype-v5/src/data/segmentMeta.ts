import type { SegmentDetailSnapshot, SegmentKey } from "./segmentDetailDummy";
import { formatCompactWon } from "../utils/format";

// 세그먼트_기준_변경안.md 4-2절 기준. 화면 노출 순서: 고마운 단골 → 단골 후보 손님 → 떠나려는 단골 → 가끔 오시는 손님
export const SEGMENT_TABS: { key: SegmentKey; label: string }[] = [
  { key: "realRegular", label: "고마운 단골" },
  { key: "candidate", label: "단골 후보 손님" },
  { key: "leavingRegular", label: "떠나려는 단골" },
  { key: "occasional", label: "가끔 오시는 손님" },
];

// 세그먼트 비율차트 · 상세분석 그룹명 헤더가 같은 색을 공유해 두 영역이 하나로 이어져 보이게 함
export const SEGMENT_COLORS: Record<SegmentKey, string> = {
  realRegular: "#2a78d6",
  candidate: "#1baf7a",
  leavingRegular: "#eda100",
  occasional: "#8a94a6",
};

// 세그먼트_기준_변경안.md 4-2절 "유도할 액션 (문구)" 표를 그대로 따름 (2차 개정: 매출 비중% → 방문횟수·총소비액 절대값).
// 고마운 단골/떠나려는 단골은 문구 안에 실제 수치(방문횟수·총소비액·경과일)가 들어가야 해서 데이터 기반으로 생성
export function getSegmentCopy(segment: SegmentKey, data: SegmentDetailSnapshot): string {
  switch (segment) {
    case "realRegular":
      return `최근 90일간 ${data.realRegular.visitCount}번이나 찾아주시고, 총 ${formatCompactWon(
        data.realRegular.totalSpend
      )}을 써주신 든든한 손님들이에요. 감사 쿠폰으로 마음 전해보세요.`;
    case "leavingRegular":
      return `예전엔 자주 오셨는데, 최근 ${data.leavingRegular.lastVisitDaysAgo}일째 안 오고 계세요. 지금 쿠폰 하나 보내면 다시 붙잡을 수 있어요.`;
    case "candidate":
      return "최근 들어 자주 오기 시작한 손님들이에요. 한 번 더 오시면 고마운 단골이 될 가능성이 높아요.";
    case "occasional":
      return "가끔 들르는 손님들이에요. 큰 액션보다는 지켜봐도 괜찮아요.";
  }
}

// 세그먼트별 고정 CTA 문구 (기본). "가끔 오시는 손님"은 기본 CTA 없음
export const SEGMENT_CTA: Partial<Record<SegmentKey, string>> = {
  realRegular: "감사 쿠폰 발송",
  leavingRegular: "컴백 쿠폰 발송",
  candidate: "다음 방문 쿠폰(적립 2배) 발송",
};

// "떠나려는 단골"은 표에서 "최우선 CTA"로 명시된 대상 — 다른 세그먼트보다 강조된 스타일로 노출
export const SEGMENT_CTA_PRIORITY: Partial<Record<SegmentKey, boolean>> = {
  leavingRegular: true,
};

// 객단가(avgOrd) 필터 ON일 때만 대체되는 CTA 문구
export const SEGMENT_CTA_FILTERED: Partial<Record<SegmentKey, string>> = {
  occasional: "가끔 오시지만 올 때마다 크게 써주시는 손님들이에요. 놓치면 아까워요.",
};

// "손님 그룹은 어떤 기준으로 구분하나요?" 안내 바텀시트용 — recGrd/ordFre 같은 내부 코드 대신
// 사장님이 바로 이해할 수 있게 그룹명 + 실제 기준(횟수·일수)을 한 문장에 바로 풀어 씀
export const SEGMENT_EXPLAIN: Record<SegmentKey, string> = {
  realRegular: "최근 90일 동안 4번 이상 오시고, 21일 이내에도 오신 손님이에요.",
  candidate: "최근 90일 동안 4번 미만 오셨지만, 21일 이내에는 오신 손님이에요.",
  leavingRegular: "최근 90일 동안 4번 이상 오셨지만, 최근 21일 동안은 안 오신 손님이에요.",
  occasional: "최근 90일 동안 4번 미만 오시고, 최근 21일 동안도 안 오신 손님이에요.",
};
