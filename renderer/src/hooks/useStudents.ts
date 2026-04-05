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

  const addStudent = async (student: any, invite = true) => {
    const db = await getDB();
    const studentId = crypto.randomUUID();

    const trimmedEmail = student.email?.trim();

    if (invite && trimmedEmail && navigator.onLine) {
      try {
        await (window as any).electronAPI.sendInvitation({
          email: trimmedEmail,
          name: student.name,
          role: "student",
        });
      } catch (error) {
        console.error("Failed to send invitation:", error);
      }
    }

    await db.students.insert({
      id: studentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      status: invite ? "invited" : "active",
      ...student,
    });
  };

  return { students, loading, addStudent };
};
