import { SEGMENT_TABS, SEGMENT_COLORS, SEGMENT_EXPLAIN } from "../data/segmentMeta";

interface Props {
  open: boolean;
  onClose: () => void;
}

// "손님 그룹은 어떤 기준으로 구분하나요?" 안내 바텀시트 (작업계획서_v5 4-9절)
// recGrd/ordFre 같은 내부 판정 코드는 노출하지 않고, 사장님이 바로 이해할 수 있는 말로만 설명
export default function SegmentInfoSheet({ open, onClose }: Props) {
  return (
    <>
      <div className={`sheet-backdrop${open ? " is-open" : ""}`} onClick={onClose} />
      <div className={`sheet${open ? " is-open" : ""}`}>
        <div className="sheet__handle" />
        <div className="sheet__title">손님 그룹은 이렇게 나눠요</div>

        <p className="segment-info__intro">
          최근 90일 동안 손님이 우리 가게에 오신 패턴을 보고, 두 가지 질문으로 4개 그룹을 나눠요.
        </p>

        <div className="segment-info__criteria">
          <div className="segment-info__criteria-item">
            <div className="segment-info__criteria-q">Q. 최근에 오셨나요?</div>
            <div className="segment-info__criteria-a">최근 21일(3주) 이내에 한 번이라도 오셨으면 "최근에 온 손님"이에요.</div>
          </div>
          <div className="segment-info__criteria-item">
            <div className="segment-info__criteria-q">Q. 자주 오시나요?</div>
            <div className="segment-info__criteria-a">최근 90일 동안 4번 이상 오셨으면 "자주 오는 손님"이에요.</div>
          </div>
        </div>

        <div className="segment-info__groups">
          {SEGMENT_TABS.map((t) => (
            <div key={t.key} className="segment-info__group">
              <span className="segment-info__group-dot" style={{ background: SEGMENT_COLORS[t.key] }} />
              <div className="segment-info__group-body">
                <div className="segment-info__group-name" style={{ color: SEGMENT_COLORS[t.key] }}>
                  {t.label}
                </div>
                <div className="segment-info__group-desc">{SEGMENT_EXPLAIN[t.key]}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="sheet__note">기준값은 디저트/커피숍 매장 평균 방문 패턴을 바탕으로 정했어요.</p>
      </div>
    </>
  );
}
