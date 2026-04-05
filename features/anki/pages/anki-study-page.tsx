"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { AnkiSectionHeading } from "../components/shared/anki-section-heading";
import { StudySession } from "../components/study-session/study-session";
import { useAnkiStudySession } from "../hooks/use-anki-study-session";
import {
  deckDetailQueryOptions,
  studyQueueQueryOptions,
} from "../query-options";

interface AnkiStudyPageProps {
  deckId: string;
}

/**
 * Renders the focused study-session screen for a single deck.
 * @param props Active deck identifier.
 * @returns Study-session page composition.
 */
export function AnkiStudyPage({ deckId }: AnkiStudyPageProps) {
  const deckTitleQuery = useQuery({
    ...deckDetailQueryOptions(deckId),
    throwOnError: true,
    select: (deck) => deck.name,
  });
  const studyQueueQuery = useQuery({
    ...studyQueueQueryOptions(deckId),
    throwOnError: true,
  });
  const deckTitle = deckTitleQuery.data ?? "";
  const cards =
    studyQueueQuery.data?.data.map((card) => ({
      ...card,
      deckTitle,
    })) ?? [];
  const { hideAnswer, isPending, revealAnswer, state, submitGrade } =
    useAnkiStudySession(deckId, cards);

  if (deckTitleQuery.isPending || studyQueueQuery.isPending) {
    return (
      <AnkiPageShell.Root className="max-w-5xl">
        <AnkiPageShell.Body>
          <div className="rounded-[2rem] border border-border/60 bg-card/90 p-6 text-sm text-muted-foreground">
            Loading study session...
          </div>
        </AnkiPageShell.Body>
      </AnkiPageShell.Root>
    );
  }

  return (
    <AnkiPageShell.Root className="max-w-5xl">
      <AnkiPageShell.Header>
        <AnkiSectionHeading
          eyebrow="Study session"
          actions={(
            <AnkiPageShell.Actions>
              <Badge
                variant="outline"
                className="rounded-full bg-background/80 px-3 py-1"
              >
                <BookOpen data-icon="inline-start" />
                {deckTitle}
              </Badge>
              <Link
                href="/anki"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4")}
              >
                <ChevronLeft data-icon="inline-start" />
                Back to decks
              </Link>
            </AnkiPageShell.Actions>
          )}
        />
      </AnkiPageShell.Header>

      <AnkiPageShell.Body>
        <StudySession.Root>
          <StudySession.Progress state={state} />
          {state.phase === "empty" ? <StudySession.Empty /> : null}
          {state.phase === "complete" ? (
            <StudySession.Complete deckTitle={deckTitle} />
          ) : null}
          {state.phase === "active" && state.activeCard ? (
            <>
              <StudySession.Flashcard
                front={state.activeCard.front}
                back={state.activeCard.back}
                isRevealed={state.isAnswerVisible}
                isPending={isPending}
                onReveal={revealAnswer}
                onGrade={submitGrade}
              />
            </>
          ) : null}
        </StudySession.Root>
      </AnkiPageShell.Body>
    </AnkiPageShell.Root>
  );
}
