import React from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  Bell,
  CheckCircle2,
  Plus,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useAssignments } from "../../hooks/useAssignments";
import { useGrades } from "../../hooks/useGrades";
import { useStudents } from "../../hooks/useStudents";
import { useTimetable } from "../../hooks/useTimetable";
import { format } from "date-fns";

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const studentId = (user?.prefs as any)?.studentId || "guest-student";
  const { students } = useStudents();
  const studentDoc = students.find((s) => s.id === studentId);
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { grades } = useGrades();
  const { timetable } = useTimetable({ grade: studentDoc?.grade });

  const studentGrades = grades.filter((g) => g.studentId === studentId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Welcome back, {user?.name?.split(" ")[0] || "Alex"}
          </h1>
          <div className="flex items-center space-x-3 text-slate-500 mt-2 font-medium">
            <Calendar size={18} className="text-blue-500" />
            <span>{format(new Date(), "EEEE, MMMM do")} • Semester 2</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
            <Bell size={20} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center space-x-2">
            <Plus size={20} />
            <span>New Submission</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timetable & Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Timetable */}
          <div className="glass p-8 rounded-4xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Personal Timetable
                </h3>
                <p className="text-sm text-slate-500">
                  Weekly schedule & lecture locations
                </p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  Week
                </button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
                  Day
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (day, idx) => {
                  const dayEntries = timetable.filter((t) => t.day === day);
                  const displayDay = day.substring(0, 3) + " " + (23 + idx);

                  return (
                    <div key={idx} className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">
                        {displayDay}
                      </p>
                      {dayEntries.length === 0 ? (
                        <div className="h-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center opacity-30">
                          <span className="text-[8px] font-bold uppercase tracking-tighter">
                            No Class
                          </span>
                        </div>
                      ) : (
                        dayEntries.map((entry, eIdx) => (
                          <div
                            key={eIdx}
                            className={`p-4 rounded-xl border-l-4 ${
                              eIdx % 2 === 0
                                ? "bg-blue-50 dark:bg-blue-900/10 border-blue-500"
                                : "bg-purple-50 dark:bg-purple-900/10 border-purple-500"
                            }`}
                          >
                            <p
                              className={`text-[10px] font-bold mb-1 ${eIdx % 2 === 0 ? "text-blue-600" : "text-purple-600"}`}
                            >
                              {entry.startTime} - {entry.endTime}
                            </p>
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {entry.subject}
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">
                              {entry.room || "Lab"} •{" "}
                              {entry.teacherName || "TBA"}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Recent Exam Results */}
          <div className="glass p-8 rounded-4xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Exam Results
              </h3>
              <button className="text-blue-600 hover:text-blue-500 text-xs font-bold uppercase tracking-widest">
                View Transcript
              </button>
            </div>
            <div className="space-y-4">
              {studentGrades.length === 0 ? (
                <div className="text-slate-400 italic py-4">
                  No recent grades recorded.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-4 font-black">Subject</th>
                      <th className="pb-4 font-black">Date</th>
                      <th className="pb-4 font-black">Grade</th>
                      <th className="pb-4 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {studentGrades.map((grade, idx) => (
                      <tr
                        key={idx}
                        className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 font-bold text-sm text-slate-800 dark:text-slate-200">
                          {grade.subject}
                        </td>
                        <td className="py-4 text-xs text-slate-500 font-medium">
                          Oct 12, 2023
                        </td>
                        <td className="py-4 font-black text-blue-600">
                          {grade.grade}
                        </td>
                        <td className="py-4 text-[10px] font-black uppercase text-green-500 tracking-wider">
                          Excellent
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance & Deadlines */}
        <div className="space-y-8">
          {/* Attendance Status */}
          <div className="glass p-8 rounded-4xl border border-white/10 relative overflow-hidden">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-6">
              Attendance Status
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                  98%
                </p>
                <div className="bg-green-500 px-2.5 py-1 rounded-lg text-[10px] font-black text-white inline-block mt-4 uppercase tracking-[0.2em]">
                  High
                </div>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.98)}
                    className="text-blue-600 stroke-linecap-round transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              You've only missed **2 sessions** this semester. Keep it up!
            </p>
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass p-8 rounded-4xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming Deadlines
              </h3>
              <button
                onClick={() => navigate("/assignments")}
                className="text-[10px] font-black uppercase text-blue-600 hover:underline tracking-widest"
              >
                View All
              </button>
            </div>
            <div className="space-y-6">
              {assignments.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  No upcoming deadlines.
                </p>
              ) : (
                assignments.slice(0, 3).map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="flex items-start space-x-4 group cursor-pointer"
                    onClick={() => navigate(`/assignments/${assignment.id}`)}
                  >
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {assignment.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 group-hover:text-blue-500 mt-1"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Popup */}
          <div className="bg-blue-600 rounded-4xl p-8 text-white relative overflow-hidden group shadow-xl shadow-blue-600/30">
            <MessageSquare
              className="absolute -bottom-4 -right-4 text-white/10 rotate-12 transition-transform group-hover:scale-125"
              size={120}
            />
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                C
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">
                Feedback from Dr. Chen
              </p>
            </div>
            <p className="text-sm font-medium italic leading-relaxed mb-8 relative z-10">
              "Excellent work on the last history presentation. Your analysis of
              industrial trends was particularly insightful."
            </p>
            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:underline relative z-10">
              <span>View Message History</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
