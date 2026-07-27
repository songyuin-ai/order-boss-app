import type { StoreAccount } from "../data/accounts";
import { formatWon } from "../utils/format";

interface Props {
  open: boolean;
  currentStoreId: string;
  accounts: StoreAccount[];
  revenueByStoreId: Record<string, number>;
  onClose: () => void;
  onSwitch: (storeId: string) => void;
  onAddAccount: () => void;
}

export default function AccountSwitchSheet({
  open,
  currentStoreId,
  accounts,
  revenueByStoreId,
  onClose,
  onSwitch,
  onAddAccount,
}: Props) {
  const sum = accounts.reduce((acc, s) => acc + (revenueByStoreId[s.id] ?? 0), 0);

  return (
    <>
      <div className={`sheet-backdrop${open ? " is-open" : ""}`} onClick={onClose} />
      <div className={`sheet${open ? " is-open" : ""}`}>
        <div className="sheet__handle" />
        <div className="sheet__title">보유 매장</div>
        <div className="sheet__sum">
          <span className="sheet__sum-label">오늘 매출 합계</span>
          <span className="sheet__sum-value">{formatWon(sum)}</span>
        </div>
        {accounts.map((s) => (
          <div key={s.id} className="store-row" onClick={() => onSwitch(s.id)}>
            <div className="store-avatar">행</div>
            <div className="store-info">
              <span className="store-name">{s.name}</span>
              <span className="store-addr">{s.addr}</span>
            </div>
            <span className="store-revenue">{formatWon(revenueByStoreId[s.id] ?? 0)}</span>
            <span className="store-check">{s.id === currentStoreId ? "✓" : ""}</span>
          </div>
        ))}
        <div
          className="store-row store-row--add"
          onClick={(e) => {
            e.stopPropagation();
            onAddAccount();
          }}
        >
          <span className="store-row__addicon">+</span>
          <span>계정 추가</span>
        </div>
        <div className="sheet__note">탭 한 번으로 전환 · 재인증 없음 (계정 추가 시에만 점유인증 필요)</div>
      </div>
    </>
  );
}
