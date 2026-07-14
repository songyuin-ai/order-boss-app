# 사장님앱 통계 메뉴 프로토타입

`작업계획서_사장님앱_통계_프로토타입.md` 기준으로 만든 클릭 프로토타입입니다.
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
- 전체 22개 지표에 `data_001`~`data_022` 식별자 부여
- 각 차트 우상단의 식별자 배지를 클릭하면 우측 지표 표에서 해당 행이 강조되고 나머지는 흐려짐 (다시 클릭하면 해제)

## 데이터 소스 (구글시트 연동)

기본은 내장 더미데이터로 동작하지만, 구글시트를 연결하면 코드 수정 없이 시트에서 값을 바로 반영할 수 있습니다.

1. 이 폴더의 `사장님앱_통계_데이터시트.xlsx`를 구글시트로 가져오기 (구글시트에서 파일 > 가져오기 > 업로드, "새 스프레드시트로 삽입")
2. 공유 설정을 **"링크가 있는 모든 사용자 - 뷰어"**로 변경
3. 시트 URL에서 ID 복사 (`https://docs.google.com/spreadsheets/d/여기부분/edit`)
4. `src/config.ts`의 `SHEET_ID`에 붙여넣기
5. 저장하고 새로고침 — 화면 상단 배지가 "구글시트 데이터 연결됨"으로 바뀌면 성공

시트 탭 이름과 컬럼 구조는 반드시 `사장님앱_통계_데이터시트.xlsx`의 틀을 유지해야 합니다 (탭 이름, 컬럼 헤더가 코드와 매칭됨). 행 추가/삭제, 값 수정은 자유롭게 가능합니다.

시트 연결이 실패하거나 `SHEET_ID`가 비어있으면 자동으로 내장 더미데이터로 대체되어 화면이 깨지지 않습니다.

## 주요 파일

- `src/config.ts` — 구글시트 ID 설정
- `src/lib/googleSheet.ts` — 구글시트 gviz API fetch/파싱 유틸
- `src/lib/loadLiveData.ts` — 시트 탭별 raw row를 앱 데이터 타입으로 매핑
- `src/context/DataContext.tsx` — 시트 데이터를 내장 더미데이터에 병합해 앱 전체에 제공
- `src/data/track1Indicators.ts`, `src/data/track2Indicators.ts` — 지표 정의 기본값 (시트 미연결 시 사용)
- `src/data/track1Dummy.ts`, `src/data/track2Dummy.ts` — 화면에 표시되는 더미 수치 기본값
- `src/components/IdBadge.tsx`, `src/components/IndicatorPanel.tsx` — 식별자 배지 + 우측 지표 표
- `src/screens/Track1Screen.tsx`, `src/screens/Track2Screen.tsx` — 화면별 카드 배치

> 참고: 원본 v2 문서는 Track2를 "탭 없이 세로 스크롤"로 정의하지만, 이 프로토타입은 미팅 데모 편의를 위해
> 6개 화면을 개별적으로 오갈 수 있도록 탭 형태로 구현했습니다. 실제 구현 시에는 원본 문서의 스크롤 방식을 따릅니다.
