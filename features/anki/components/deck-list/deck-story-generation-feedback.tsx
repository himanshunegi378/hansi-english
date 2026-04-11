"use client";

import { motion } from "framer-motion";
import { BookOpenText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

interface DeckStoryGenerationFeedbackProps {
  deckName: string;
}

/**
 * Highlights the active story-generation job for the selected deck.
 * @param props Active deck metadata for the in-progress state.
 * @returns A lightweight status panel shown while story generation runs.
 */
export function DeckStoryGenerationFeedback({
  deckName,
}: DeckStoryGenerationFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <Alert className="rounded-[1.75rem] border-border/60 bg-card/70 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60 sm:px-5">
        <Spinner className="mt-0.5 text-primary" />
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
            >
              <Sparkles data-icon="inline-start" />
              Story in progress
            </Badge>
            <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
              <BookOpenText data-icon="inline-start" />
              {deckName}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <AlertTitle className="text-base sm:text-lg">
              Turning this deck into a learner-friendly story.
            </AlertTitle>
            <AlertDescription>
              We&apos;re generating the reading, building the question set, and will
              open the saved story as soon as everything is ready.
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </motion.div>
  );
}
