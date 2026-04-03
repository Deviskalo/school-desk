import React, { useState } from "react";
import { useGrades } from "../../hooks/useGrades";
import { useStudents } from "../../hooks/useStudents";
import { Plus, Search, Filter, TrendingUp, BookOpen } from "lucide-react";

const GradeList: React.FC = () => {
  const { grades, loading: gradesLoading, addGrade } = useGrades();
  const { students, loading: studentsLoading } = useStudents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    subject: "",
    grade: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGrade(newGrade);
    setShowAddModal(false);
    setNewGrade({ studentId: "", subject: "", grade: "" });
  };

  const calculateGPA = () => {
    if (grades.length === 0) return "0.00";
    const total = grades.reduce((sum, g) => {
      const val = parseFloat(g.grade);
      if (!isNaN(val)) return sum + val;
      // Map letter grades if necessary
      const map: Record<string, number> = {
        A: 4.0,
        B: 3.0,
        C: 2.0,
        D: 1.0,
        F: 0.0,
      };
      return sum + (map[g.grade.toUpperCase()] || 0);
    }, 0);
    return (total / grades.length).toFixed(2);
  };

  const getStudentName = (id: string) => {
    return students.find((s) => s.id === id)?.name || "Unknown Student";
  };

  if (gradesLoading || studentsLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Grades & GPA
          </h2>
          <p className="text-slate-500 mt-1">
            Track student academic performance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span className="font-bold">Record Grade</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Average GPA</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {calculateGPA()}
              </p>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Records
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {grades.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search grades..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Date Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {grades.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    No grade records found.
                  </td>
                </tr>
              ) : (
                grades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {getStudentName(grade.studentId)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {grade.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {grade.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass max-w-md w-full p-8 rounded-3xl shadow-2xl relative">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Record Grade
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Select Student
                </label>
                <select
                  required
                  value={newGrade.studentId}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, studentId: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                >
                  <option value="">Select a student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={newGrade.subject}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, subject: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  placeholder="Biology"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Grade (e.g. A, 95, 4.0)
                </label>
                <input
                  type="text"
                  required
                  value={newGrade.grade}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, grade: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  placeholder="A"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-500 transition-colors"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeList;
