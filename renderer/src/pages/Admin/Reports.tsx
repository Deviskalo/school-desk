import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { useGrades } from "../../hooks/useGrades";
import { getDB } from "@database/rxdb";
import { format } from "date-fns";

const downloadCSV = (filename: string, rows: string[][], headers: string[]) => {
  const csvContent = [headers, ...rows]
    .map((r) => r.map((v) => `"${(v || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

interface ReportCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconBg: string;
  count: number;
  countLabel: string;
  onExport: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  iconBg,
  count,
  countLabel,
  onExport,
}) => (
  <div className={`glass p-8 rounded-4xl border ${color} flex flex-col gap-6`}>
    <div className="flex items-start justify-between">
      <div
        className={`w-14 h-14 ${iconBg} rounded-3xl flex items-center justify-center`}
      >
        <Icon size={28} className="text-white" />
      </div>
      <div className="text-right">
        <p className="text-3xl font-black text-slate-900 dark:text-white">
          {count}
        </p>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
          {countLabel}
        </p>
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    <button
      onClick={onExport}
      className="flex items-center justify-center space-x-2 w-full py-3 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/20 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-sm transition-all active:scale-95 group"
    >
      <Download
        size={16}
        className="group-hover:-translate-y-0.5 transition-transform"
      />
      <span>Download CSV</span>
    </button>
  </div>
);

const ReportsPage: React.FC = () => {
  const { students } = useStudents();
  const { grades } = useGrades();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [exported, setExported] = useState<string | null>(null);

  useEffect(() => {
    let sub: any;
    const init = async () => {
      const db = await getDB();
      sub = db.attendance
        .find()
        .$.subscribe((docs: any[]) =>
          setAttendance(docs.map((d) => d.toJSON())),
        );
    };
    init();
    return () => sub?.unsubscribe();
  }, []);

  const flashExport = (type: string) => {
    setExported(type);
    setTimeout(() => setExported(null), 2500);
  };

  const exportAttendance = () => {
    const studentMap: Record<string, string> = {};
    students.forEach((s: any) => (studentMap[s.id] = s.name));
    const rows = attendance.map((a: any) => [
      format(new Date(a.date), "yyyy-MM-dd"),
      studentMap[a.studentId] || a.studentId,
      a.status,
    ]);
    downloadCSV(
      `attendance_export_${format(new Date(), "yyyyMMdd")}.csv`,
      rows,
      ["Date", "Student Name", "Status"],
    );
    flashExport("attendance");
  };

  const exportGrades = () => {
    const studentMap: Record<string, string> = {};
    students.forEach((s: any) => (studentMap[s.id] = s.name));
    const rows = grades.map((g: any) => [
      studentMap[g.studentId] || g.studentId,
      g.subject || "—",
      g.grade,
      g.date ? format(new Date(g.date), "yyyy-MM-dd") : "—",
    ]);
    downloadCSV(`grades_export_${format(new Date(), "yyyyMMdd")}.csv`, rows, [
      "Student Name",
      "Subject",
      "Grade",
      "Date",
    ]);
    flashExport("grades");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
          <FileText size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reports & Export
          </h1>
          <p className="text-slate-500 mt-1">
            Download school data as CSV for analysis or compliance
          </p>
        </div>
      </div>

      {/* Flash badge */}
      {exported && (
        <div className="flex items-center space-x-2 text-green-500 text-sm font-bold border border-green-500/30 bg-green-500/10 px-4 py-3 rounded-2xl">
          <CheckCircle2 size={16} />
          <span>
            {exported === "attendance" ? "Attendance" : "Grades"} report
            downloaded!
          </span>
        </div>
      )}

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReportCard
          icon={Calendar}
          title="Attendance Report"
          description="Export all student attendance records with date and status."
          color="border-blue-500/20"
          iconBg="bg-blue-600"
          count={attendance.length}
          countLabel="records"
          onExport={exportAttendance}
        />
        <ReportCard
          icon={GraduationCap}
          title="Grades Report"
          description="Export all grade records including subject, score, and student name."
          color="border-purple-500/20"
          iconBg="bg-purple-600"
          count={grades.length}
          countLabel="entries"
          onExport={exportGrades}
        />
      </div>

      {/* Info panel */}
      <div className="glass p-6 rounded-3xl border border-white/10">
        <div className="flex items-start space-x-4">
          <Users size={20} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Data overview
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {students.length} students · {grades.length} grade records ·{" "}
              {attendance.length} attendance records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
