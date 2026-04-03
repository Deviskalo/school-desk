import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadStudents = async () => {
      const db = await getDB();
      const query = db.students.find().sort({ createdAt: "desc" });
      sub = query.$.subscribe((docs: any[]) => {
        setStudents(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };
    loadStudents();
    return () => sub?.unsubscribe();
  }, []);

  const addStudent = async (student: any) => {
    const db = await getDB();
    await db.students.insert({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      ...student,
    });
  };

  return { students, loading, addStudent };
};
