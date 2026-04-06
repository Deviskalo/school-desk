import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export interface Activity {
  id: string;
  type: "student" | "teacher" | "grade" | "assignment" | "security";
  title: string;
  subtitle: string;
  timestamp: number;
}

export const useRecentActivities = (
  limit: number | null = 5,
  filterType?: Activity["type"],
) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const init = async () => {
      const db = await getDB();
      const queryLimit = limit ?? 100;

      let query = db.audit_logs
        .find()
        .sort({ createdAt: "desc" })
        .limit(queryLimit);

      if (filterType) {
        query = db.audit_logs
          .find({
            selector: { type: { $eq: filterType } },
          })
          .sort({ createdAt: "desc" })
          .limit(queryLimit);
      }

      sub = query.$.subscribe((docs: any[]) => {
        const mapped = docs.map((d) => ({
          id: d.id,
          type: d.type as any,
          title: d.title,
          subtitle: d.subtitle,
          timestamp: d.createdAt,
        }));
        setActivities(mapped);
        setLoading(false);
      });
    };

    init();
    return () => sub?.unsubscribe();
  }, [limit, filterType]);

  return { activities, loading };
};
