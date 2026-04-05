import { useState, useEffect } from "react";
import { syncEngine } from "@sync/syncEngine";

export const useSyncStatus = () => {
  const [status, setStatus] = useState<"synced" | "syncing" | "error">(
    syncEngine.status,
  );

  useEffect(() => {
    const unsub = syncEngine.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });
    return unsub;
  }, []);

  return status;
};
