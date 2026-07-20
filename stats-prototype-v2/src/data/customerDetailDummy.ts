export const preferredCategory = ["치킨", "후라이드/양념", "순살 옵션"];

export const agePreferredProducts: Record<string, { name: string; revenue: number }[]> = {
  "10대": [
    { name: "후라이드치킨", revenue: 245000 },
    { name: "양념치킨", revenue: 189000 },
    { name: "치즈볼", revenue: 152000 },
  ],
  "20대": [
    { name: "양념치킨", revenue: 412000 },
    { name: "후라이드치킨", revenue: 356000 },
    { name: "반반치킨", revenue: 298000 },
  ],
  "30대": [
    { name: "반반치킨", revenue: 523000 },
    { name: "양념치킨", revenue: 467000 },
    { name: "후라이드치킨", revenue: 401000 },
  ],
  "40대": [
    { name: "후라이드치킨", revenue: 388000 },
    { name: "반반치킨", revenue: 344000 },
    { name: "마늘치킨", revenue: 276000 },
  ],
  "50대+": [
    { name: "후라이드치킨", revenue: 298000 },
    { name: "양념치킨", revenue: 234000 },
    { name: "간장치킨", revenue: 198000 },
  ],
};

export const loyalPreferredProducts = [
  { name: "반반치킨", revenue: 812000 },
  { name: "양념치킨", revenue: 745000 },
  { name: "후라이드치킨", revenue: 689000 },
];

export const visitTimeText = "주 방문시간 오후 3~5시";

export const revisitCycle = { value: "9.2일", label: "평균 재방문 간격" };
