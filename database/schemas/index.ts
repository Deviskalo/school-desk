import { commonFields } from "./common";

export const userSchema = {
  title: "user schema",
  version: 2,
  description: "represents a user",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    email: { type: "string" },
    name: { type: "string" },
    role: { type: "string", enum: ["admin", "teacher", "student"] },
    appwriteId: { type: "string" },
  },
  required: ["id", "email", "role"],
};

export const studentSchema = {
  title: "student schema",
  version: 2,
  description: "represents a student",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    name: { type: "string" },
    email: { type: "string" },
    grade: { type: "string" },
    teacherId: { type: "string" },
  },
  required: ["id", "name"],
};

export const teacherSchema = {
  title: "teacher schema",
  version: 2,
  description: "represents a teacher",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    name: { type: "string" },
    email: { type: "string" },
    subject: { type: "string" },
  },
  required: ["id", "name"],
};

export const attendanceSchema = {
  title: "attendance schema",
  version: 2,
  description: "represents attendance record",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    studentId: { type: "string" },
    teacherId: { type: "string" },
    date: { type: "string" }, // ISO string
    status: { type: "string", enum: ["present", "absent", "late"] },
  },
  required: ["id", "studentId", "date", "status"],
};

export const gradeSchema = {
  title: "grade schema",
  version: 2,
  description: "represents a grade record",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    studentId: { type: "string" },
    subject: { type: "string" },
    grade: { type: "string" },
    date: { type: "string" },
  },
  required: ["id", "studentId", "subject", "grade"],
};

export const assignmentSchema = {
  title: "assignment schema",
  version: 2,
  description: "represents an assignment",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    title: { type: "string" },
    description: { type: "string" },
    dueDate: { type: "string" },
    teacherId: { type: "string" },
    subject: { type: "string" },
  },
  required: ["id", "title", "teacherId"],
};

export const submissionSchema = {
  title: "submission schema",
  version: 2,
  description: "represents an assignment submission",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    assignmentId: { type: "string" },
    studentId: { type: "string" },
    content: { type: "string" },
    submittedAt: { type: "string" },
    grade: { type: "string" },
    feedback: { type: "string" },
  },
  required: ["id", "assignmentId", "studentId"],
};

export const timetableSchema = {
  title: "timetable schema",
  version: 2,
  description: "represents a class schedule entry",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    day: {
      type: "string",
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    startTime: { type: "string" }, // HH:mm
    endTime: { type: "string" }, // HH:mm
    subject: { type: "string" },
    room: { type: "string" },
    teacherId: { type: "string" },
    grade: { type: "string" }, // e.g. "12-A"
  },
  required: [
    "id",
    "day",
    "startTime",
    "endTime",
    "subject",
    "teacherId",
    "grade",
  ],
};

export const auditLogSchema = {
  title: "audit log schema",
  version: 1,
  description: "represents a system or security event",
  primaryKey: "id",
  type: "object",
  properties: {
    ...commonFields,
    type: {
      type: "string",
      enum: ["security", "student", "teacher", "grade", "assignment", "system"],
    },
    title: { type: "string" },
    subtitle: { type: "string" },
    userId: { type: "string" },
    userName: { type: "string" },
    targetId: { type: "string" },
    metadata: { type: "string" }, // JSON string
  },
  required: ["id", "type", "title", "createdAt"],
};

export const schoolSettingsSchema = {
  title: "school settings schema",
  version: 2,
  description: "represents school-wide configuration settings",
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    schoolName: { type: "string" },
    academicYear: { type: "string" },
    gradingScale: { type: "string" }, // JSON string: {A: 90, B: 80, C: 70, D: 60}
    address: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    currency: { type: "string" },
    timezone: { type: "string" },
    logoUrl: { type: "string" },
    primaryColor: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
    synced: { type: "boolean" },
    isDeleted: { type: "boolean" },
  },
  required: ["id", "schoolName"],
};
