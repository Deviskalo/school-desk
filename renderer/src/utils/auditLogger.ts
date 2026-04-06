import { getDB } from "@database/rxdb";

import type { Activity } from "../hooks/useRecentActivities";

export const logActivity = async (params: {
  type: Activity["type"];
  title: string;
  subtitle: string;
  userId?: string;
  userName?: string;
  targetId?: string;
  metadata?: any;
}) => {
  try {
    const db = await getDB();
    await db.audit_logs.insert({
      id: crypto.randomUUID(),
      type: params.type,
      title: params.title,
      subtitle: params.subtitle,
      userId: params.userId,
      userName: params.userName,
      targetId: params.targetId,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export const backfillAuditLogs = async () => {
  try {
    const db = await getDB();
    const existingCount = await db.audit_logs.count().exec();
    if (existingCount > 0) return; // Only backfill if empty

    console.log("Starting Audit Log backfill...");
    const logs: any[] = [];

    // 1. Students
    const students = await db.students.find().exec();
    students.forEach((s: any) => {
      logs.push({
        id: `backfill-student-${s.id}`,
        type: "student",
        title: "New Student",
        subtitle: s.name,
        targetId: s.id,
        createdAt: s.createdAt || Date.now(),
        updatedAt: Date.now(),
        synced: false,
      });
    });

    // 2. Teachers
    const teachers = await db.teachers.find().exec();
    teachers.forEach((t: any) => {
      logs.push({
        id: `backfill-teacher-${t.id}`,
        type: "teacher",
        title: "New Teacher",
        subtitle: t.name,
        targetId: t.id,
        createdAt: t.createdAt || Date.now(),
        updatedAt: Date.now(),
        synced: false,
      });
    });

    // 3. Admin Users
    const users = await db.users
      .find({ selector: { role: { $eq: "admin" } } })
      .exec();
    users.forEach((u: any) => {
      logs.push({
        id: `backfill-admin-${u.id}`,
        type: "security",
        title: "Security: New Admin",
        subtitle: u.name || u.email,
        targetId: u.id,
        createdAt: u.createdAt || Date.now(),
        updatedAt: Date.now(),
        synced: false,
      });
    });

    if (logs.length > 0) {
      await db.audit_logs.bulkInsert(logs);
      console.log(`Backfilled ${logs.length} audit logs.`);
    }
  } catch (error) {
    console.error("Backfill failed:", error);
  }
};
