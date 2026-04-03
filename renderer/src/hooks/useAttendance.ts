import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useAttendance = (date: string) => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadRecords = async () => {
      const db = await getDB();
      const query = db.attendance.find({
        selector: { date: { $eq: date } },
      });
      sub = query.$.subscribe((docs: any[]) => {
        setRecords(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };
    loadRecords();
    return () => sub?.unsubscribe();
  }, [date]);

  const markAttendance = async (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => {
    const db = await getDB();
    const existing = await db.attendance
      .findOne({
        selector: { studentId, date: { $eq: date } },
      })
      .exec();

    if (existing) {
      await existing.patch({ status, updatedAt: Date.now(), synced: false });
    } else {
      await db.attendance.insert({
        id: crypto.randomUUID(),
        studentId,
        date,
        status,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        synced: false,
      });
    }
  };

  return { records, loading, markAttendance };
};
