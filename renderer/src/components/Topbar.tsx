import React from "react";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Topbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search students, assignments, grades..."
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium capitalize">
              {user?.prefs?.role || "Guest"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border-2 border-white dark:border-slate-900 shadow-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
