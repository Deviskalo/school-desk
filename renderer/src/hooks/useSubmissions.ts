import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

export const useSubmissions = (assignmentId?: string) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const loadSubmissions = async () => {
      const db = await getDB();
      let query = db.submissions.find().sort({ createdAt: "desc" });

      if (assignmentId) {
        query = db.submissions
          .find({
            selector: { assignmentId: { $eq: assignmentId } },
          })
          .sort({ createdAt: "desc" });
      }

      sub = query.$.subscribe((docs: any[]) => {
        setSubmissions(docs.map((doc) => doc.toJSON()));
        setLoading(false);
      });
    };
    loadSubmissions();
    return () => sub?.unsubscribe();
  }, [assignmentId]);

  const submitAssignment = async (data: any) => {
    const db = await getDB();
    await db.submissions.insert({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
      deleted: false,
      ...data,
    });
  };

  const updateSubmission = async (id: string, data: any) => {
    const db = await getDB();
    const doc = await db.submissions.findOne(id).exec();
    if (doc) {
      await doc.patch({
        ...data,
        updatedAt: Date.now(),
        synced: false,
      });
    }
  };

  return { submissions, loading, submitAssignment, updateSubmission };
};
