import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client;
const APPWRITE_ENDPOINT =
  (typeof process !== "undefined"
    ? process.env.VITE_APPWRITE_ENDPOINT
    : (import.meta as any).env?.VITE_APPWRITE_ENDPOINT) ||
  "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID =
  (typeof process !== "undefined"
    ? process.env.VITE_APPWRITE_PROJECT_ID
    : (import.meta as any).env?.VITE_APPWRITE_PROJECT_ID) || "";

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;
