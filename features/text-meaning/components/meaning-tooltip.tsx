"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Loader2, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWordMeaning } from "../hooks/use-word-meaning";
import type { SelectedText } from "../types";

interface MeaningTooltipProps {
  onClose: () => void;
  selectedText: SelectedText | null;
}

const MOBILE_BREAKPOINT = 768;

/**
 * Fetches and renders a selected word's meaning in a floating tooltip or mobile bottom sheet.
 * @param props The active selection and close handler.
 * @returns The contextual meaning UI when text is selected.
 */
export function MeaningTooltip({
  onClose,
  selectedText,
}: MeaningTooltipProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const { errorMessage, isLoading, meaning } = useWordMeaning(selectedText?.text ?? null);

  useEffect(() => {
    /**
     * Keeps the tooltip layout in sync with the current viewport width.
     */
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!selectedText) {
    return null;
  }

  const firstAudio = meaning?.phonetics.find((entry) => entry.audio)?.audio ?? null;

  /**
   * Plays the first available pronunciation audio for the current selection.
   */
  const playPronunciation = () => {
    if (!firstAudio) {
      return;
    }

    void new Audio(firstAudio).play();
  };

  return (
    <AnimatePresence>
      <motion.div
        key={selectedText.text}
        initial={isMobile ? { opacity: 0, y: 32 } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
        exit={isMobile ? { opacity: 0, y: 24 } : { opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={
          isMobile
            ? undefined
            : {
                left: selectedText.position.left,
                top: selectedText.position.top - 12,
                transform: "translate(-50%, -100%)",
              }
        }
        className={cn(
          "fixed z-50 w-[min(24rem,calc(100vw-1.5rem))] rounded-2xl border border-border/70 bg-background/95 p-4 shadow-2xl backdrop-blur-sm",
          isMobile && "inset-x-3 bottom-3 w-auto",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <p className="text-sm font-semibold capitalize">{selectedText.text}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {meaning?.phonetic ? <span>{meaning.phonetic}</span> : null}
              {meaning?.phonetics.length ? (
                <span>
                  {meaning.phonetics
                    .map((entry) => entry.text)
                    .filter((text): text is string => Boolean(text))
                    .slice(0, 2)
                    .join(" • ")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {firstAudio ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={playPronunciation}
                aria-label="Play pronunciation"
              >
                <Volume2 className="size-4" />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-full"
              onClick={onClose}
              aria-label="Close meaning tooltip"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-muted/50 p-3 text-sm leading-6 text-foreground">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span>Looking up the meaning…</span>
            </div>
          ) : errorMessage ? (
            <p className="text-destructive">{errorMessage}</p>
          ) : (
            <div className="space-y-3">
              {meaning?.meanings.slice(0, 3).map((entry, meaningIndex) => (
                <div key={`${entry.partOfSpeech ?? "meaning"}-${meaningIndex}`} className="space-y-1.5">
                  {entry.partOfSpeech ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                      {entry.partOfSpeech}
                    </p>
                  ) : null}
                  <ol className="space-y-1.5">
                    {entry.definitions.slice(0, 3).map((definition, definitionIndex) => (
                      <li key={`${definition.definition}-${definitionIndex}`} className="list-decimal ms-4">
                        <p>{definition.definition}</p>
                        {definition.example ? (
                          <p className="text-xs italic text-muted-foreground">
                            {definition.example}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
