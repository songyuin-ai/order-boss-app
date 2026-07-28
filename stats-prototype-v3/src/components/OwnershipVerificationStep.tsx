import { useState } from "react";

interface ConsentItem {
  key: string;
  label: string;
  required: boolean;
  detail: string;
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    key: "terms",
    label: "서비스 이용약관 동의",
    required: true,
    detail: "사장님앱 서비스 이용을 위한 약관에 동의합니다. 서비스 제공에 필요한 범위 내에서 계정 정보가 사용됩니다. (프로토타입 예시 문구)",
  },
  {
    key: "age",
    label: "만 14세 이상 사용자 동의",
    required: true,
    detail: "본 서비스는 만 14세 이상만 이용할 수 있습니다. 만 14세 이상임을 확인합니다. (프로토타입 예시 문구)",
  },
  {
    key: "privacy",
    label: "[안내] 개인정보 수집 및 이용사항",
    required: false,
    detail: "수집 항목: 이름, 휴대폰번호, 사업자 정보 · 수집 목적: 본인 확인 및 서비스 제공 · 보유 기간: 계정 해지 시까지. 별도 동의가 필요한 항목은 아니며 안내 목적입니다. (프로토타입 예시 문구)",
  },
];

const REQUIRED_KEYS = CONSENT_ITEMS.filter((item) => item.required).map((item) => item.key);
const CODE_LENGTH = 6;

interface Props {
  maskedPhone: string;
  onSubmit: (code: string) => boolean;
  onBack: () => void;
}

export default function OwnershipVerificationStep({ maskedPhone, onSubmit, onBack }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const canSubmit = REQUIRED_KEYS.every((key) => checked[key]);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (code.length !== CODE_LENGTH) {
      setError(`인증번호 ${CODE_LENGTH}자리를 입력해주세요`);
      return;
    }
    const ok = onSubmit(code);
    if (!ok) {
      setError("인증번호가 올바르지 않아요. 다시 확인해주세요");
      setCode("");
    }
  };

  return (
    <div className="auth-step">
      <button type="button" className="auth-step__back" onClick={onBack} aria-label="이전으로">
        ‹
      </button>
      <h2 className="auth-step__title">휴대폰 점유인증</h2>
      <p className="auth-step__desc">{maskedPhone}(으)로 인증번호를 보내드렸어요</p>

      <div className="consent-list">
        {CONSENT_ITEMS.map((item) => (
          <div key={item.key} className="consent-item">
            <div className="consent-item__row">
              {item.required ? (
                <label className="consent-item__checkbox">
                  <input
                    type="checkbox"
                    checked={!!checked[item.key]}
                    onChange={(e) => setChecked((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                  />
                  <span>{item.label}</span>
                </label>
              ) : (
                <span className="consent-item__label consent-item__label--info">{item.label}</span>
              )}
              <button type="button" className="consent-item__toggle" onClick={() => toggleExpand(item.key)}>
                {expanded[item.key] ? "닫기" : "보기"}
              </button>
            </div>
            {expanded[item.key] && <p className="consent-item__detail">{item.detail}</p>}
          </div>
        ))}
      </div>

      <input
        className="auth-input auth-input--code"
        inputMode="numeric"
        maxLength={CODE_LENGTH}
        placeholder="인증번호 6자리"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH));
          setError("");
        }}
      />
      {error && <p className="auth-error">{error}</p>}
      <button type="button" className="auth-submit" disabled={!canSubmit} onClick={handleSubmit}>
        인증하기
      </button>
    </div>
  );
}
