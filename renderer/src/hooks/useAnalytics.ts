import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import { combineLatest } from "rxjs";

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    attendanceTrend: [] as { day: string; rate: number }[],
    gradeDistribution: [] as { label: string; count: number }[],
    enrollmentStats: {
      active: 0,
      invited: 0,
    },
    loading: true,
  });

  useEffect(() => {
    let sub: any;
    const init = async () => {
      const db = await getDB();

      sub = combineLatest({
        attendance: db.attendance.find().$,
        grades: db.grades.find().$,
        students: db.students.find().$,
      }).subscribe(({ attendance, grades, students }: any) => {
        // 1. Attendance Trend (Current Week)
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

        const trend = days.map((day) => {
          const dayRecords = attendance.filter((r: any) =>
            isSameDay(new Date(r.date), day),
          );
          const presentCount = dayRecords.filter(
            (r: any) => r.status === "present",
          ).length;
          const totalRecords = dayRecords.length;

          return {
            day: format(day, "EEE"),
            rate: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0,
          };
        });

        // 2. Grade Distribution
        const distMap: Record<string, number> = {};
        grades.forEach((g: any) => {
          distMap[g.grade] = (distMap[g.grade] || 0) + 1;
        });
        const gradeDist = Object.entries(distMap)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count);

        // 3. Enrollment Stats
        const enrollment = {
          active: students.filter((s: any) => s.status === "active").length,
          invited: students.filter((s: any) => s.status === "invited").length,
        };

        setAnalytics({
          attendanceTrend: trend,
          gradeDistribution: gradeDist,
          enrollmentStats: enrollment,
          loading: false,
        });
      });
    };

    init();
    return () => sub?.unsubscribe();
  }, []);

  return analytics;
};
