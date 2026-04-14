import { useMemo } from "react";
import { useStudents } from "./useStudents";
import { useTeachers } from "./useTeachers";

export type SearchResultType = "student" | "teacher";

export interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  type: SearchResultType;
  route: string;
}

export function useGlobalSearch(query: string): {
  results: SearchResult[];
  searching: boolean;
} {
  const { students, loading: studentsLoading } = useStudents();
  const { teachers, loading: teachersLoading } = useTeachers();

  const searching = studentsLoading || teachersLoading;

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const matched: SearchResult[] = [];

    // Students
    students
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.grade?.toLowerCase().includes(q),
      )
      .slice(0, 5)
      .forEach((s) =>
        matched.push({
          id: s.id,
          name: s.name,
          subtitle: s.grade ? `Grade ${s.grade}` : "Student",
          type: "student",
          route: "/students",
        }),
      );

    // Teachers
    teachers
      .filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q),
      )
      .slice(0, 5)
      .forEach((t) =>
        matched.push({
          id: t.id,
          name: t.name,
          subtitle: t.subject || "Teacher",
          type: "teacher",
          route: "/teachers",
        }),
      );

    return matched.slice(0, 10);
  }, [query, students, teachers]);

  return { results, searching };
}
