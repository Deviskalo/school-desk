import React from "react";
import {
  Home,
  Users,
  UserCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  LogOut,
  UserPlus,
  Cloud,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSyncStatus } from "../hooks/useSyncStatus";
import { ROLES } from "@shared/constants";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const role = (user?.prefs as any)?.role || ROLES.STUDENT;

  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
      roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    },
    {
      name: "Students",
      icon: Users,
      path: "/students",
      roles: [ROLES.ADMIN, ROLES.TEACHER],
    },
    {
      name: "Users",
      icon: UserPlus,
      path: "/users",
      roles: [ROLES.ADMIN],
    },
    {
      name: "Teachers",
      icon: UserCheck,
      path: "/teachers",
      roles: [ROLES.ADMIN],
    },
    {
      name: "Attendance",
      icon: Calendar,
      path: "/attendance",
      roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    },
    {
      name: "Grades",
      icon: GraduationCap,
      path: "/grades",
      roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    },
    {
      name: "Assignments",
      icon: BookOpen,
      path: "/assignments",
      roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-1">
          <img
            src="/logo.png"
            alt="SchoolDesk Logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">
            SchoolDesk
          </h1>
        </div>
        <p className="text-slate-200 text-xs font-semibold uppercase tracking-widest pl-11">
          {role}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* Sync Status */}
        <SyncIndicator />

        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3 w-full rounded-lg text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const SyncIndicator: React.FC = () => {
  const status = useSyncStatus();

  const configs = {
    synced: {
      icon: Cloud,
      text: "Cloud Synced",
      color: "text-green-400",
      bg: "bg-green-500/10",
      animate: "",
    },
    syncing: {
      icon: RefreshCw,
      text: "Syncing Data...",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      animate: "animate-spin",
    },
    error: {
      icon: CloudOff,
      text: "App Offline",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      animate: "",
    },
  };

  const { icon: Icon, text, color, bg, animate } = configs[status];

  return (
    <div
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border border-slate-800 ${bg} transition-all duration-500`}
    >
      <Icon size={18} className={`${color} ${animate}`} />
      <div className="flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${color}`}
        >
          {text}
        </p>
        <p className="text-[9px] text-slate-500 font-medium">
          Auto-backup active
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
