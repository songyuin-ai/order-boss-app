import type { SegmentKey } from "./segmentDetailDummy";

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

// 세그먼트_기준_변경안.md 4-2절 "유도할 액션 (문구)" 표 기반이나, 원문의 "OO번/OO만원/OO일째" 같은 실제 수치
// 삽입은 쓰지 않는다 — 이 수치는 세그먼트 소속 손님들의 평균값인데, 문장에 끼워 넣으면 마치 특정 손님 한 명의
// 개인 프로필처럼 읽혀 착각을 유발한다. 그래서 무조건 고정 문구로 두고, "OO 기준으로 분류된 손님 집단"이라는
// 점이 드러나도록 "묶은 그룹" 표현을 공통으로 사용한다 (작업계획서_v5 4-5절 "세그먼트 문구 작성 원칙" 참고)
export const SEGMENT_COPY: Record<SegmentKey, string> = {
  realRegular: "최근 90일 동안 자주, 많이 찾아주시는 손님들을 묶은 그룹이에요. 감사 쿠폰으로 마음을 전해보세요.",
  candidate: "최근 들어 방문이 잦아지기 시작한 손님들을 묶은 그룹이에요. 한 번 더 오시면 고마운 단골이 될 가능성이 높아요.",
  leavingRegular: "예전엔 자주 오셨지만, 최근 발걸음이 뜸해진 손님들을 묶은 그룹이에요. 지금 쿠폰 하나 보내면 다시 붙잡을 수 있어요.",
  occasional: "가끔 들르는 손님들을 묶은 그룹이에요. 큰 액션보다는 지켜봐도 괜찮아요.",
};

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
