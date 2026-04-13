import React from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Calendar,
  Bell,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  Globe,
  Search,
  ArrowRight,
} from "lucide-react";
import { QuickActions } from "./components/QuickActions";
import { UpcomingSchedule } from "./components/UpcomingSchedule";

import { useSchoolSettings } from "../../hooks/useSchoolSettings";
import { useStudents } from "../../hooks/useStudents";
import { useTeachers } from "../../hooks/useTeachers";
import { useGrades } from "../../hooks/useGrades";
import { useTimetable } from "../../hooks/useTimetable";
import { useRecentActivities } from "../../hooks/useRecentActivities";
import { format, formatDistanceToNow } from "date-fns";
import { SecurityOverview } from "./components/SecurityOverview";
import { useAuthStore } from "@/store/useAuthStore";
import { useAnalytics } from "../../hooks/useAnalytics";

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { grades } = useGrades();
  const { timetable, addTimetableEntry } = useTimetable();
  const { activities, loading: activitiesLoading } = useRecentActivities(5);
  const {
    attendanceTrend,
    gradeDistribution,
    enrollmentStats,
    loading: analyticsLoading,
  } = useAnalytics();
  const { settings } = useSchoolSettings();

  const seedTimetable = async () => {
    if (teachers.length === 0) {
      alert("Please ensure at least one teacher exists before seeding.");
      return;
    }

    const sampleClasses = [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        subject: "Advanced Chemistry",
        room: "Lab 302",
        grade: "12-A",
      },
      {
        day: "Monday",
        startTime: "11:00",
        endTime: "12:30",
        subject: "World History",
        room: "Room 101",
        grade: "12-A",
      },
      {
        day: "Tuesday",
        startTime: "10:00",
        endTime: "12:00",
        subject: "Physics Lab",
        room: "Lab 4",
        grade: "12-A",
      },
      {
        day: "Wednesday",
        startTime: "09:00",
        endTime: "10:30",
        subject: "Advanced Chemistry",
        room: "Lab 302",
        grade: "12-A",
      },
      {
        day: "Thursday",
        startTime: "13:00",
        endTime: "14:30",
        subject: "Mathematics",
        room: "Room 205",
        grade: "12-A",
      },
      {
        day: "Friday",
        startTime: "14:00",
        endTime: "15:30",
        subject: "Sports",
        room: "Main Gym",
        grade: "12-A",
      },
    ];

    try {
      for (const cls of sampleClasses) {
        await addTimetableEntry({
          ...cls,
          teacherId: teachers[0].id,
          teacherName: teachers[0].name,
        });
      }
      alert(
        "Timetable seeded successfully! Check the teacher and student dashboards.",
      );
    } catch (err) {
      console.error(err);
      alert("Failed to seed data.");
    }
  };

  const stats = [
    {
      name: "Total Students",
      value: students.length.toString(),
      icon: Users,
      color: "bg-blue-600",
      trend: `${enrollmentStats.invited} pending invitations`,
    },
    {
      name: "Total Teachers",
      value: teachers.length.toString(),
      icon: UserCheck,
      color: "bg-purple-600",
      trend: "All sessions active",
    },
    {
      name: "Attendance Rate",
      value: attendanceTrend.some((t) => t.rate > 0)
        ? `${Math.round(attendanceTrend.reduce((acc, curr) => acc + curr.rate, 0) / (attendanceTrend.filter((t) => t.rate > 0).length || 1))}%`
        : "N/A",
      icon: TrendingUp,
      color: "bg-green-600",
      trend: "System average",
    },
    {
      name: "Academic Records",
      value: grades.length.toString(),
      icon: GraduationCap,
      color: "bg-orange-600",
      trend: `${gradeDistribution.length} grade levels`,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="lg:col-span-3 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <div className="flex items-center space-x-3 text-slate-500 mt-2 font-medium">
            <Calendar size={18} className="text-blue-500" />
            <span>{format(new Date(), "EEEE, MMMM do")} • Semester 2</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students, teachers, or classes..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={seedTimetable}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm text-xs font-bold uppercase tracking-widest"
          >
            Seed Demo Timetable
          </button>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
            <Bell size={20} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center space-x-2">
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="glass p-6 rounded-4xl shadow-sm hover:shadow-md transition-all border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid Body */}
      {/* Column 1: Security & Health + Quick Enrollment */}
      <div className="lg:col-span-1 space-y-8">
        <SecurityOverview />

        {/* Enrollment Breakdown */}
        <div className="glass p-8 rounded-4xl shadow-sm flex flex-col border border-white/10 shrink-0">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Enrollment
            </h3>
            <p className="text-sm text-slate-500">Student enrollment status</p>
          </div>
          <div className="space-y-4">
            {analyticsLoading ? (
              <div className="text-slate-400 text-xs italic text-center">
                Loading...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">
                      Active Students
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {enrollmentStats.active}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <Users size={24} className="text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                      Pending Invitations
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {enrollmentStats.invited}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <Bell size={24} className="text-amber-500" />
                  </div>
                </div>
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Total enrolled:{" "}
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      {students.length}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Institution Profile Widget */}
        <div className="glass p-8 rounded-4xl shadow-sm border border-white/10 shrink-0">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Institution Profile
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Address
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium wrap-break-word">
                  {settings.address || "No address set"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-purple-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Phone
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {settings.phone || "No phone set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2 & 3 Area */}
      <div className="lg:col-span-2 space-y-8">
        {/* Row: Quick Actions & Live Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <QuickActions />
          <UpcomingSchedule />
        </div>

        {/* Attendance Trends */}
        <div className="glass p-8 rounded-4xl shadow-sm flex flex-col border border-white/10 h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Attendance Trends
              </h3>
              <p className="text-sm text-slate-500">
                Weekly school-wide participation
              </p>
            </div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
              This Week
            </span>
          </div>

          <div className="flex-1 flex items-end space-x-3 pb-2">
            {analyticsLoading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">
                Calculating...
              </div>
            ) : attendanceTrend.every((t) => t.rate === 0) ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">
                No records.
              </div>
            ) : (
              attendanceTrend.map((data, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-[9px] text-slate-400 mb-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(data.rate)}%
                  </span>
                  <div className="w-full bg-blue-600/10 group-hover:bg-blue-600/20 transition-all rounded-xl relative flex items-end overflow-hidden h-[160px]">
                    <div
                      className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-xl transition-all duration-700 shadow-lg shadow-blue-600/10"
                      style={{ height: `${data.rate}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                    {data.day}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Row: Grade Distribution & Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Grade Distribution */}
          <div className="glass p-8 rounded-4xl shadow-sm flex flex-col border border-white/10 min-h-[300px]">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Grade Distribution
              </h3>
              <p className="text-sm text-slate-500">Academic performance</p>
            </div>
            <div className="flex-1 space-y-3">
              {analyticsLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                  Loading...
                </div>
              ) : gradeDistribution.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-8">
                  No grades yet.
                </div>
              ) : (
                gradeDistribution.slice(0, 6).map((item, i) => {
                  const maxCount = gradeDistribution[0].count;
                  const pct = Math.round((item.count / maxCount) * 100);
                  const colors = [
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-green-500",
                    "bg-amber-500",
                    "bg-red-500",
                    "bg-cyan-500",
                  ];
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {item.label}
                        </span>
                        <span className="text-slate-400">
                          {item.count} records
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="glass p-8 rounded-4xl shadow-sm flex flex-col border border-white/10 min-h-[300px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Recent Feed
              </h3>
              <button className="text-blue-600 hover:text-blue-500 text-xs font-bold uppercase tracking-widest">
                View All
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 h-[300px]">
              {activitiesLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                  Gathering...
                </div>
              ) : activities.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic py-8">
                  Quiet today.
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-center space-x-4 p-4 hover:bg-white/50 dark:hover:bg-white/5 rounded-3xl transition-all border border-transparent hover:border-white/10 group"
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${activity.type === "student" ? "bg-blue-500 shadow-blue-500/20" : activity.type === "teacher" ? "bg-purple-500 shadow-purple-500/20" : activity.type === "grade" ? "bg-green-500 shadow-green-500/20" : activity.type === "security" ? "bg-slate-900 shadow-slate-900/20" : "bg-orange-500 shadow-orange-500/20"}`}
                    >
                      {activity.type === "security" ? (
                        <ShieldAlert size={16} className="text-blue-500" />
                      ) : (
                        <TrendingUp size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${activity.type === "security" ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-white"}`}
                      >
                        {activity.title}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                        {formatDistanceToNow(activity.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
