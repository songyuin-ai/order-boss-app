import { useContext } from "react";
import type { Indicator } from "../data/types";
import { IndicatorContext } from "../context/IndicatorContext";
import Tooltip from "./Tooltip";

interface Props {
  indicators: Indicator[];
  tabLabel: string;
}

export default function IndicatorPanel({ indicators, tabLabel }: Props) {
  const { activeId } = useContext(IndicatorContext);

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">지표 표</span>
        <span className="panel__tab-label">{tabLabel}</span>
      </div>
      <div className="panel__hint">
        차트의 식별자(예: <b>data_001</b>)를 클릭하면 아래 표에서 해당 행이 강조되고 나머지는
        흐려집니다. 같은 배지를 다시 클릭하면 해제됩니다.
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>지표명</th>
              <th>정의</th>
              <th>원천데이터 및 산식</th>
              <th>제공목적</th>
              <th>차트형태</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((ind) => {
              const isActive = ind.id === activeId;
              const isDim = activeId !== null && !isActive;
              return (
                <tr key={ind.id} className={`${isActive ? "is-active" : ""}${isDim ? " is-dim" : ""}`}>
                  <td className="row-id">{ind.id}</td>
                  <td className="col-name">{ind.지표명}</td>
                  <td className="col-def">{ind.정의}</td>
                  <td className="col-src">
                    {ind.원천데이터_및_산식}
                    {ind.참고 && (
                      <Tooltip content={ind.참고}>
                        <span className="row-id-note">ⓘ</span>
                      </Tooltip>
                    )}
                  </td>
                  <td className="col-purpose">{ind.제공목적}</td>
                  <td className="col-chart">{ind.차트형태}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
