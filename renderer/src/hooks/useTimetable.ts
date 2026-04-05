import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useTimetable = (filter?: {
  teacherId?: string;
  grade?: string;
}) => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadTimetable = async () => {
      const db = await getDB();
      let query = db.timetable.find();

      if (filter?.teacherId) {
        query = db.timetable.find({
          selector: { teacherId: { $eq: filter.teacherId } },
        });
      } else if (filter?.grade) {
        query = db.timetable.find({
          selector: { grade: { $eq: filter.grade } },
        });
      }

      sub = query.$.subscribe((docs: any[]) => {
        setTimetable(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };

    loadTimetable();
    return () => sub?.unsubscribe();
  }, [filter?.teacherId, filter?.grade]);

  const addTimetableEntry = async (data: any) => {
    const db = await getDB();
    await db.timetable.insert({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      ...data,
    });
  };

  return { timetable, loading, addTimetableEntry };
};
