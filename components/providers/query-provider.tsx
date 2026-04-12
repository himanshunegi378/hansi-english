"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createIndexedDbStorage } from "./indexed-db-storage";

const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 24;
const QUERY_CACHE_KEY = "hansi-english-react-query-cache";
const QUERY_CACHE_BUSTER = "v1";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provides a shared TanStack Query client for the application.
 * @param props Provider children.
 * @returns Query client provider wrapper.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());
  const [persister] = useState(() =>
    createAsyncStoragePersister({
      key: QUERY_CACHE_KEY,
      storage: createIndexedDbStorage(),
      throttleTime: 1000,
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        buster: QUERY_CACHE_BUSTER,
        maxAge: QUERY_CACHE_MAX_AGE,
        persister,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

/**
 * Creates the shared query client used across the application.
 * @returns Configured query client instance.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        gcTime: QUERY_CACHE_MAX_AGE,
      },
    },
  });
}
