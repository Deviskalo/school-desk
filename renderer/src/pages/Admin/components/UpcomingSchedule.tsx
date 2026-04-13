import React from "react";
import { useTimetable } from "../../../hooks/useTimetable";
import { Clock, MapPin, User, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export const UpcomingSchedule: React.FC = () => {
  const { timetable, loading } = useTimetable();
  const today = format(new Date(), "EEEE");
  const now = format(new Date(), "HH:mm");

  // Filter for today's classes that haven't ended yet
  const upcoming = timetable
    .filter((item) => item.day === today && item.endTime > now)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  return (
    <div className="glass p-8 rounded-4xl shadow-sm border border-white/10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Live Schedule
        </h3>
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
          {today}
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            Syncing schedule...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                No more classes today
              </p>
              <p className="text-xs text-slate-400 mt-1">
                All sessions concluded or none scheduled.
              </p>
            </div>
          </div>
        ) : (
          upcoming.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-white/50 dark:bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[120px]">
                    {session.subject}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-500">
                  {session.startTime} - {session.endTime}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-medium">
                <div className="flex items-center space-x-1">
                  <MapPin size={12} className="text-slate-300" />
                  <span>{session.room}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User size={12} className="text-slate-300" />
                  <span className="truncate">
                    {session.teacherName || "Staff"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {upcoming.length > 0 && (
        <button className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center space-x-2 group">
          <span>View Full Timetable</span>
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      )}
    </div>
  );
};
