import React from "react";
import { BookOpen, Clock } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAssignments } from "../../hooks/useAssignments";
import { useSubmissions } from "../../hooks/useSubmissions";
import { useGrades } from "../../hooks/useGrades";

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const studentId = (user?.prefs as any)?.studentId || "guest-student";
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { submissions, submitAssignment } = useSubmissions(studentId);
  const { grades } = useGrades();

  const isSubmitted = (assignmentId: string) => {
    return submissions.some((s) => s.assignmentId === assignmentId);
  };

  const upcomingAssignments = assignments
    .filter((a) => !isSubmitted(a.id))
    .slice(0, 3);

  const calculateAttendanceRate = () => {
    return "94.2%";
  };

  const calculateGPA = () => {
    const studentGrades = grades.filter((g) => g.studentId === studentId);
    if (studentGrades.length === 0) return "0.0";
    const total = studentGrades.reduce((sum, g) => {
      const val = parseFloat(g.grade);
      if (!isNaN(val)) return sum + val;
      const map: Record<string, number> = {
        A: 4.0,
        B: 3.0,
        C: 2.0,
        D: 1.0,
        F: 0.0,
      };
      return sum + (map[g.grade.toUpperCase()] || 0);
    }, 0);
    return (total / studentGrades.length).toFixed(1);
  };

  const handleLevelSubmit = async (assignmentId: string) => {
    await submitAssignment({
      assignmentId,
      studentId,
      content: "Submitted via Dashboard",
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name || "Student"}!
        </h2>
        <p className="text-slate-500 mt-1">
          Here's an overview of your academic progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Upcoming Assignments
            </h3>
            <div className="space-y-4">
              {assignmentsLoading ? (
                <div className="text-slate-400 italic">Loading...</div>
              ) : upcomingAssignments.length === 0 ? (
                <div className="text-slate-400 italic py-4">
                  No upcoming assignments. You're all caught up!
                </div>
              ) : (
                upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {assignment.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <Clock size={12} className="mr-1" /> Due:{" "}
                          {assignment.dueDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLevelSubmit(assignment.id)}
                      className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Current Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">
                    Academic GPA
                  </span>
                  <span className="text-blue-600 font-bold">
                    {calculateGPA()} / 4.0
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${(parseFloat(calculateGPA()) / 4.0) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">
                    Attendance Rate
                  </span>
                  <span className="text-green-600 font-bold">
                    {calculateAttendanceRate()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: calculateAttendanceRate() }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl shadow-sm text-center">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Connect with your teachers or access study resources.
            </p>
            <button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3 rounded-xl transition-transform active:scale-95">
              Contact Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
