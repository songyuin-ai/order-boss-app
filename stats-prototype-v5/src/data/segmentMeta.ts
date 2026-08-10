import type { SegmentDetailSnapshot, SegmentKey } from "./segmentDetailDummy";

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

// 세그먼트_기준_변경안.md 4-2절 "유도할 액션 (문구)" 표를 그대로 따름.
// 고마운 단골/떠나려는 단골은 문구 안에 실제 수치(매출 비중·경과일)가 들어가야 해서 데이터 기반으로 생성
export function getSegmentCopy(segment: SegmentKey, data: SegmentDetailSnapshot): string {
  switch (segment) {
    case "realRegular":
      return `우리 가게 매출의 ${data.realRegular.salesSharePct}%를 만들어주는 든든한 손님들이에요. 감사 쿠폰으로 마음 전해보세요.`;
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
