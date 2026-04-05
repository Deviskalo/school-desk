import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  GraduationCap,
} from "lucide-react";
import { useAssignments } from "../../hooks/useAssignments";
import { useSubmissions } from "../../hooks/useSubmissions";
import { useStudents } from "../../hooks/useStudents";
import { useGrades } from "../../hooks/useGrades";
import { useAuthStore } from "../../store/useAuthStore";
import { ROLES } from "@shared/constants";
import { format } from "date-fns";

const AssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = (user?.prefs as any)?.role || ROLES.STUDENT;
  const studentId = (user?.prefs as any)?.studentId;

  const { assignments, loading: assignmentsLoading } = useAssignments();
  const {
    submissions,
    loading: submissionsLoading,
    submitAssignment,
    updateSubmission,
  } = useSubmissions(role === ROLES.STUDENT ? undefined : id);
  const { students } = useStudents();
  const { addGrade } = useGrades();

  const [assignment, setAssignment] = useState<any>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assignments.length > 0 && id) {
      const found = assignments.find((a) => a.id === id);
      setAssignment(found);
    }
  }, [assignments, id]);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionContent.trim()) return;
    setIsSubmitting(true);
    try {
      await submitAssignment({
        assignmentId: id,
        studentId: studentId || "guest",
        content: submissionContent,
        submittedAt: Date.now(),
      });
      setSubmissionContent("");
      alert("Assignment submitted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeValue || !selectedSubmission) return;

    try {
      await addGrade({
        studentId: selectedSubmission.studentId,
        subject: assignment.subject,
        grade: gradeValue,
        date: format(new Date(), "yyyy-MM-dd"),
        comment: "Graded via Assignment Submission",
      });
      // Also update the submission itself
      await updateSubmission(selectedSubmission.id, {
        grade: gradeValue,
        feedback: "Graded via Submission Interface",
      });
      alert("Grade recorded successfully!");
      setSelectedSubmission(null);
      setGradeValue("");
    } catch (err) {
      console.error(err);
    }
  };

  if (assignmentsLoading || !assignment) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const mySubmission =
    role === ROLES.STUDENT
      ? submissions.find(
          (s) => s.assignmentId === id && s.studentId === studentId,
        )
      : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Navigation */}
      <button
        onClick={() => navigate("/assignments")}
        className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} />
        <span>Back to Assignments</span>
      </button>

      {/* Hero Section */}
      <div className="glass p-8 md:p-12 rounded-4xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FileText size={120} className="text-blue-500 rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {assignment.subject}
            </span>
            <div className="flex items-center text-slate-500 text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-800 px-3 py-1 rounded-lg">
              <Clock size={14} className="mr-2" />
              Due: {assignment.dueDate}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            {assignment.title}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {assignment.description ||
              "No detailed description available for this assignment."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interface Content */}
        <div className="lg:col-span-2">
          {role === ROLES.STUDENT ? (
            <div className="space-y-8">
              {mySubmission ? (
                <div className="glass p-8 rounded-4xl border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Work Submitted
                      </h3>
                      <p className="text-sm text-slate-500">
                        Submitted on{" "}
                        {format(mySubmission.submittedAt, "MMM do, h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {mySubmission.content}
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleStudentSubmit}
                  className="glass p-8 rounded-4xl border border-white/10 space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Send size={20} className="text-blue-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Post Your Submission
                    </h3>
                  </div>

                  <textarea
                    required
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Write your response or observations here..."
                    className="w-full h-64 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-6 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  />

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm flex items-center justify-center space-x-3"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    <span>Submit Work</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Teacher Submission List View */
            <div className="space-y-8">
              <div className="glass p-8 rounded-4xl border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <User className="mr-3 text-blue-500" size={24} />
                    Class Submissions
                  </h3>
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {submissions.length} / {students.length} Submitted
                  </span>
                </div>

                <div className="space-y-4">
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic">
                      No submissions yet for this assignment.
                    </div>
                  ) : (
                    submissions.map((sub) => {
                      const student = students.find(
                        (s) => s.id === sub.studentId,
                      );
                      return (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSubmission(sub)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                            selectedSubmission?.id === sub.id
                              ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20"
                              : "bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-blue-500"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                selectedSubmission?.id === sub.id
                                  ? "bg-white/20"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                              }`}
                            >
                              {student?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-bold">
                                {student?.name || "Unknown Student"}
                              </p>
                              <p
                                className={`text-[10px] uppercase font-black tracking-widest mt-0.5 ${
                                  selectedSubmission?.id === sub.id
                                    ? "text-blue-100"
                                    : "text-slate-500"
                                }`}
                              >
                                {format(sub.submittedAt, "MMM do, h:mm a")}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className={
                              selectedSubmission?.id === sub.id
                                ? "text-white"
                                : "text-slate-300"
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          {role === ROLES.TEACHER && selectedSubmission ? (
            <form
              onSubmit={handleTeacherGrade}
              className="glass p-8 rounded-4xl border border-blue-500/20 shadow-2xl shadow-blue-500/5 sticky top-8 animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap size={24} className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Grade Submission
                </h3>
              </div>

              <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                  Student Content
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{selectedSubmission.content}"
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest pl-1">
                    Assign Grade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A+, 95, 4.0..."
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-4 px-6 text-slate-900 dark:text-white font-bold ring-offset-4 ring-offset-white dark:ring-offset-slate-900 focus:ring-4 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  Confirm & Publish Grade
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
                >
                  Cancel Review
                </button>
              </div>
            </form>
          ) : (
            <div className="glass p-8 rounded-4xl border border-white/10 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-6">
                Submission Guidelines
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle
                    size={16}
                    className="text-orange-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Late submissions may incur a grade penalty according to
                    department policy.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2
                    size={16}
                    className="text-green-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ensure all academic citations are provided in APA format
                    where applicable.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Teacher in Charge
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase">
                    PC
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    Prof. Channing
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChevronRight: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 20,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default AssignmentDetail;
