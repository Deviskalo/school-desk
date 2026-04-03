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
} from "./schemas";

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

let dbPromise: Promise<any> | null = null;

const createDB = async () => {
  const db = await createRxDatabase({
    name: "schooldesk_db",
    storage: getRxStorageDexie(),
    password: "myPassword", // Optional: Use a secure password in production
    multiInstance: true,
  });

  await db.addCollections({
    users: { schema: userSchema },
    students: { schema: studentSchema },
    teachers: { schema: teacherSchema },
    attendance: { schema: attendanceSchema },
    grades: { schema: gradeSchema },
    assignments: { schema: assignmentSchema },
    submissions: { schema: submissionSchema },
  });

  return db;
};

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = createDB();
  }
  return dbPromise;
};
