import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssignments } from "../../hooks/useAssignments";
import { useTeachers } from "../../hooks/useTeachers";
import { Plus, Clock } from "lucide-react";

const AssignmentList: React.FC = () => {
  const {
    assignments,
    loading: assignmentsLoading,
    addAssignment,
  } = useAssignments();
  const navigate = useNavigate();
  const { teachers, loading: teachersLoading } = useTeachers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    teacherId: "",
    subject: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAssignment(newAssignment);
    setShowAddModal(false);
    setNewAssignment({
      title: "",
      description: "",
      dueDate: "",
      teacherId: "",
      subject: "",
    });
  };

  const getTeacherName = (id: string) => {
    return teachers.find((t) => t.id === id)?.name || "Unknown Teacher";
  };

  if (assignmentsLoading || teachersLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Assignments
          </h2>
          <p className="text-slate-500 mt-1">
            Create and track student coursework
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span className="font-bold">New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full py-12 text-center glass rounded-3xl text-slate-400 italic">
            No assignments found. Start by creating one!
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="glass p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl text-xs font-bold uppercase tracking-wider">
                  {assignment.subject || "General"}
                </div>
                <div className="flex items-center text-slate-400 text-xs">
                  <Clock size={14} className="mr-1" />
                  <span>Due: {assignment.dueDate || "No date"}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {assignment.title}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {assignment.description || "No description provided."}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold">
                    {getTeacherName(assignment.teacherId).charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {getTeacherName(assignment.teacherId)}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                  className="text-orange-600 hover:text-orange-500 text-xs font-bold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass max-w-lg w-full p-8 rounded-3xl shadow-2xl relative">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Create Assignment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                    placeholder="Midterm Essay"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newAssignment.description}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none resize-none"
                    placeholder="Instructions for the students..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.subject}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        subject: e.target.value,
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                    placeholder="English"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Assigning Teacher
                  </label>
                  <select
                    required
                    value={newAssignment.teacherId}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        teacherId: e.target.value,
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  >
                    <option value="">Select a teacher...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subject})
                      </option>
                    ))}
                  </select>
                </div>
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
                  className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
