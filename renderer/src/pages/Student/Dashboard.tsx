import React from "react";
import { BookOpen, Clock } from "lucide-react";

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, Student!
        </h2>
        <p className="text-slate-500 mt-1">
          Here's an overview of your academic progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Upcoming Assignments
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Chemistry Quiz: Periodic Table
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center mt-1">
                        <Clock size={12} className="mr-1" /> Due in 2 days
                      </p>
                    </div>
                  </div>
                  <button className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800">
                    Submit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Current Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">
                    Academic GPA
                  </span>
                  <span className="text-blue-600 font-bold">3.8 / 4.0</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">
                    Attendance Rate
                  </span>
                  <span className="text-green-600 font-bold">98%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: "98%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl shadow-sm text-center">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Connect with your teachers or access study resources.
            </p>
            <button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3 rounded-xl transition-transform active:scale-95">
              Contact Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
