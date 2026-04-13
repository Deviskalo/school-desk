import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Users,
  GraduationCap,
  CheckCircle,
  Mail,
  Plus,
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Student",
      icon: UserPlus,
      onClick: () => navigate("/students"), // In a real app, this might open a modal
      color: "bg-blue-500",
      description: "Enroll a new student",
    },
    {
      label: "Add Teacher",
      icon: Users,
      onClick: () => navigate("/users"),
      color: "bg-purple-500",
      description: "Onboard a staff member",
    },
    {
      label: "Record Grade",
      icon: GraduationCap,
      onClick: () => navigate("/grades"),
      color: "bg-green-500",
      description: "Post academic results",
    },
    {
      label: "Mark Attendance",
      icon: CheckCircle,
      onClick: () => navigate("/attendance"),
      color: "bg-amber-500",
      description: "Take class roll call",
    },
    {
      label: "Invite User",
      icon: Mail,
      onClick: () => navigate("/users"),
      color: "bg-rose-500",
      description: "Send portal access email",
    },
  ];

  return (
    <div className="glass p-8 rounded-4xl shadow-sm border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Quick Actions
        </h3>
        <Plus size={20} className="text-slate-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center text-center p-4 rounded-3xl hover:bg-white/50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group active:scale-95"
            >
              <div
                className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon size={24} />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                {action.label}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
