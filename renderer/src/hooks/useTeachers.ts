import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadTeachers = async () => {
      const db = await getDB();
      const query = db.teachers.find().sort({ createdAt: "desc" });
      sub = query.$.subscribe((docs: any[]) => {
        setTeachers(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };
    loadTeachers();
    return () => sub?.unsubscribe();
  }, []);

  const addTeacher = async (teacher: any) => {
    const db = await getDB();
    await db.teachers.insert({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      deleted: false,
      ...teacher,
    });
  };

  const deleteTeacher = async (id: string) => {
    const db = await getDB();
    const doc = await db.teachers.findOne(id).exec();
    if (doc) {
      await doc.patch({ deleted: true, updatedAt: Date.now(), synced: false });
    }
  };

  return {
    teachers: teachers.filter((t) => !t.deleted),
    loading,
    addTeacher,
    deleteTeacher,
  };
};
