import { useState } from "react";
import OwnershipVerificationStep from "./OwnershipVerificationStep";
import { findIssuedAccount, OTP_CODE_BY_PHONE, type IssuedAccount, type StoreAccount } from "../data/accounts";
import { maskPhone } from "../utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (store: StoreAccount) => void;
}

type Step = "credentials" | "verification" | "success";

export default function AddAccountModal({ open, onClose, onAdded }: Props) {
  const [step, setStep] = useState<Step>("credentials");
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
    const ok = code === OTP_CODE_BY_PHONE[pendingAccount.ownerPhone];
    if (ok) {
      onAdded(pendingAccount.store);
      setStep("success");
    }
    return ok;
  };

  return (
    <>
      <div className="period-modal-backdrop" onClick={handleClose} />
      <div className="period-modal" onClick={(e) => e.stopPropagation()}>
        {step !== "success" && (
          <div className="period-modal__head">
            <button type="button" className="period-modal__close" onClick={handleClose} aria-label="닫기">
              ×
            </button>
            <span className="period-modal__title">계정 추가</span>
          </div>
        )}
        {step === "credentials" && (
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
        )}
        {step === "verification" && pendingAccount && (
          <OwnershipVerificationStep
            maskedPhone={maskPhone(pendingAccount.ownerPhone)}
            onSubmit={handleVerify}
            onBack={() => setStep("credentials")}
          />
        )}
        {step === "success" && pendingAccount && (
          <div className="auth-success">
            <div className="auth-success__icon">✓</div>
            <p className="auth-success__text">{pendingAccount.store.name} 계정 추가에 성공하였습니다.</p>
            <button type="button" className="auth-submit" onClick={handleClose}>
              확인
            </button>
          </div>
        )}
      </div>
    </>
  );
}
