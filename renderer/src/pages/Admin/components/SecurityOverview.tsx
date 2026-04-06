import React from "react";
import { useSystemHealth } from "../../../hooks/useSystemHealth";
import {
  ShieldAlert,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const SecurityOverview: React.FC = () => {
  const { stats, status, forceSync } = useSystemHealth();

  const getStatusColor = (s: string) => {
    switch (s) {
      case "synced":
        return "text-green-500";
      case "syncing":
        return "text-blue-500 animate-spin";
      case "error":
        return "text-red-500";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="glass p-8 rounded-4xl border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Security & Health
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
              System Monitor v3.0
            </p>
          </div>
        </div>
        <button
          onClick={forceSync}
          disabled={status === "syncing"}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-colors disabled:opacity-50"
          title="Force Sync"
        >
          <RefreshCcw
            size={18}
            className={status === "syncing" ? "animate-spin" : ""}
          />
        </button>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {/* Overall Status */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Sync Status
            </span>
            <div
              className={`flex items-center space-x-1.5 text-xs font-bold ${getStatusColor(status)}`}
            >
              {status === "synced" && <CheckCircle2 size={12} />}
              {status === "error" && <AlertTriangle size={12} />}
              <span className="capitalize">{status}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Last seen:{" "}
            {stats.lastSyncTime
              ? formatDistanceToNow(stats.lastSyncTime, { addSuffix: true })
              : "Never"}
          </p>
        </div>

        {/* Collection Breakdown */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-1">
            Active Streams
          </p>
          {Object.entries(stats.collections).map(([name, data]) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Database
                  size={14}
                  className="text-slate-400 group-hover:text-blue-500 transition-colors"
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">
                  {name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-[10px] font-black text-blue-500">
                  <ArrowUpRight size={10} />
                  <span>{data.lastPushCount}</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] font-black text-purple-500">
                  <ArrowDownLeft size={10} />
                  <span>{data.lastPullCount}</span>
                </div>
                {data.lastError && (
                  <div className="text-red-500" title={data.lastError}>
                    <AlertTriangle size={12} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Active Connections</span>
          <span className="text-green-500">Stable</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-green-500 h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        </div>
      </div>
    </div>
  );
};
