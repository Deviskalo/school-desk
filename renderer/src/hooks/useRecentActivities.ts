import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

export interface Activity {
  id: string;
  type: "student" | "teacher" | "grade" | "assignment" | "security";
  title: string;
  subtitle: string;
  timestamp: number;
}

export const useRecentActivities = (limit = 5) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: any;
    const init = async () => {
      const db = await getDB();

      sub = combineLatest({
        students: db.students.find().sort({ createdAt: "desc" }).limit(limit).$,
        teachers: db.teachers.find().sort({ createdAt: "desc" }).limit(limit).$,
        grades: db.grades.find().sort({ createdAt: "desc" }).limit(limit).$,
        assignments: db.assignments
          .find()
          .sort({ createdAt: "desc" })
          .limit(limit).$,
        users: db.users.find().sort({ createdAt: "desc" }).limit(limit).$,
      })
        .pipe(
          map(({ students, teachers, grades, assignments, users }: any) => {
            const all: Activity[] = [
              ...students.map((s: any) => ({
                id: s.id,
                type: "student" as const,
                title: "New Student",
                subtitle: s.name,
                timestamp: s.createdAt,
              })),
              ...teachers.map((t: any) => ({
                id: t.id,
                type: "teacher" as const,
                title: "New Teacher",
                subtitle: t.name,
                timestamp: t.createdAt,
              })),
              ...grades.map((g: any) => ({
                id: g.id,
                type: "grade" as const,
                title: "Grade Recorded",
                subtitle: `${g.subject}: ${g.grade}`,
                timestamp: g.createdAt,
              })),
              ...assignments.map((a: any) => ({
                id: a.id,
                type: "assignment" as const,
                title: "Assignment Created",
                subtitle: a.title,
                timestamp: a.createdAt,
              })),
              ...users
                .filter((u: any) => u.role === "admin" || u.role === "teacher")
                .map((u: any) => ({
                  id: u.appwriteId || u.id,
                  type: "security" as const,
                  title:
                    u.role === "admin"
                      ? "Security: New Admin"
                      : "Security: Teacher Account",
                  subtitle: u.name || u.email,
                  timestamp: u.createdAt || Date.now(),
                })),
            ];

            return all
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, limit);
          }),
        )
        .subscribe((latest) => {
          setActivities(latest);
          setLoading(false);
        });
    };

    init();
    return () => sub?.unsubscribe();
  }, [limit]);

  return { activities, loading };
};
