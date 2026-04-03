import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useGrades = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadGrades = async () => {
      const db = await getDB();
      const query = db.grades.find().sort({ createdAt: "desc" });
      sub = query.$.subscribe((docs: any[]) => {
        setGrades(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };
    loadGrades();
    return () => sub?.unsubscribe();
  }, []);

  const addGrade = async (grade: any) => {
    const db = await getDB();
    await db.grades.insert({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      deleted: false,
      ...grade,
    });
  };

  return { grades, loading, addGrade };
};
