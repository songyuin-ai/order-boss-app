// 구글시트 연동 설정 (지표 표 전용 — 차트 더미 수치는 연동 대상 아님)
// 1. 구글시트의 "indicators_seed" 탭에 헤더(id/지표명/노출화면/집계 주기/조회 기간/원천데이터/정의/산식/제공목적/차트 형태)
//    +데이터를 채운 뒤 "링크가 있는 모든 사용자 - 뷰어"로 공유 (탭 이름이 다르면 lib/loadIndicators.ts의 INDICATORS_TAB도 변경)
// 2. 시트 URL(.../d/<이 부분>/edit...)에서 ID를 복사해 아래에 붙여넣기
// 3. 비워두면(빈 문자열) 자동으로 내장 더미데이터를 폴백으로 사용합니다 (데모가 깨지지 않음)
export const SHEET_ID = "14YbQvJx1QOrxFNWDEVJKSUUYShlT7V3clsBn6AtAg70";
