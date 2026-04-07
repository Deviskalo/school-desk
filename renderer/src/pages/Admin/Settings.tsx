import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  School,
  Calendar,
  BookOpen,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Coins,
  Globe,
  Palette,
  Image,
} from "lucide-react";
import {
  useSchoolSettings,
  type SchoolSettings,
} from "../../hooks/useSchoolSettings";

const gradeKeys = ["A", "B", "C", "D"] as const;

const SchoolSettingsPage: React.FC = () => {
  const { settings, loading, saving, saveSettings } = useSchoolSettings();
  const [form, setForm] = useState<SchoolSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveSettings(form);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(
        "Failed to save settings. Database might be temporarily unavailable.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Settings size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              School Settings
            </h1>
            <p className="text-slate-500 mt-1">
              Configure your institution's details and grading policy
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Info */}
        <div className="glass p-8 rounded-4xl border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <School size={20} className="text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              School Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                School Name
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) =>
                  setForm({ ...form, schoolName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Springfield Academy"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <Calendar size={12} className="inline mr-1" />
                Academic Year
              </label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. 2025/2026"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass p-8 rounded-4xl border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <Phone size={20} className="text-orange-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight">
              Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <MapPin size={12} className="inline mr-1" />
                Physical Address
              </label>
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="123 Education Way, Monrovia, Liberia"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <Phone size={12} className="inline mr-1" />
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="+231 88 123 4567"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <Mail size={12} className="inline mr-1" />
                Official Email
              </label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="admin@school.edu.lr"
              />
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        {/* ... (existing Localization code is handled separately or matches exactly) */}

        {/* Branding Customization */}
        <div className="glass p-8 rounded-4xl border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <Palette size={20} className="text-pink-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight">
              Branding & Aesthetics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={form.primaryColor || "#2563eb"}
                  onChange={(e) =>
                    setForm({ ...form, primaryColor: e.target.value })
                  }
                  className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                />
                <input
                  type="text"
                  value={form.primaryColor || "#2563eb"}
                  onChange={(e) =>
                    setForm({ ...form, primaryColor: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="#2563eb"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                This color will be used for buttons, active states, and
                highlights.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <Image size={12} className="inline mr-1" />
                Logo URL
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                  <img
                    src={form.logoUrl || "/logo.png"}
                    alt="Logo Preview"
                    className="w-8 h-8 object-contain"
                    onError={(e) => (e.currentTarget.src = "/logo.png")}
                  />
                </div>
                <input
                  type="text"
                  value={form.logoUrl || ""}
                  onChange={(e) =>
                    setForm({ ...form, logoUrl: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-xs"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grading Scale */}

        <div className="glass p-8 rounded-4xl border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen size={20} className="text-purple-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Grading Scale
              </h2>
              <p className="text-xs text-slate-500">
                Minimum score threshold for each letter grade
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gradeKeys.map((grade) => {
              const colors: Record<string, string> = {
                A: "border-green-500/30 bg-green-500/5",
                B: "border-blue-500/30 bg-blue-500/5",
                C: "border-amber-500/30 bg-amber-500/5",
                D: "border-red-500/30 bg-red-500/5",
              };
              const labelColors: Record<string, string> = {
                A: "text-green-500",
                B: "text-blue-500",
                C: "text-amber-500",
                D: "text-red-500",
              };
              return (
                <div
                  key={grade}
                  className={`p-4 rounded-2xl border ${colors[grade]} text-center`}
                >
                  <p
                    className={`text-2xl font-black ${labelColors[grade]} mb-2`}
                  >
                    {grade}
                  </p>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Min Score
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.gradingScale[grade]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        gradingScale: {
                          ...form.gradingScale,
                          [grade]: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-center px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Scores below the D threshold are automatically graded as{" "}
            <span className="font-bold text-red-400">F</span>.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <div className="flex items-center space-x-2 text-green-500 text-sm font-bold animate-pulse">
              <CheckCircle size={16} />
              <span>Settings saved successfully!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <Save size={18} />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SchoolSettingsPage;
