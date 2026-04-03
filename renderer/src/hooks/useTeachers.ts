import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";
import { teams, ID } from "@appwrite/client";

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

  const addTeacher = async (teacher: any, invite = true) => {
    const db = await getDB();
    const teacherId = crypto.randomUUID();

    const trimmedEmail = teacher.email?.trim();

    if (invite && trimmedEmail && navigator.onLine) {
      try {
        await teams.createMembership(
          "teachers",
          ["teacher"],
          `${window.location.origin}/setup`,
          trimmedEmail,
          ID.unique(),
          undefined,
          teacher.name,
        );
      } catch (error) {
        console.error("Failed to send teacher invitation:", error);
      }
    }

    await db.teachers.insert({
      id: teacherId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      isDeleted: false,
      status: invite ? "invited" : "active",
      ...teacher,
    });
  };

  const deleteTeacher = async (id: string) => {
    const db = await getDB();
    const doc = await db.teachers.findOne(id).exec();
    if (doc) {
      await doc.patch({
        isDeleted: true,
        updatedAt: Date.now(),
        synced: false,
      });
    }
  };

  return {
    teachers: teachers.filter((t) => !t.isDeleted),
    loading,
    addTeacher,
    deleteTeacher,
  };
};
