import { useState, useEffect } from "react";
import { syncEngine, type SyncStats } from "@sync/syncEngine";

export const useSystemHealth = () => {
  const [stats, setStats] = useState<SyncStats>(syncEngine.stats);
  const [status, setStatus] = useState(syncEngine.status);

  useEffect(() => {
    const unsubs = [
      syncEngine.onStatsChange((newStats) => setStats(newStats)),
      syncEngine.onStatusChange((newStatus) => setStatus(newStatus)),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  const forceSync = async () => {
    await syncEngine.sync();
  };

  return {
    stats,
    status,
    forceSync,
  };
};
