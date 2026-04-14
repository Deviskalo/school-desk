import { databases } from "../appwrite/client";
import { getDB } from "../database/rxdb";
import { Query, ID } from "appwrite";

const APPWRITE_DATABASE_ID =
  (typeof process !== "undefined"
    ? process.env.VITE_APPWRITE_DATABASE_ID
    : (import.meta as any).env?.VITE_APPWRITE_DATABASE_ID) || "schooldesk";

export interface SyncStats {
  lastSyncTime: number | null;
  collections: Record<
    string,
    {
      lastPushCount: number;
      lastPullCount: number;
      lastError: string | null;
    }
  >;
}

export class SyncEngine {
  collections: string[];
  public status: "synced" | "syncing" | "error" = "synced";
  public stats: SyncStats = {
    lastSyncTime: null,
    collections: {},
  };

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onlineListener: () => void;
  private statusListeners: Array<
    (status: "synced" | "syncing" | "error") => void
  > = [];
  private statsListeners: Array<(stats: SyncStats) => void> = [];
  private unavailableCollections: Set<string> = new Set();

  constructor(collections: string[]) {
    this.collections = collections;
    this.collections.forEach((c) => {
      this.stats.collections[c] = {
        lastPushCount: 0,
        lastPullCount: 0,
        lastError: null,
      };
    });

    this.onlineListener = () => {
      console.log("[Sync] Back online, triggering sync...");
      this.sync();
    };
  }

  async start() {
    if (this.intervalId) return;
    console.log("Sync engine started");
    window.addEventListener("online", this.onlineListener);
    this.intervalId = setInterval(() => this.sync(), 10000);
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

  private setStatus(newStatus: "synced" | "syncing" | "error") {
    this.status = newStatus;
    this.statusListeners.forEach((l) => l(newStatus));
  }

  private notifyStats() {
    this.statsListeners.forEach((l) => l({ ...this.stats }));
  }

  onStatusChange(listener: (status: "synced" | "syncing" | "error") => void) {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  onStatsChange(listener: (stats: SyncStats) => void) {
    this.statsListeners.push(listener);
    listener({ ...this.stats });
    return () => {
      this.statsListeners = this.statsListeners.filter((l) => l !== listener);
    };
  }

  async sync() {
    if (!navigator.onLine) {
      this.setStatus("error");
      return;
    }
    this.setStatus("syncing");
    this.unavailableCollections.clear();

    try {
      for (const collection of this.collections) {
        this.stats.collections[collection].lastError = null;
        await this.push(collection);
        await this.pull(collection);
      }
      this.stats.lastSyncTime = Date.now();
      this.setStatus("synced");
    } catch (err: any) {
      console.error(`[Sync] Cycle failed:`, err);
      this.setStatus("error");
    } finally {
      this.notifyStats();
    }
  }

  async push(collectionName: string) {
    // Skip collections already flagged as unavailable in this sync cycle
    if (this.unavailableCollections.has(collectionName)) return;

    const db = await getDB();
    const unsyncedDocs = await db[collectionName]
      .find({
        selector: { synced: false },
      })
      .exec();

    this.stats.collections[collectionName].lastPushCount = unsyncedDocs.length;

    for (const doc of unsyncedDocs) {
      if (this.unavailableCollections.has(collectionName)) break;
      try {
        const data = doc.toJSON();
        // Strip RxDB-internal fields (prefixed with _) and sync metadata
        const { id, synced, ...rest } = data;
        const payload = Object.fromEntries(
          Object.entries(rest).filter(([k]) => !k.startsWith("_")),
        );

        try {
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            collectionName,
            id,
            { ...payload, updatedAt: Date.now() },
          );
        } catch (updateError: any) {
          // A 404 can mean the document doesn't exist (create it) OR the
          // collection doesn't exist (abort — don't fire a POST either).
          if (updateError.code === 404) {
            const isCollectionMissing =
              updateError?.message?.includes(
                "Collection with the requested ID",
              ) ||
              updateError?.message?.includes("Database with the requested ID");
            if (isCollectionMissing) {
              this.unavailableCollections.add(collectionName);
              this.stats.collections[collectionName].lastError =
                "Appwrite collection not configured";
              return;
            }
            try {
              await databases.createDocument(
                APPWRITE_DATABASE_ID,
                collectionName,
                id,
                { ...payload, updatedAt: Date.now() },
              );
            } catch (createError: any) {
              const isCollectionUnavailable =
                createError?.message?.includes(
                  "Collection with the requested ID",
                ) ||
                createError?.message?.includes(
                  "Database with the requested ID",
                ) ||
                createError?.message?.includes("Attribute");
              if (isCollectionUnavailable) {
                this.unavailableCollections.add(collectionName);
                this.stats.collections[collectionName].lastError =
                  "Appwrite collection not ready";
                return;
              }
              throw createError;
            }
          } else {
            throw updateError;
          }
        }
        await doc.atomicPatch({ synced: true });
      } catch (error: any) {
        this.stats.collections[collectionName].lastError = error.message;
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

      this.stats.collections[collectionName].lastPullCount =
        response.documents.length;

      for (const remoteDoc of response.documents) {
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
      const isCollectionMissing =
        error?.message?.includes("Collection with the requested ID") ||
        error?.message?.includes("Database with the requested ID");
      if (isCollectionMissing) {
        if (!this.unavailableCollections.has(collectionName)) {
          this.unavailableCollections.add(collectionName);
          this.stats.collections[collectionName].lastError =
            "Appwrite collection not configured";
        }
        return;
      }
      this.stats.collections[collectionName].lastError = error.message;
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
  "timetable",
  "audit_logs",
  "school_settings",
]);
