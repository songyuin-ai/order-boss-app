export interface StoreAccount {
  id: string;
  name: string;
  addr: string;
}

export interface IssuedAccount {
  loginId: string;
  password: string;
  verificationCode: string;
  store: StoreAccount;
}

// 어드민이 매장당 1개씩 발급하는 계정 (mock) — 가입이 아니라 발급 형태이므로
// 로그인/계정추가 화면에는 이 목록과 대조하는 것 외에 별도 가입 진입점을 두지 않는다.
export const ISSUED_ACCOUNTS: IssuedAccount[] = [
  {
    loginId: "gangnam2024",
    password: "pass1234",
    verificationCode: "123456",
    store: { id: "gangnam", name: "파리바게뜨 과천점", addr: "경기 과천시" },
  },
  {
    loginId: "hongdae2024",
    password: "pass1234",
    verificationCode: "654321",
    store: { id: "hongdae", name: "파리바게뜨 홍대점", addr: "서울 마포구" },
  },
  {
    loginId: "bundang2024",
    password: "pass1234",
    verificationCode: "111222",
    store: { id: "bundang", name: "파리바게뜨 분당점", addr: "경기 성남시" },
  },
];

export function findIssuedAccount(loginId: string, password: string): IssuedAccount | null {
  return ISSUED_ACCOUNTS.find((a) => a.loginId === loginId && a.password === password) ?? null;
}

// 매장별 당일 매출(원) 시뮬레이션 기준값 — useRealtimeRevenue의 시작점
export const BASE_REVENUE_BY_STORE_ID: Record<string, number> = {
  gangnam: 1240000,
  hongdae: 980000,
  bundang: 1560000,
};
