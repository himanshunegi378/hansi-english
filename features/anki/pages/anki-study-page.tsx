"use client";

import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnkiPageShell } from "../components/layout/anki-page-shell";
import { AnkiSectionHeading } from "../components/shared/anki-section-heading";
import { StudySession } from "../components/study-session/study-session";
import { useAnkiStudySession } from "../hooks/use-anki-study-session";
import type { AnkiStudySessionCard } from "../types/ui";

interface AnkiStudyPageProps {
  cards: AnkiStudySessionCard[];
  deckTitle: string;
}

/**
 * Renders the focused study-session screen for a single deck.
 * @param props Due cards and the current deck title.
 * @returns Study-session page composition.
 */
export function AnkiStudyPage({ cards, deckTitle }: AnkiStudyPageProps) {
  const { hideAnswer, isPending, revealAnswer, state, submitGrade } = useAnkiStudySession(cards);

  return (
    <AnkiPageShell.Root className="max-w-5xl">
      <AnkiPageShell.Header>
        <AnkiSectionHeading
          eyebrow="Study session"
          title="Review the cards that are due, then step away."
          description="This screen keeps the rhythm narrow on purpose: recall, reveal, grade, and move on without clutter."
          actions={(
            <AnkiPageShell.Actions>
              <Badge variant="outline" className="rounded-full bg-background/80 px-3 py-1">
                <BookOpen data-icon="inline-start" />
                {deckTitle}
              </Badge>
              <Link href="/anki" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4")}>
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
          {state.phase === "complete" ? <StudySession.Complete deckTitle={deckTitle} /> : null}
          {state.phase === "active" && state.activeCard ? (
            <>
              <StudySession.Prompt prompt={state.activeCard.front} />
              <StudySession.Answer answer={state.activeCard.back} visible={state.isAnswerVisible} />
              <StudySession.Grades
                isAnswerVisible={state.isAnswerVisible}
                isPending={isPending}
                onHideAnswer={hideAnswer}
                onRevealAnswer={revealAnswer}
                onSubmitGrade={submitGrade}
              />
            </>
          ) : null}
        </StudySession.Root>
      </AnkiPageShell.Body>
    </AnkiPageShell.Root>
  );
}
