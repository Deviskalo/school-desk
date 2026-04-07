import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

import {
  userSchema,
  studentSchema,
  teacherSchema,
  attendanceSchema,
  gradeSchema,
  assignmentSchema,
  submissionSchema,
  timetableSchema,
  auditLogSchema,
  schoolSettingsSchema,
} from "./schemas";

import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);

let dbPromise: Promise<any> | null = null;

const commonMigrationStrategies = {
  1: (oldDoc: any) => {
    oldDoc.isDeleted = oldDoc.deleted || false;
    delete oldDoc.deleted;
    return oldDoc;
  },
};

const schoolSettingsMigrationStrategies = {
  ...commonMigrationStrategies,
  2: (oldDoc: any) => {
    if (!oldDoc.logoUrl) oldDoc.logoUrl = "/logo.png";
    if (!oldDoc.primaryColor) oldDoc.primaryColor = "#2563eb";
    return oldDoc;
  },
};

const createDB = async () => {
  const db = await createRxDatabase({
    name: "schooldesk_db_v4",
    storage: getRxStorageDexie(),
    password: "myPassword",
    multiInstance: true,
  });

  await db.addCollections({
    users: {
      schema: userSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    students: {
      schema: studentSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    teachers: {
      schema: teacherSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    attendance: {
      schema: attendanceSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    grades: {
      schema: gradeSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    assignments: {
      schema: assignmentSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    submissions: {
      schema: submissionSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    timetable: {
      schema: timetableSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    audit_logs: {
      schema: auditLogSchema,
      migrationStrategies: commonMigrationStrategies,
    },
    school_settings: {
      schema: schoolSettingsSchema,
      migrationStrategies: schoolSettingsMigrationStrategies,
    },
  });

  return db;
};

export const getDB = async () => {
  if (dbPromise) {
    const db = await dbPromise;
    if (db.destroyed) {
      dbPromise = null;
    } else {
      return db;
    }
  }
  dbPromise = createDB();
  return dbPromise;
};
