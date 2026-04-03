import React, { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useAttendance } from "../../hooks/useAttendance";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";

const MarkAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { students, loading: studentsLoading } = useStudents();
  const {
    records,
    loading: attendanceLoading,
    markAttendance,
  } = useAttendance(dateStr);

  const getStatus = (studentId: string) => {
    return records.find((r) => r.studentId === studentId)?.status;
  };

  const handleDateChange = (direction: "prev" | "next") => {
    setSelectedDate((prev) =>
      direction === "prev" ? subDays(prev, 1) : addDays(prev, 1),
    );
  };

  if (studentsLoading || attendanceLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Daily Attendance
          </h2>
          <p className="text-slate-500 mt-1">
            Mark attendance for all students on{" "}
            {format(selectedDate, "MMMM do, yyyy")}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handleDateChange("prev")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronLeft
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </button>
          <div className="px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Calendar size={18} className="text-blue-500" />
            <span>{format(selectedDate, "EEE, MMM d")}</span>
          </div>
          <button
            onClick={() => handleDateChange("next")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronRight
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </button>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    No students found. Enroll students first to mark attendance.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const status = getStatus(student.id);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {student.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              Grade {student.grade}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {status ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              status === "present"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : status === "absent"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            }`}
                          >
                            {status}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">
                            Not Marked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() =>
                              markAttendance(student.id, "present")
                            }
                            className={`p-2 rounded-xl border transition-all ${
                              status === "present"
                                ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-green-500 hover:text-green-500"
                            }`}
                            title="Present"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, "absent")}
                            className={`p-2 rounded-xl border transition-all ${
                              status === "absent"
                                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-red-500 hover:text-red-500"
                            }`}
                            title="Absent"
                          >
                            <XCircle size={20} />
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, "late")}
                            className={`p-2 rounded-xl border transition-all ${
                              status === "late"
                                ? "bg-yellow-600 border-yellow-600 text-white shadow-lg shadow-yellow-600/20"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-yellow-500 hover:text-yellow-500"
                            }`}
                            title="Late"
                          >
                            <Clock size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
