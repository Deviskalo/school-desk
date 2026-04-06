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
} from "./schemas";

import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);

let dbPromise: Promise<any> | null = null;

const migrationStrategies = {
  1: (oldDoc: any) => {
    oldDoc.isDeleted = oldDoc.deleted || false;
    delete oldDoc.deleted;
    return oldDoc;
  },
};

const createDB = async () => {
  const db = await createRxDatabase({
    name: "schooldesk_db_v3",
    storage: getRxStorageDexie(),
    password: "myPassword", // Optional: Use a secure password in production
    multiInstance: true,
  });

  await db.addCollections({
    users: { schema: userSchema, migrationStrategies },
    students: { schema: studentSchema, migrationStrategies },
    teachers: { schema: teacherSchema, migrationStrategies },
    attendance: { schema: attendanceSchema, migrationStrategies },
    grades: { schema: gradeSchema, migrationStrategies },
    assignments: { schema: assignmentSchema, migrationStrategies },
    submissions: { schema: submissionSchema, migrationStrategies },
    timetable: { schema: timetableSchema, migrationStrategies },
    audit_logs: { schema: auditLogSchema, migrationStrategies },
  });

  return db;
};

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = createDB();
  }
  return dbPromise;
};
