import React from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Calendar,
  Bell,
} from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { useTeachers } from "../../hooks/useTeachers";
import { useGrades } from "../../hooks/useGrades";
import { useTimetable } from "../../hooks/useTimetable";
import { useRecentActivities } from "../../hooks/useRecentActivities";
import { useAuthStore } from "../../store/useAuthStore";
import { format, formatDistanceToNow } from "date-fns";

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { grades } = useGrades();
  const { timetable, addTimetableEntry } = useTimetable();
  const { activities, loading: activitiesLoading } = useRecentActivities(5);

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
      trend: "+12% from last month",
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
      value: "94.2%",
      icon: TrendingUp,
      color: "bg-green-600",
      trend: "High performance",
    },
    {
      name: "Academic Records",
      value: grades.length.toString(),
      icon: GraduationCap,
      color: "bg-orange-600",
      trend: "50 updated today",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <div className="flex items-center space-x-3 text-slate-500 mt-2 font-medium">
            <Calendar size={18} className="text-blue-500" />
            <span>{format(new Date(), "EEEE, MMMM do")} • Semester 2</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Trends */}
        <div className="lg:col-span-2 glass p-8 rounded-4xl shadow-sm flex flex-col border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Attendance Trends
              </h3>
              <p className="text-sm text-slate-500">
                Weekly system-wide engagement
              </p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                Week
              </button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500">
                Month
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-end space-x-3 pb-2 min-h-[200px]">
            {[45, 60, 55, 80, 70, 90, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className="w-full bg-blue-600/10 group-hover:bg-blue-600/20 transition-all rounded-2xl relative flex items-end"
                  style={{ height: `100%` }}
                >
                  <div
                    className="w-full bg-blue-600 rounded-2xl transition-all duration-700 ease-out shadow-lg shadow-blue-600/10 group-hover:shadow-blue-600/30"
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 font-bold border border-white/10 shadow-xl">
                    {h}%
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass p-8 rounded-4xl shadow-sm flex flex-col border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Recent Feed
            </h3>
            <button className="text-blue-600 hover:text-blue-500 text-xs font-bold uppercase tracking-widest">
              View All
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            {activitiesLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Gathering updates...
              </div>
            ) : activities.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic py-8">
                Quiet today. No activities found.
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-center space-x-4 p-4 hover:bg-white/50 dark:hover:bg-white/5 rounded-3xl transition-all border border-transparent hover:border-white/10 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      activity.type === "student"
                        ? "bg-blue-500 shadow-blue-500/20"
                        : activity.type === "teacher"
                          ? "bg-purple-500 shadow-purple-500/20"
                          : activity.type === "grade"
                            ? "bg-green-500 shadow-green-500/20"
                            : "bg-orange-500 shadow-orange-500/20"
                    }`}
                  >
                    <TrendingUp size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {activity.subtitle}
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
  );
};

export default AdminDashboard;
