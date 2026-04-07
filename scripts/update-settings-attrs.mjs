import { Client, Databases } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db = new Databases(client);

async function addAttr(key, size = 255) {
  try {
    await db.createStringAttribute(
      DATABASE_ID,
      "school_settings",
      key,
      size,
      false,
    );
    console.log(`✅ Added attribute: ${key}`);
  } catch (e) {
    if (e.code === 409) console.log(`~ Attribute already exists: ${key}`);
    else console.error(`❌ Failed to add ${key}:`, e.message);
  }
}

async function run() {
  console.log("Updating school_settings attributes...");
  // Phase 8 attributes
  await addAttr("address", 500);
  await addAttr("phone", 100);
  await addAttr("email", 255);
  await addAttr("currency", 10);
  await addAttr("timezone", 100);
  // Phase 9 attributes
  await addAttr("logoUrl", 1000);
  await addAttr("primaryColor", 20);
  console.log("Done.");
}

run();
