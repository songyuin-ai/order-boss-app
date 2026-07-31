import { useState } from "react";
import OwnershipVerificationStep from "../components/OwnershipVerificationStep";
import {
  ISSUED_ACCOUNTS,
  findIssuedAccount,
  findAccountsByPhone,
  OTP_CODE_BY_PHONE,
  type IssuedAccount,
  type StoreAccount,
} from "../data/accounts";
import { maskPhone } from "../utils/format";

export interface LoginSuccessPayload {
  accounts: StoreAccount[];
  activeStoreId: string;
}

interface Props {
  onSuccess: (payload: LoginSuccessPayload) => void;
}

export default function LoginScreen({ onSuccess }: Props) {
  const [step, setStep] = useState<"credentials" | "verification">("credentials");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingAccount, setPendingAccount] = useState<IssuedAccount | null>(null);

  const handleNext = () => {
    const found = findIssuedAccount(loginId.trim(), password);
    if (!found) {
      setError("아이디 또는 비밀번호를 다시 확인해주세요");
      return;
    }
    setError("");
    setPendingAccount(found);
    setStep("verification");
  };

  const handleVerify = (code: string) => {
    if (!pendingAccount) return false;
    const ok = code === OTP_CODE_BY_PHONE[pendingAccount.ownerPhone];
    if (ok) {
      onSuccess({
        accounts: findAccountsByPhone(pendingAccount.ownerPhone),
        activeStoreId: pendingAccount.store.id,
      });
    }
    return ok;
  };

  // 프로토타입 데모용 — ID/PW + 휴대폰 OTP 인증과정 없이 로그인된 상태(기본 데모 계정)로 바로 진입
  const handleSkipLogin = () => {
    const demo = ISSUED_ACCOUNTS[0];
    onSuccess({
      accounts: findAccountsByPhone(demo.ownerPhone),
      activeStoreId: demo.store.id,
    });
  };

  return (
    <div className="login-screen">
      <div className="login-screen__brand">사장님앱</div>
      {step === "credentials" && (
        <>
          <h2 className="auth-step__title">로그인</h2>
          <p className="auth-step__desc">매장 계정은 가입이 아니라 본사에서 발급해드려요</p>
          <input
            className="auth-input"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => {
              setLoginId(e.target.value);
              setError("");
            }}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="button" className="auth-submit" onClick={handleNext}>
            다음
          </button>
          <p className="login-screen__note">계정을 아직 못 받으셨나요? 담당 매니저에게 문의해주세요</p>
          <div className="login-screen__demo">
            <span>데모 계정</span>
            <span>gangnam2024 / pass1234 (OTP 123456, 홍대점과 번호 공유)</span>
            <span>hongdae2024 / pass1234 (OTP 123456)</span>
            <span>bundang2024 / pass1234 (OTP 654321, 계정 추가로 테스트)</span>
          </div>
          <button type="button" className="skip-login-link" onClick={handleSkipLogin}>
            로그인 상태 보기
          </button>
        </>
      )}
      {step === "verification" && pendingAccount && (
        <OwnershipVerificationStep
          maskedPhone={maskPhone(pendingAccount.ownerPhone)}
          onSubmit={handleVerify}
          onBack={() => setStep("credentials")}
        />
      )}
    </div>
  );
}
