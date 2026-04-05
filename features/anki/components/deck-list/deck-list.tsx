"use client";

import { LibraryBig } from "lucide-react";
import { motion } from "framer-motion";
import { AnkiEmptyState } from "../shared/anki-empty-state";

function Root({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-col gap-5">{children}</section>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {children}
    </motion.div>
  );
}

function Empty() {
  return (
    <AnkiEmptyState
      actionHref="/anki"
      actionLabel="Create your first deck"
      description="Start with one compact deck and let the review rhythm grow from there."
      icon={LibraryBig}
      title="No Anki decks yet"
    />
  );
}

/**
 * Compound section for the deck-library screen.
 */
export const DeckList = {
  Empty,
  Grid,
  Root,
};
