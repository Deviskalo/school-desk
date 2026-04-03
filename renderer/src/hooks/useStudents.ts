import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";
import { teams, ID } from "@appwrite/client";

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
      console.log("Sending invitation to:", trimmedEmail, "Team:", "students");
      try {
        await teams.createMembership(
          "students",
          ["student"],
          `${window.location.origin}/setup`,
          trimmedEmail,
          ID.unique(),
          undefined,
          student.name,
        );
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
