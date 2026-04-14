import { useState, useEffect } from "react";
import { getDB } from "@database/rxdb";

const SETTINGS_ID = "school-settings-singleton";

export interface SchoolSettings {
  schoolName: string;
  academicYear: string;
  gradingScale: { A: number; B: number; C: number; D: number };
  address?: string;
  phone?: string;
  email?: string;
  currency?: string;
  timezone?: string;
  logoUrl?: string;
  primaryColor?: string;
}

const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: "SchoolDesk Academy",
  academicYear: "2025/2026",
  gradingScale: { A: 90, B: 80, C: 70, D: 60 },
  currency: "USD",
  timezone: "UTC",
  logoUrl: "/logo.png",
  primaryColor: "#2563eb",
};

export const useSchoolSettings = () => {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let sub: any;
    const init = async () => {
      try {
        const db = await getDB();
        sub = db.school_settings
          .findOne({ selector: { id: SETTINGS_ID } })
          .$.subscribe((doc: any) => {
            if (doc) {
              const parsed: SchoolSettings = {
                schoolName: doc.schoolName || DEFAULT_SETTINGS.schoolName,
                academicYear: doc.academicYear || DEFAULT_SETTINGS.academicYear,
                gradingScale: doc.gradingScale
                  ? {
                      ...DEFAULT_SETTINGS.gradingScale,
                      ...JSON.parse(doc.gradingScale),
                    }
                  : DEFAULT_SETTINGS.gradingScale,
                address: doc.address || "",
                phone: doc.phone || "",
                email: doc.email || "",
                currency: doc.currency || DEFAULT_SETTINGS.currency,
                timezone: doc.timezone || DEFAULT_SETTINGS.timezone,
                logoUrl: doc.logoUrl || DEFAULT_SETTINGS.logoUrl,
                primaryColor: doc.primaryColor || DEFAULT_SETTINGS.primaryColor,
              };
              setSettings(parsed);
            }
            setLoading(false);
          });
      } catch (err) {
        console.error("Failed to init settings:", err);
        setLoading(false);
      }
    };
    init();
    return () => sub?.unsubscribe();
  }, []);

  const saveSettings = async (updated: SchoolSettings) => {
    setSaving(true);
    try {
      const db = await getDB();
      const existing = await db.school_settings
        .findOne({ selector: { id: SETTINGS_ID } })
        .exec();

      const data = {
        id: SETTINGS_ID,
        schoolName: updated.schoolName,
        academicYear: updated.academicYear,
        gradingScale: JSON.stringify(updated.gradingScale),
        address: updated.address || "",
        phone: updated.phone || "",
        email: updated.email || "",
        currency: updated.currency || DEFAULT_SETTINGS.currency,
        timezone: updated.timezone || DEFAULT_SETTINGS.timezone,
        logoUrl: updated.logoUrl || DEFAULT_SETTINGS.logoUrl,
        primaryColor: updated.primaryColor || DEFAULT_SETTINGS.primaryColor,
        updatedAt: Date.now(),
        synced: false,
        isDeleted: false,
      };

      if (existing) {
        await existing.patch(data);
      } else {
        await db.school_settings.insert({ ...data, createdAt: Date.now() });
      }
      setSettings(updated);
      return true;
    } catch (err) {
      console.error("Failed to save settings:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, saveSettings };
};
