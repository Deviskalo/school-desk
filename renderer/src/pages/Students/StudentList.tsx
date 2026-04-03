import React, { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";

const StudentList: React.FC = () => {
  const { students, loading, addStudent } = useStudents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    grade: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const sendInvite = (
        document.getElementById("sendInvite") as HTMLInputElement
      )?.checked;
      await addStudent(newStudent, sendInvite);
      setShowAddModal(false);
      setNewStudent({ name: "", email: "", grade: "" });
    } catch (error) {
      console.error("Failed to save student:", error);
      alert("Failed to save student. Please check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
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
            Student Management
          </h2>
          <p className="text-slate-500 mt-1">
            View and manage all enrolled students
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span className="font-bold">Add Student</span>
        </button>
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
              placeholder="Search by name, email or grade..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Filter size={20} />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    No students found. Click "Add Student" to get started.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {student.email || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400">
                        Grade {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-blue-500 transition-colors">
                        <MoreVertical size={18} />
                      </button>
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
              Enrol New Student
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  Grade / Class
                </label>
                <input
                  type="text"
                  required
                  value={newStudent.grade}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, grade: e.target.value })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  placeholder="10A"
                />
              </div>
              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="sendInvite"
                  defaultChecked
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-100 dark:bg-slate-800 border-none"
                />
                <label
                  htmlFor="sendInvite"
                  className="text-sm text-slate-600 dark:text-slate-400 font-medium"
                >
                  Send email invitation immediately
                </label>
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
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
