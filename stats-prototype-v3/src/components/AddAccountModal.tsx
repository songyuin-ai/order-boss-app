import { useState } from "react";
import OwnershipVerificationStep from "./OwnershipVerificationStep";
import { findIssuedAccount, type IssuedAccount, type StoreAccount } from "../data/accounts";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (store: StoreAccount) => void;
}

export default function AddAccountModal({ open, onClose, onAdded }: Props) {
  const [step, setStep] = useState<"credentials" | "verification">("credentials");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingAccount, setPendingAccount] = useState<IssuedAccount | null>(null);

  if (!open) return null;

  const reset = () => {
    setStep("credentials");
    setLoginId("");
    setPassword("");
    setError("");
    setPendingAccount(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
    if (ok) {
      onAdded(pendingAccount.store);
      reset();
      onClose();
    }
    return ok;
  };

  return (
    <>
      <div className="period-modal-backdrop" onClick={handleClose} />
      <div className="period-modal" onClick={(e) => e.stopPropagation()}>
        <div className="period-modal__head">
          <button type="button" className="period-modal__close" onClick={handleClose} aria-label="닫기">
            ×
          </button>
          <span className="period-modal__title">계정 추가</span>
        </div>
        {step === "credentials" ? (
          <>
            <p className="auth-step__desc">추가할 매장의 아이디/비밀번호를 입력해주세요</p>
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
          </>
        ) : (
          <OwnershipVerificationStep onSubmit={handleVerify} onBack={() => setStep("credentials")} />
        )}
      </div>
    </>
  );
}
