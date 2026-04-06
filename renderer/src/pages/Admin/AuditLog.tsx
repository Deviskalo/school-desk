import React, { useState } from "react";
import {
  Shield,
  Search,
  Filter,
  Clock,
  Download,
  User,
  GraduationCap,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  type Activity,
  useRecentActivities,
} from "../../hooks/useRecentActivities";
import { format } from "date-fns";

const CATEGORIES = [
  { id: "all", label: "All Events", icon: Shield },
  { id: "security", label: "Security", icon: ShieldAlert },
  { id: "student", label: "Students", icon: User },
  { id: "teacher", label: "Teachers", icon: GraduationCap },
  { id: "grade", label: "Grades", icon: Shield },
  { id: "assignment", label: "Assignments", icon: BookOpen },
];

const AuditLog: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { activities, loading } = useRecentActivities(
    null,
    filter === "all" ? undefined : (filter as any),
  );

  const filteredActivities = activities.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Category", "Event", "Details"],
      ...filteredActivities.map((a) => [
        format(a.timestamp, "yyyy-MM-dd HH:mm:ss"),
        a.type,
        a.title,
        a.subtitle,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `schooldesk_audit_log_${new Date().toISOString()}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Audit Log
          </h1>
          <p className="text-slate-400 mt-1">
            Monitor system-wide actions and security events
          </p>
        </div>

        <button
          onClick={exportLogs}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all font-medium"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex overflow-x-auto pb-2 gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all ${
                filter === cat.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              <cat.icon size={16} />
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Main Log View */}
      <div className="glass rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-400 font-medium">
                        Scanning logs...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No activity logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 text-slate-300">
                        <Clock size={14} className="text-slate-500" />
                        <span className="text-sm">
                          {format(activity.timestamp, "MMM d, HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CategoryBadge type={activity.type} />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          activity.type === "security"
                            ? "text-red-400"
                            : "text-slate-200"
                        }`}
                      >
                        {activity.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {activity.subtitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-600 hover:text-blue-400 transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CategoryBadge: React.FC<{ type: Activity["type"] }> = ({ type }) => {
  const configs = {
    security: {
      label: "Security",
      color: "text-red-400 bg-red-400/10 border-red-400/20",
    },
    student: {
      label: "Student",
      color: "text-green-400 bg-green-400/10 border-green-400/20",
    },
    teacher: {
      label: "Teacher",
      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    },
    grade: {
      label: "Academic",
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    },
    assignment: {
      label: "Assignment",
      color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    },
  };

  const config = configs[type] || configs.security;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default AuditLog;
