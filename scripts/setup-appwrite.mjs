#!/usr/bin/env node
/**
 * SchoolDesk — Appwrite Setup Script
 * Creates the database and all required collections with attributes and permissions.
 *
 * Usage:
 *   node scripts/setup-appwrite.mjs
 *
 * Requirements:
 *   - VITE_APPWRITE_ENDPOINT in .env
 *   - VITE_APPWRITE_PROJECT_ID in .env
 *   - VITE_APPWRITE_API_KEY in .env  (needs databases.write scope)
 */

import { Client, Databases, Permission, Role, ID } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DELAY = 500; // ms between each attribute call

// ─── Load .env manually (no dotenv dependency needed) ────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

const env = {};
readFileSync(envPath, "utf-8")
  .split("\n")
  .forEach((line) => {
    const [key, ...rest] = line.trim().split("=");
    if (key && rest.length) env[key.trim()] = rest.join("=").trim();
  });

const ENDPOINT = env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = env.VITE_APPWRITE_API_KEY;
const DATABASE_ID = env.VITE_APPWRITE_DATABASE_ID || "schooldesk";

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error(
    "❌  Missing required env vars. Ensure VITE_APPWRITE_ENDPOINT, " +
      "VITE_APPWRITE_PROJECT_ID, and VITE_APPWRITE_API_KEY are set in .env",
  );
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db = new Databases(client);

// ─── Default permissions: any authenticated user can read/write ───────────────
const permissions = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// ─── Helper ──────────────────────────────────────────────────────────────────
async function createStringAttr(
  dbId,
  colId,
  key,
  required = false,
  size = 255,
) {
  try {
    await db.createStringAttribute(dbId, colId, key, size, required);
    console.log(`    + string: ${key}`);
    await sleep(DELAY);
  } catch (e) {
    if (e.code === 409) console.log(`    ~ skip (exists): ${key}`);
    else throw e;
  }
}

async function createIntAttr(dbId, colId, key, required = false) {
  try {
    await db.createIntegerAttribute(dbId, colId, key, required);
    console.log(`    + integer: ${key}`);
    await sleep(DELAY);
  } catch (e) {
    if (e.code === 409) console.log(`    ~ skip (exists): ${key}`);
    else throw e;
  }
}

async function createBoolAttr(dbId, colId, key, required = false, def = false) {
  try {
    await db.createBooleanAttribute(dbId, colId, key, required, def);
    console.log(`    + boolean: ${key}`);
    await sleep(DELAY);
  } catch (e) {
    if (e.code === 409) console.log(`    ~ skip (exists): ${key}`);
    else throw e;
  }
}

async function createEnumAttr(dbId, colId, key, elements, required = false) {
  try {
    await db.createEnumAttribute(dbId, colId, key, elements, required);
    console.log(`    + enum(${elements.join("|")}): ${key}`);
    await sleep(DELAY);
  } catch (e) {
    if (e.code === 409) console.log(`    ~ skip (exists): ${key}`);
    else throw e;
  }
}

async function createCollection(colId, colName) {
  try {
    await db.createCollection(DATABASE_ID, colId, colName, permissions);
    console.log(`\n  ✅ Created collection: ${colName} (${colId})`);
  } catch (e) {
    if (e.code === 409)
      console.log(`\n  ~ Collection exists: ${colName} (${colId})`);
    else throw e;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function setup() {
  console.log(`\n🚀 SchoolDesk — Appwrite Setup`);
  console.log(`   Endpoint:  ${ENDPOINT}`);
  console.log(`   Project:   ${PROJECT_ID}`);
  console.log(`   Database:  ${DATABASE_ID}\n`);

  // 1. Create database
  try {
    await db.create(DATABASE_ID, "SchoolDesk");
    console.log(`✅ Database created: ${DATABASE_ID}`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`~ Database already exists: ${DATABASE_ID}`);
    } else if (e.message?.includes("maximum number of databases")) {
      // Free plan limit hit — database was created in a previous run, continue
      console.log(
        `~ Database limit reached — using existing database: ${DATABASE_ID}`,
      );
    } else {
      throw e;
    }
  }
  await sleep(500);

  // 2. Users
  await createCollection("users", "Users");
  await createStringAttr(DATABASE_ID, "users", "email", true);
  await createStringAttr(DATABASE_ID, "users", "name", true);
  await createEnumAttr(
    DATABASE_ID,
    "users",
    "role",
    ["admin", "teacher", "student"],
    true,
  );
  await createStringAttr(DATABASE_ID, "users", "appwriteId");
  await createIntAttr(DATABASE_ID, "users", "createdAt");
  await createIntAttr(DATABASE_ID, "users", "updatedAt");
  await createBoolAttr(DATABASE_ID, "users", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "users", "deleted", false, false);

  // 3. Students
  await createCollection("students", "Students");
  await createStringAttr(DATABASE_ID, "students", "name", true);
  await createStringAttr(DATABASE_ID, "students", "email");
  await createStringAttr(DATABASE_ID, "students", "grade");
  await createStringAttr(DATABASE_ID, "students", "teacherId");
  await createIntAttr(DATABASE_ID, "students", "createdAt");
  await createIntAttr(DATABASE_ID, "students", "updatedAt");
  await createBoolAttr(DATABASE_ID, "students", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "students", "deleted", false, false);

  // 4. Teachers
  await createCollection("teachers", "Teachers");
  await createStringAttr(DATABASE_ID, "teachers", "name", true);
  await createStringAttr(DATABASE_ID, "teachers", "email");
  await createStringAttr(DATABASE_ID, "teachers", "subject");
  await createIntAttr(DATABASE_ID, "teachers", "createdAt");
  await createIntAttr(DATABASE_ID, "teachers", "updatedAt");
  await createBoolAttr(DATABASE_ID, "teachers", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "teachers", "deleted", false, false);

  // 5. Attendance
  await createCollection("attendance", "Attendance");
  await createStringAttr(DATABASE_ID, "attendance", "studentId", true);
  await createStringAttr(DATABASE_ID, "attendance", "teacherId");
  await createStringAttr(DATABASE_ID, "attendance", "date", true);
  await createEnumAttr(
    DATABASE_ID,
    "attendance",
    "status",
    ["present", "absent", "late"],
    true,
  );
  await createIntAttr(DATABASE_ID, "attendance", "createdAt");
  await createIntAttr(DATABASE_ID, "attendance", "updatedAt");
  await createBoolAttr(DATABASE_ID, "attendance", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "attendance", "deleted", false, false);

  // 6. Grades
  await createCollection("grades", "Grades");
  await createStringAttr(DATABASE_ID, "grades", "studentId", true);
  await createStringAttr(DATABASE_ID, "grades", "subject", true);
  await createStringAttr(DATABASE_ID, "grades", "grade", true);
  await createStringAttr(DATABASE_ID, "grades", "date");
  await createIntAttr(DATABASE_ID, "grades", "createdAt");
  await createIntAttr(DATABASE_ID, "grades", "updatedAt");
  await createBoolAttr(DATABASE_ID, "grades", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "grades", "deleted", false, false);

  // 7. Assignments
  await createCollection("assignments", "Assignments");
  await createStringAttr(DATABASE_ID, "assignments", "title", true);
  await createStringAttr(
    DATABASE_ID,
    "assignments",
    "description",
    false,
    2000,
  );
  await createStringAttr(DATABASE_ID, "assignments", "dueDate");
  await createStringAttr(DATABASE_ID, "assignments", "teacherId", true);
  await createStringAttr(DATABASE_ID, "assignments", "subject");
  await createIntAttr(DATABASE_ID, "assignments", "createdAt");
  await createIntAttr(DATABASE_ID, "assignments", "updatedAt");
  await createBoolAttr(DATABASE_ID, "assignments", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "assignments", "deleted", false, false);

  // 8. Submissions
  await createCollection("submissions", "Submissions");
  await createStringAttr(DATABASE_ID, "submissions", "assignmentId", true);
  await createStringAttr(DATABASE_ID, "submissions", "studentId", true);
  await createStringAttr(DATABASE_ID, "submissions", "content", false, 5000);
  await createStringAttr(DATABASE_ID, "submissions", "submittedAt");
  await createStringAttr(DATABASE_ID, "submissions", "grade");
  await createStringAttr(DATABASE_ID, "submissions", "feedback", false, 2000);
  await createIntAttr(DATABASE_ID, "submissions", "createdAt");
  await createIntAttr(DATABASE_ID, "submissions", "updatedAt");
  await createBoolAttr(DATABASE_ID, "submissions", "synced", false, false);
  await createBoolAttr(DATABASE_ID, "submissions", "deleted", false, false);

  console.log("\n🎉 Setup complete! All collections are ready.\n");
}

setup().catch((e) => {
  console.error("\n❌ Setup failed:", e.message);
  process.exit(1);
});
