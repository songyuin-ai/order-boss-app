import type { SegmentKey } from "./segmentDetailDummy";

// 세그먼트_기준_변경안.md 4-2절 기준
export const SEGMENT_TABS: { key: SegmentKey; label: string }[] = [
  { key: "realRegular", label: "찐단골" },
  { key: "leavingRegular", label: "떠나려는 단골" },
  { key: "candidate", label: "단골 후보 손님" },
  { key: "occasional", label: "가끔 오시는 손님" },
];

export const SEGMENT_COPY: Record<SegmentKey, string> = {
  realRegular: "매출의 큰 비중을 만들어주는 든든한 손님들이에요.",
  leavingRegular: "예전엔 자주 오셨는데, 최근 발걸음이 뜸해지고 있어요.",
  candidate: "최근 들어 자주 오기 시작한 손님들이에요. 한 번 더 오시면 찐단골이 될 가능성이 높아요.",
  occasional: "가끔 들르는 손님들이에요. 큰 액션보다는 지켜봐도 괜찮아요.",
};

// 세그먼트별 고정 CTA 문구 (기본). "가끔 오시는 손님"은 기본 CTA 없음
export const SEGMENT_CTA: Partial<Record<SegmentKey, string>> = {
  realRegular: "감사 쿠폰 발송",
  leavingRegular: "컴백 쿠폰 발송",
  candidate: "다음 방문 쿠폰(적립 2배) 발송",
};

// 객단가(avgOrd) 필터 ON일 때만 대체되는 CTA 문구
export const SEGMENT_CTA_FILTERED: Partial<Record<SegmentKey, string>> = {
  occasional: "가끔 오시지만 올 때마다 크게 써주시는 손님들이에요. 놓치면 아까워요.",
};
