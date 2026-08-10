import { useEffect, useState } from "react";
import { BASE_REVENUE_BY_STORE_ID } from "../data/accounts";

// 실서비스 기준 10분 주기 갱신을 가정한 시뮬레이션 (요건: 10분 간격 · 원 단위)
const UPDATE_INTERVAL_MS = 10 * 60 * 1000;

export function useRealtimeRevenue(): Record<string, number> {
  const [revenueByStoreId, setRevenueByStoreId] = useState<Record<string, number>>({
    ...BASE_REVENUE_BY_STORE_ID,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setRevenueByStoreId((prev) => {
        const next: Record<string, number> = {};
        for (const id of Object.keys(prev)) {
          next[id] = prev[id] + (Math.floor(Math.random() * 150000) + 30000);
        }
        return next;
      });
    }, UPDATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return revenueByStoreId;
}
