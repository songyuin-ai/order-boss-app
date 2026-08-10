import type { GenderFilter } from "../data/customerDetailDummy";

const GENDER_TABS: { key: GenderFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "male", label: "남" },
  { key: "female", label: "여" },
];

interface Props {
  data: Record<string, { name: string }[]>;
  gender: GenderFilter;
  onGenderChange: (gender: GenderFilter) => void;
}

export default function AgePopularProductsTable({ data, gender, onGenderChange }: Props) {
  const ageGroups = Object.keys(data);

  return (
    <div className="age-product-table">
      <div className="chip-row age-product-table__filter">
        {GENDER_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`chip chip--btn${gender === t.key ? " is-active" : ""}`}
            onClick={() => onGenderChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>연령대</th>
            <th>1위</th>
            <th>2위</th>
            <th>3위</th>
          </tr>
        </thead>
        <tbody>
          {ageGroups.map((age) => (
            <tr key={age}>
              <td className="age-product-table__age">{age}</td>
              {(data[age] ?? []).map((item, i) => (
                <td key={i}>{item.name}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
