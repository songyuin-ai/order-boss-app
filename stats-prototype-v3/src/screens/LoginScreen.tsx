import { useState } from "react";
import OwnershipVerificationStep from "../components/OwnershipVerificationStep";
import { findIssuedAccount, type IssuedAccount, type StoreAccount } from "../data/accounts";

interface Props {
  onSuccess: (store: StoreAccount) => void;
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
    const ok = code === pendingAccount.verificationCode;
    if (ok) onSuccess(pendingAccount.store);
    return ok;
  };

  return (
    <div className="login-screen">
      <div className="login-screen__brand">사장님앱</div>
      {step === "credentials" ? (
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
            <span>gangnam2024 / pass1234 / 인증코드 123456</span>
          </div>
        </>
      ) : (
        <OwnershipVerificationStep onSubmit={handleVerify} onBack={() => setStep("credentials")} />
      )}
    </div>
  );
}
