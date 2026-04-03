import { databases } from "../appwrite/client";
import { getDB } from "../database/rxdb";
import { Query, ID } from "appwrite";

const APPWRITE_DATABASE_ID =
  (typeof process !== "undefined"
    ? process.env.VITE_APPWRITE_DATABASE_ID
    : (import.meta as any).env?.VITE_APPWRITE_DATABASE_ID) || "schooldesk";

export class SyncEngine {
  collections: string[];
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onlineListener: () => void;

  constructor(collections: string[]) {
    this.collections = collections;
    this.onlineListener = () => {
      console.log("[Sync] Back online, triggering sync...");
      this.sync();
    };
  }

  async start() {
    if (this.intervalId) return;
    console.log("Sync engine started");

    // Listen for network changes
    window.addEventListener("online", this.onlineListener);

    this.intervalId = setInterval(() => this.sync(), 30000);
    this.sync();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      window.removeEventListener("online", this.onlineListener);
      console.log("Sync engine stopped");
    }
  }

  async sync() {
    if (!navigator.onLine) return;

    for (const collection of this.collections) {
      await this.push(collection);
      await this.pull(collection);
    }
  }

  async push(collectionName: string) {
    const db = await getDB();
    const unsyncedDocs = await db[collectionName]
      .find({
        selector: { synced: false },
      })
      .exec();

    for (const doc of unsyncedDocs) {
      try {
        const data = doc.toJSON();
        const { id, synced, ...payload } = data;

        try {
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            collectionName,
            id,
            { ...payload, updatedAt: Date.now() },
          );
        } catch (error: any) {
          if (error.code === 404) {
            await databases.createDocument(
              APPWRITE_DATABASE_ID,
              collectionName,
              id,
              { ...payload, updatedAt: Date.now() },
            );
          } else {
            throw error;
          }
        }

        await doc.patch({ synced: true });
      } catch (error: any) {
        // If the database itself is missing, don't spam — stop syncing
        if (error?.message?.includes("Database with the requested ID")) {
          console.warn(
            `[Sync] Appwrite database '${APPWRITE_DATABASE_ID}' not found. ` +
              `Please create it in the Appwrite Console. Sync paused.`,
          );
          this.stop();
          return;
        }
        console.error(`Error pushing to ${collectionName}:`, error);
      }
    }
  }

  async pull(collectionName: string) {
    const db = await getDB();
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        collectionName,
        [Query.orderDesc("updatedAt"), Query.limit(100)],
      );

      for (const remoteDoc of response.documents) {
        // Separate metadata from actual data
        const {
          $id,
          $collectionId,
          $databaseId,
          $createdAt,
          $updatedAt,
          $permissions,
          ...data
        } = remoteDoc;
        const localDoc = await db[collectionName].findOne($id).exec();

        if (!localDoc) {
          await db[collectionName].insert({
            ...data,
            id: $id,
            synced: true,
          });
        } else {
          if (remoteDoc.updatedAt > (localDoc.updatedAt || 0)) {
            await localDoc.patch({
              ...data,
              id: $id,
              synced: true,
            });
          }
        }
      }
    } catch (error: any) {
      // Stop spamming if the Appwrite DB/collections don't exist yet
      if (
        error?.message?.includes("Database with the requested ID") ||
        error?.message?.includes("Collection with the requested ID")
      ) {
        console.warn(
          `[Sync] Appwrite not ready (${collectionName}): ${error.message}. ` +
            `Create the database and collections in the Appwrite Console.`,
        );
        this.stop();
        return;
      }
      console.error(`Error pulling from ${collectionName}:`, error);
    }
  }
}

export const syncEngine = new SyncEngine([
  "users",
  "students",
  "teachers",
  "attendance",
  "grades",
  "assignments",
  "submissions",
]);
