import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Key,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MonitorSmartphone,
} from "lucide-react";

const ActivateAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for detection
  const isElectron = !!(window as any).electronAPI;

  // Form State
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Process State
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);

  // Auto-verify if params are present and in Electron
  useEffect(() => {
    if (isElectron && email && token && !inviteData && !error) {
      handleVerify();
    }
  }, [isElectron]);

  const handleVerify = async () => {
    if (!email || !token) {
      setError("Please enter both your email and activation code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await (window as any).electronAPI.verifyActivation({
        email,
        token,
      });
      if (result.success) {
        setInviteData(result);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error("IPC Verification Error:", err);
      setError(
        `Connection Error: ${err.message || "Could not reach background process."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const result = await (window as any).electronAPI.activateUser({
        email,
        password,
        name: inviteData.data.name,
        role: inviteData.role,
        id: inviteData.data.id,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to activate account.");
    } finally {
      setVerifying(false);
    }
  };

  if (!isElectron) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="max-w-md w-full glass p-10 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/20 rounded-full mb-2">
            <MonitorSmartphone size={40} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Open in SchoolDesk
          </h1>
          <p className="text-slate-400 leading-relaxed text-lg">
            This activation page requires the **SchoolDesk Desktop App** to
            verify your account securely.
          </p>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <p className="text-sm text-slate-300 font-medium">
              Steps to activate:
            </p>
            <ol className="text-sm text-slate-400 space-y-3 list-decimal list-inside">
              <li>Open the SchoolDesk app on your computer.</li>
              <li>Go to the Login screen.</li>
              <li>Click "Activate Account" at the bottom.</li>
              <li>Enter your email and code from the invitation.</li>
            </ol>
          </div>
          <p className="text-xs text-slate-500 italic">
            Your activation code is waiting in your email inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Account Activation
          </h1>
          {inviteData ? (
            <p className="text-green-400 mt-2 font-medium animate-pulse">
              ✓ Ready to activate: {inviteData.data.name}
            </p>
          ) : (
            <p className="text-slate-400 mt-2">
              Enter your invitation details to begin
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start space-x-3 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="shrink-0" size={18} />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
              <CheckCircle2 size={48} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">All Set!</h2>
            <p className="text-slate-400 leading-relaxed">
              Your account has been activated successfully. We're redirecting
              you to the login page...
            </p>
          </div>
        ) : !inviteData ? (
          /* Step 1: Verify Email & Token */
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <Key
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Activation Code"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all tracking-widest font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Verify Invitation"
              )}
            </button>

            <p className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-slate-500 hover:text-slate-400 text-sm"
              >
                Back to Login
              </button>
            </p>
          </div>
        ) : (
          /* Step 2: Set Password */
          <form onSubmit={handleActivate} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Key
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Set password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <Key
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {verifying ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Complete Activation"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-slate-500 text-xs mt-8">
          Powered by SchoolDesk Security
        </p>
      </div>
    </div>
  );
};

export default ActivateAccount;
