# 사장님앱 통계 메뉴 프로토타입

`작업계획서_사장님앱_통계_프로토타입.md` 기준으로 만든 더미데이터 기반 클릭 프로토타입입니다.
데이터서비스팀·서비스개발팀과의 파이프라인 설계 미팅용 시각 자료입니다.

## 실행

```bash
cd stats-prototype
npm install
npm run dev
```

## 구성

- 메뉴 2개 × 탭/그룹 3개 = 총 6화면
  - 실시간 매출 통계(Track1): 오늘 / 이번 주 / 이번 달
  - 고객 심층 분석(Track2): 누가 오는가 / 왜·언제 오는가 / 돈이 되는가
- 모든 차트는 더미데이터
- 각 카드를 호버(PC) 또는 탭(모바일)하면 우측 상단 `JSON` 배지가 활성화되며, 해당 지표의
  `지표명 / 정의 / 원천데이터_및_산식 / 제공목적 / 차트형태`가 JSON 형태로 팝업 노출됩니다.

## 주요 파일

- `src/data/track1Indicators.ts`, `src/data/track2Indicators.ts` — 호버 팝업에 쓰이는 지표 JSON (원본 v2 문서의 JSON 블록 그대로)
- `src/data/track1Dummy.ts`, `src/data/track2Dummy.ts` — 화면에 표시되는 더미 수치
- `src/components/IndicatorHover.tsx` — 호버/탭 시 JSON 팝업을 띄우는 공통 컴포넌트
- `src/screens/Track1Screen.tsx`, `src/screens/Track2Screen.tsx` — 화면별 카드 배치

> 참고: 원본 v2 문서는 Track2를 "탭 없이 세로 스크롤"로 정의하지만, 이 프로토타입은 미팅 데모 편의를 위해
> 6개 화면을 개별적으로 오갈 수 있도록 탭 형태로 구현했습니다. 실제 구현 시에는 원본 문서의 스크롤 방식을 따릅니다.
