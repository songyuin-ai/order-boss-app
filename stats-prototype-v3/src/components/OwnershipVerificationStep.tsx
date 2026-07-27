import { useState } from "react";

interface Props {
  description?: string;
  onSubmit: (code: string) => boolean;
  onBack: () => void;
}

const CODE_LENGTH = 6;

export default function OwnershipVerificationStep({ description, onSubmit, onBack }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (code.length !== CODE_LENGTH) {
      setError(`인증코드 ${CODE_LENGTH}자리를 입력해주세요`);
      return;
    }
    const ok = onSubmit(code);
    if (!ok) {
      setError("인증코드가 올바르지 않아요. 다시 확인해주세요");
      setCode("");
    }
  };

  return (
    <div className="auth-step">
      <button type="button" className="auth-step__back" onClick={onBack} aria-label="이전으로">
        ‹
      </button>
      <h2 className="auth-step__title">점유인증</h2>
      <p className="auth-step__desc">
        {description ?? "계정을 전달받으실 때 함께 안내된 인증코드 6자리를 입력해주세요"}
      </p>
      <input
        className="auth-input auth-input--code"
        inputMode="numeric"
        maxLength={CODE_LENGTH}
        placeholder="인증코드 6자리"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH));
          setError("");
        }}
      />
      {error && <p className="auth-error">{error}</p>}
      <button type="button" className="auth-submit" onClick={handleSubmit}>
        인증하기
      </button>
    </div>
  );
}
