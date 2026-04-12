"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

const DATABASE_NAME = "hansi-english-query-cache";
const DATABASE_VERSION = 1;
const STORE_NAME = "query-cache";

interface QueryCacheDatabase extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: string;
  };
}

interface IndexedDbStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * Creates an async storage adapter backed by IndexedDB.
 * @returns IndexedDB storage for persisted React Query state when supported.
 */
export function createIndexedDbStorage(): IndexedDbStorage | undefined {
  if (!canUseIndexedDb()) {
    return undefined;
  }

  return {
    getItem: async (key) => {
      const database = await openDatabase();

      if (!database) {
        return null;
      }

      return runReadTransaction(database, key);
    },
    setItem: async (key, value) => {
      const database = await openDatabase();

      if (!database) {
        return;
      }

      await runWriteTransaction(database, key, value);
    },
    removeItem: async (key) => {
      const database = await openDatabase();

      if (!database) {
        return;
      }

      await runDeleteTransaction(database, key);
    },
  };
}

/**
 * Checks whether the current environment can access IndexedDB.
 * @returns Whether IndexedDB is available.
 */
function canUseIndexedDb(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!("indexedDB" in window)) {
    return false;
  }

  return true;
}

let databasePromise: Promise<IDBPDatabase<QueryCacheDatabase> | null> | null = null;

/**
 * Opens the IndexedDB database and ensures the cache object store exists.
 * @returns The opened database or null when access fails.
 */
async function openDatabase(): Promise<IDBPDatabase<QueryCacheDatabase> | null> {
  if (databasePromise) {
    return await databasePromise;
  }

  databasePromise = openDB<QueryCacheDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    },
  }).catch(() => {
    databasePromise = null;

    return null;
  });

  return databasePromise;
}

/**
 * Reads a cached value from IndexedDB.
 * @param database Open IndexedDB database.
 * @param key Persisted cache key.
 * @returns Cached string value when present.
 */
async function runReadTransaction(
  database: IDBPDatabase<QueryCacheDatabase>,
  key: string,
): Promise<string | null> {
  try {
    const result = await database.get(STORE_NAME, key);

    if (typeof result === "string") {
      return result;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Writes a cached value to IndexedDB.
 * @param database Open IndexedDB database.
 * @param key Persisted cache key.
 * @param value Serialized cache payload.
 * @returns Promise that resolves when the write completes.
 */
async function runWriteTransaction(
  database: IDBPDatabase<QueryCacheDatabase>,
  key: string,
  value: string,
): Promise<void> {
  try {
    await database.put(STORE_NAME, value, key);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to persist query cache.");
  }
}

/**
 * Deletes a cached value from IndexedDB.
 * @param database Open IndexedDB database.
 * @param key Persisted cache key.
 * @returns Promise that resolves when the delete completes.
 */
async function runDeleteTransaction(
  database: IDBPDatabase<QueryCacheDatabase>,
  key: string,
): Promise<void> {
  try {
    await database.delete(STORE_NAME, key);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to clear query cache.");
  }
}
