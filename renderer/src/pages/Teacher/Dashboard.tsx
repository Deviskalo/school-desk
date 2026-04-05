import React, { useState } from "react";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  FileText,
  PieChart,
  Activity,
  Search,
  Bell,
  Calendar,
} from "lucide-react";
import { useAssignments } from "../../hooks/useAssignments";
import { useStudents } from "../../hooks/useStudents";
import { useSubmissions } from "../../hooks/useSubmissions";
import { useAttendance } from "../../hooks/useAttendance";
import { useTeachers } from "../../hooks/useTeachers";
import { useTimetable } from "../../hooks/useTimetable";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { teachers } = useTeachers();
  const currentTeacher = teachers.find((t) => t.appwriteId === user?.$id);
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { students } = useStudents();
  const { submissions } = useSubmissions();
  const { timetable } = useTimetable({ teacherId: currentTeacher?.id });
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const currentDayName = format(new Date(), "EEEE");
  const { records: attendanceRecords, markAttendance } = useAttendance(today);

  // Filter today's classes and sort by time
  const todayClasses = timetable
    .filter((t) => t.day === currentDayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const now = new Date();
  const currentTimeStr = format(now, "HH:mm");

  const ongoingClass = todayClasses.find(
    (t) => t.startTime <= currentTimeStr && t.endTime >= currentTimeStr,
  );
  const nextClasses = todayClasses.filter((t) => t.startTime > currentTimeStr);

  const pendingGradingCount = submissions.filter((s: any) => !s.grade).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mb-1">
            Good Morning, Professor {user?.name?.split(" ").pop() || "Vance"}
          </p>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Your Academic Day
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students, classes..."
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none w-64 transition-all"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content (3 Columns) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Today's Classes Carousel */}
          <div className="glass p-8 rounded-4xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                Today's Classes
              </h3>
              <div className="flex space-x-2">
                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900">
                  <ChevronLeft size={18} />
                </button>
                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex space-x-6 overflow-x-auto pb-4 custom-scrollbar">
              {ongoingClass && (
                <div className="min-w-[320px] bg-blue-600 rounded-4xl p-8 text-white relative group cursor-pointer shadow-xl shadow-blue-600/20">
                  <div className="bg-white/10 self-start px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                    Ongoing
                  </div>
                  <BookOpen
                    className="absolute top-8 right-8 text-white/20"
                    size={48}
                  />
                  <h4 className="text-2xl font-bold mb-2">
                    {ongoingClass.subject}
                  </h4>
                  <p className="text-blue-100 font-medium mb-8">
                    Grade {ongoingClass.grade} • {ongoingClass.room}
                  </p>
                  <div className="flex items-center text-xs text-blue-100 font-bold">
                    <ClipboardCheck size={14} className="mr-2" />
                    <span>
                      {ongoingClass.startTime} - {ongoingClass.endTime}
                    </span>
                  </div>
                </div>
              )}

              {nextClasses.length > 0
                ? nextClasses.map((nextClass, idx) => (
                    <div
                      key={idx}
                      className="min-w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-4xl p-8 group cursor-pointer hover:border-blue-500 transition-all"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 self-start px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
                        {idx === 0 ? "Next Up" : "Later Today"}
                      </div>
                      <Activity
                        className="absolute top-8 right-8 text-slate-100 dark:text-slate-800 group-hover:text-blue-500/10"
                        size={48}
                      />
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {nextClass.subject}
                      </h4>
                      <p className="text-slate-500 font-medium mb-8">
                        Grade {nextClass.grade} • {nextClass.room}
                      </p>
                      <div className="flex items-center text-xs text-slate-400 font-bold">
                        <ClipboardCheck size={14} className="mr-2" />
                        <span>
                          {nextClass.startTime} - {nextClass.endTime}
                        </span>
                      </div>
                    </div>
                  ))
                : !ongoingClass && (
                    <div className="min-w-[320px] glass p-8 rounded-4xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-50">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                        <Calendar size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        No classes scheduled for today
                      </p>
                    </div>
                  )}
            </div>
          </div>

          {/* Performance & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-4xl border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center">
                  <PieChart size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Class Performance Avg.
                  </p>
                  <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                    84.2%
                  </h4>
                </div>
              </div>
              <div className="flex items-center text-green-500 text-xs font-bold">
                <ChevronLeft className="rotate-90 mr-1" size={14} />
                <span>4.1% from last month</span>
              </div>
            </div>

            <div className="glass p-8 rounded-4xl border border-white/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Pending Grading
                  </p>
                  <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                    12
                  </h4>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase">
                4 Assignments due today
              </p>
            </div>
          </div>

          {/* Attention Required */}
          <div className="glass p-8 rounded-4xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Attention Required
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Class 12-A Participation
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-black text-red-500">62%</span>
                    <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                      Reach Out
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Assignment Submission Rate
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-black text-purple-500">
                      91%
                    </span>
                    <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                      View
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: "91%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (1 Column) */}
        <div className="space-y-8">
          {/* Quick Attendance */}
          <div className="bg-blue-600 rounded-4xl p-8 text-white shadow-xl shadow-blue-600/30 min-h-[400px] flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2 tracking-tight">
                Quick Attendance
              </h3>
              <p className="text-blue-100 text-xs font-medium">
                Mark for Molecular Biology (11:00 AM)
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto mb-8 pr-2 custom-scrollbar">
              {students.slice(0, 6).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold truncate max-w-[100px]">
                      {student.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => markAttendance(student.id, "present")}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        attendanceRecords.find(
                          (r) => r.studentId === student.id,
                        )?.status === "present"
                          ? "bg-white text-blue-600"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => markAttendance(student.id, "absent")}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        attendanceRecords.find(
                          (r) => r.studentId === student.id,
                        )?.status === "absent"
                          ? "bg-red-400 text-white"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs">
              Open Full Register
            </button>
          </div>

          {/* Pending Reviews */}
          <div className="glass p-8 rounded-4xl border border-white/10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Pending Reviews
            </h3>
            <div className="space-y-6">
              {submissions.filter((s: any) => !s.grade).length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  No pending reviews.
                </p>
              ) : (
                submissions
                  .filter((s: any) => !s.grade)
                  .slice(0, 3)
                  .map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() =>
                        navigate(`/assignments/${sub.assignmentId}`)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {students
                            .find((s: any) => s.id === sub.studentId)
                            ?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {students.find((s: any) => s.id === sub.studentId)
                              ?.name || "Unknown Student"}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                            {assignments.find(
                              (a: any) => a.id === sub.assignmentId,
                            )?.title || "Assignment"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-300 group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                  ))
              )}
            </div>

            <button className="w-full text-center text-[10px] font-black uppercase text-blue-600 mt-8 tracking-widest hover:underline">
              View All Assignments →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
