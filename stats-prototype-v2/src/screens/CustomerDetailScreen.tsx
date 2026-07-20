import { useEffect, useState } from "react";
import Card from "../components/Card";
import RevenueRankList from "../components/RevenueRankList";
import { useAppData } from "../context/DataContext";
import { periodKey, periodDefLabel, type PeriodSelection } from "../lib/period";
import type { Indicator } from "../data/types";

function AgePreferredCard({
  indicator,
  agePreferredProducts,
}: {
  indicator: Indicator;
  agePreferredProducts: Record<string, { name: string; revenue: number }[]>;
}) {
  const ageGroups = Object.keys(agePreferredProducts);
  const [age, setAge] = useState<string>(ageGroups[1] ?? ageGroups[0]);
  const selected = agePreferredProducts[age] ?? agePreferredProducts[ageGroups[0]] ?? [];

  return (
    <Card title="연령대별 선호상품 Top3" indicator={indicator}>
      <div className="chip-row">
        {ageGroups.map((a) => (
          <button
            key={a}
            type="button"
            className={`chip chip--btn${a === age ? " is-active" : ""}`}
            onClick={() => setAge(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <RevenueRankList items={selected} />
    </Card>
  );
}

interface Props {
  period: PeriodSelection;
  onPanelChange: (indicators: Indicator[], label: string) => void;
}

export default function CustomerDetailScreen({ period, onPanelChange }: Props) {
  const { customerDetailIndicators: indicators, customerDetail } = useAppData();
  const data = customerDetail.byPeriod[periodKey(period)] ?? customerDetail.byPeriod.recent30;

  useEffect(() => {
    onPanelChange(
      [
        indicators.category,
        indicators.agePreferred,
        indicators.loyalPreferred,
        indicators.visitTime,
        indicators.revisitCycle,
      ],
      `고객 상세분석 기준 · ${periodDefLabel(period)}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators, period]);

  return (
    <div className="screen__cards">
      <Card title="선호 카테고리 Top3" indicator={indicators.category}>
        <ol className="menu-list">
          {data.preferredCategory.map((c, i) => (
            <li key={c.name} className="menu-list__item">
              <span className="menu-list__rank">{i + 1}</span>
              <span className="menu-list__name">{c.name}</span>
              <span className="menu-list__count">{c.pct}%</span>
            </li>
          ))}
        </ol>
      </Card>

      <AgePreferredCard indicator={indicators.agePreferred} agePreferredProducts={data.agePreferredProducts} />

      <Card title="단골 선호상품 Top3" indicator={indicators.loyalPreferred}>
        <RevenueRankList items={data.loyalPreferredProducts} />
      </Card>

      <Card title="방문 시간대" indicator={indicators.visitTime}>
        <div className="info-text">{data.visitTimeText}</div>
      </Card>

      <Card title="재방문 주기(고착도)" indicator={indicators.revisitCycle}>
        <div className="big-stat">
          <span className="big-stat__value">{data.revisitCycle.value}</span>
          <span className="big-stat__label">{data.revisitCycle.label}</span>
        </div>
      </Card>
    </div>
  );
}
