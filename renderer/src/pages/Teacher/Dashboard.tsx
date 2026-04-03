import React from "react";
import { Users, ClipboardCheck, BookOpen, AlertCircle } from "lucide-react";

const TeacherDashboard: React.FC = () => {
  const actions = [
    { name: "Mark Attendance", icon: ClipboardCheck, color: "bg-green-500" },
    { name: "Grade Students", icon: BookOpen, color: "bg-blue-500" },
    { name: "Manage Assignments", icon: Users, color: "bg-purple-500" },
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
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-500/20">
              <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Math Homework #4</span>
              </div>
              <span className="text-xs font-bold text-red-500">12 Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                <BookOpen size={18} />
                <span className="text-sm font-medium">Physics Lab Report</span>
              </div>
              <span className="text-xs font-bold text-blue-500">8 Pending</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl shadow-sm col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            Class Performance
          </h3>
          <div className="h-48 flex items-center justify-center text-slate-400 italic">
            Performance chart will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
