import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadAssignments = async () => {
      const db = await getDB();
      const query = db.assignments.find().sort({ createdAt: "desc" });
      sub = query.$.subscribe((docs: any[]) => {
        setAssignments(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };
    loadAssignments();
    return () => sub?.unsubscribe();
  }, []);

  const addAssignment = async (assignment: any) => {
    const db = await getDB();
    await db.assignments.insert({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      deleted: false,
      ...assignment,
    });
  };

  return { assignments, loading, addAssignment };
};
