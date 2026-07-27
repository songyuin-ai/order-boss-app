export interface StoreAccount {
  id: string;
  name: string;
  addr: string;
}

export const STORE_ACCOUNTS: StoreAccount[] = [
  { id: "gangnam", name: "파리바게뜨 과천점", addr: "경기 과천시" },
  { id: "hongdae", name: "파리바게뜨 홍대점", addr: "서울 마포구" },
  { id: "bundang", name: "파리바게뜨 분당점", addr: "경기 성남시" },
];

interface Props {
  open: boolean;
  currentStoreId: string;
  onClose: () => void;
  onSwitch: (storeId: string) => void;
}

export default function AccountSwitchSheet({ open, currentStoreId, onClose, onSwitch }: Props) {
  return (
    <>
      <div className={`sheet-backdrop${open ? " is-open" : ""}`} onClick={onClose} />
      <div className={`sheet${open ? " is-open" : ""}`}>
        <div className="sheet__handle" />
        <div className="sheet__title">보유 매장</div>
        {STORE_ACCOUNTS.map((s) => (
          <div key={s.id} className="store-row" onClick={() => onSwitch(s.id)}>
            <div className="store-avatar">행</div>
            <div className="store-info">
              <span className="store-name">{s.name}</span>
              <span className="store-addr">{s.addr}</span>
            </div>
            <span className="store-check">{s.id === currentStoreId ? "✓" : ""}</span>
          </div>
        ))}
        <div className="sheet__note">탭 한 번으로 전환 · 재인증 없음</div>
      </div>
    </>
  );
}
