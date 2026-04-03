import React from "react";
import { Users, ClipboardCheck, BookOpen, AlertCircle } from "lucide-react";
import { useAssignments } from "../../hooks/useAssignments";
import { useStudents } from "../../hooks/useStudents";
import { useSubmissions } from "../../hooks/useSubmissions";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { students } = useStudents();
  const { submissions } = useSubmissions();

  const getPendingCount = (assignmentId: string) => {
    const submittedCount = submissions.filter(
      (s) => s.assignmentId === assignmentId,
    ).length;
    return Math.max(0, students.length - submittedCount);
  };

  const actions = [
    {
      name: "Mark Attendance",
      icon: ClipboardCheck,
      color: "bg-green-500",
      path: "/attendance",
    },
    {
      name: "Grade Students",
      icon: BookOpen,
      color: "bg-blue-500",
      path: "/grades",
    },
    {
      name: "Manage Assignments",
      icon: Users,
      color: "bg-purple-500",
      path: "/assignments",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Teacher Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Manage your classes and students
          </p>
        </div>
        <div className="flex space-x-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors text-slate-600 dark:text-slate-300"
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{action.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            Pending Assignments
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {assignmentsLoading ? (
              <div className="text-sm text-slate-400 italic">Loading...</div>
            ) : assignments.length === 0 ? (
              <div className="text-sm text-slate-400 italic">
                No active assignments.
              </div>
            ) : (
              assignments.slice(0, 5).map((assignment) => {
                const pending = getPendingCount(assignment.id);
                return (
                  <div
                    key={assignment.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      pending > 0
                        ? "bg-red-50 dark:bg-red-900/10 border-red-500/20"
                        : "bg-green-50 dark:bg-green-900/10 border-green-500/20"
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-3 ${
                        pending > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {pending > 0 ? (
                        <AlertCircle size={18} />
                      ) : (
                        <ClipboardCheck size={18} />
                      )}
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {assignment.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        pending > 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {pending > 0 ? `${pending} Pending` : "Complete"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass p-6 rounded-3xl shadow-sm col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            Class Performance
          </h3>
          <div className="h-48 flex items-end space-x-4 px-4 pb-4">
            {/* Simple Dynamic Performance Bar Chart */}
            {[75, 82, 90, 65, 88, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500/20 hover:bg-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[10px] text-slate-400 mt-2 font-bold">
                  G{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
