import { SEGMENT_EXPLAIN } from "../data/customerSegmentsDummy";
import { useAppData } from "../context/DataContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

// "손님 그룹은 어떤 기준으로 구분하나요?" 안내 바텀시트
// 내부 판정 코드는 노출하지 않고, 사장님이 바로 이해할 수 있는 말로만 설명
export default function SegmentInfoSheet({ open, onClose }: Props) {
  const { customerSegments } = useAppData();
  return (
    <>
      <div className={`sheet-backdrop${open ? " is-open" : ""}`} onClick={onClose} />
      <div className={`sheet${open ? " is-open" : ""}`}>
        <div className="sheet__handle" />
        <div className="sheet__title">손님 그룹은 이렇게 나눠요</div>

        <p className="segment-info__intro">
          최근 30일(과 그 이전 30일) 방문 패턴을 보고 6개 그룹으로 나눠요. 그룹은 서로 겹칠 수 있어요.
        </p>

        <div className="segment-info__groups">
          {customerSegments.map((s) => (
            <div key={s.key} className="segment-info__group">
              <span className="segment-info__group-dot" style={{ background: s.color }} />
              <div className="segment-info__group-body">
                <div className="segment-info__group-name" style={{ color: s.color }}>
                  {s.label}
                </div>
                <div className="segment-info__group-desc">{SEGMENT_EXPLAIN[s.key]}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="sheet__note">기준값은 디저트/커피숍 매장 평균 방문 패턴을 바탕으로 정했어요.</p>
      </div>
    </>
  );
}
