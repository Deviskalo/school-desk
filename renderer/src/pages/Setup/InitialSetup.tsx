import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  ExternalLink,
  ArrowRight,
  Key,
  ShieldCheck,
  User,
} from "lucide-react";

const steps = [
  {
    id: 1,
    icon: ExternalLink,
    title: "Open the Appwrite Console",
    description:
      'Go to your Appwrite Console and navigate to Auth → Users. Click "Create User" and fill in your admin name, email, and password.',
    action: {
      label: "Open Appwrite Console",
      href: "https://cloud.appwrite.io",
    },
  },
  {
    id: 2,
    icon: User,
    title: "Create Your Admin Account",
    description:
      "Click the newly created user, go to Preferences, and add a new key: role with the value admin.",
    code: `{ "role": "admin" }`,
  },
  {
    id: 3,
    icon: Key,
    title: "Add Your API Key",
    description:
      'In your Appwrite project, go to Settings → API Keys and create a new key with "users.read" and "users.write" scopes. Paste the key into your .env file:',
    code: `VITE_APPWRITE_API_KEY=your_key_here`,
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Restart & Sign In",
    description:
      "Restart the app (to reload environment variables), then sign in with your new admin email and password.",
  },
];

interface InitialSetupProps {
  onSetupComplete: () => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onSetupComplete }) => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const allDone = completedSteps.length === steps.length;

  const openLink = (href: string) => {
    window.open(href, "_blank");
  };

  const handleProceed = () => {
    onSetupComplete();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to SchoolDesk
          </h1>
          <p className="text-slate-300 font-medium mt-2">
            Complete these steps to set up your first admin account
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const done = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`glass rounded-2xl p-5 cursor-pointer transition-all border ${
                  done
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-white/10 hover:border-blue-500/40"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`mt-0.5 shrink-0 transition-colors ${done ? "text-green-400" : "text-slate-400"}`}
                  >
                    {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon
                        size={16}
                        className={done ? "text-green-400" : "text-blue-400"}
                      />
                      <h3
                        className={`font-bold text-sm ${done ? "text-green-300 line-through" : "text-white"}`}
                      >
                        Step {step.id}: {step.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    {step.code && (
                      <pre className="mt-2 bg-slate-900 text-green-400 text-xs rounded-lg px-3 py-2 font-mono overflow-x-auto">
                        {step.code}
                      </pre>
                    )}
                    {step.action && !done && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLink(step.action!.href);
                        }}
                        className="mt-3 inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>{step.action.label}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleProceed}
          disabled={!allDone}
          className={`w-full flex items-center justify-center space-x-2 font-bold py-4 rounded-2xl transition-all ${
            allDone
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>
            {allDone ? "I'm all set — sign in" : "Check all steps to continue"}
          </span>
          {allDone && <ArrowRight size={20} />}
        </button>

        <p className="text-center text-slate-500 text-xs">
          Already have an account?{" "}
          <button
            onClick={handleProceed}
            className="text-blue-400 hover:underline font-medium"
          >
            Sign in now
          </button>
        </p>
      </div>
    </div>
  );
};

export default InitialSetup;
