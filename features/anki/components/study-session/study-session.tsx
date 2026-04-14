"use client";

import { animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import type { ReviewGrade } from "../../backend/types";
import type { AnkiStudySessionState } from "../../types/ui";
import { AnkiEmptyState } from "../shared/anki-empty-state";

function Root({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-col gap-5">{children}</section>;
}

function ProgressPanel({ state }: { state: AnkiStudySessionState }) {
  const animatedProgressValue = useAnimatedProgressValue(state.progressValue);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-card/90 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">Session progress</p>
        <div className="text-right">
          <p className="text-sm text-muted-foreground tabular-nums">
            {state.reviewedCount}/{state.totalCount} reviewed
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {Math.round(animatedProgressValue)}%
          </p>
        </div>
      </div>
      <Progress value={animatedProgressValue} />
    </div>
  );
}

/**
 * Smoothly interpolates progress changes so UI feedback feels continuous.
 */
function useAnimatedProgressValue(value: number) {
  const [animatedValue, setAnimatedValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const controls = animate(previousValueRef.current, value, {
      duration: 0.35,
      ease: "easeOut",
      onUpdate(latestValue) {
        setAnimatedValue(latestValue);
      },
    });

    previousValueRef.current = value;

    return () => {
      controls.stop();
    };
  }, [value]);

  return animatedValue;
}

/**
 * Presents a study prompt and its revealed answer with separate visual states.
 */
function Flashcard({
  front,
  back,
  isRevealed,
  isPending,
  onToggleReveal,
  onGrade,
}: {
  front: string;
  back: string;
  isRevealed: boolean;
  isPending: boolean;
  onToggleReveal: () => void;
  onGrade: (grade: ReviewGrade) => void;
}) {
  const grades: Array<{ grade: ReviewGrade; label: string }> = [
    // { grade: 1, label: "Again" },
    { grade: 2, label: "Hard" },
    { grade: 3, label: "Good" },
    { grade: 4, label: "Easy" },
  ];

  return (
    <div className="flex flex-col gap-6 py-2 sm:gap-7 sm:py-3">
      <div className="relative h-110 w-full px-4 py-4 transform-gpu sm:h-100 sm:px-5 sm:py-5">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-5 inset-y-5 rounded-3xl border bg-card shadow-sm transition-all duration-700",
            isRevealed
              ? "translate-x-4 translate-y-4 rotate-6 border-primary/12 bg-primary/10 shadow-primary/10"
              : "translate-x-4 translate-y-4 rotate-6 border-border/55 bg-muted/55",
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-3 inset-y-3 rounded-2xl border bg-card shadow-sm transition-all duration-700",
            isRevealed
              ? "translate-x-2 translate-y-2 rotate-3 border-primary/16 bg-primary/8 shadow-primary/10"
              : "translate-x-2 translate-y-2 rotate-3 border-border/65 bg-card/90",
          )}
        />
        <div
          className={cn(
            "relative h-full w-full transition-all duration-300 transform-3d",
            isRevealed && "transform-[rotateY(180deg)]",
          )}
        >
          <FlashcardFront front={front} onToggleReveal={onToggleReveal} />
          <FlashcardBack back={back} onToggleReveal={onToggleReveal} />
        </div>
      </div>
      <FlashcardActions
        grades={grades}
        isPending={isPending}
        isRevealed={isRevealed}
        onGrade={onGrade}
      />
    </div>
  );
}

/**
 * Renders the question side of the study card.
 */
function FlashcardFront({
  front,
  onToggleReveal,
}: {
  front: string;
  onToggleReveal: () => void;
}) {
  return (
    <div className="backface-hidden absolute inset-0 translate-z-0 antialiased">
      <button
        type="button"
        className="block h-full w-full text-left"
        onClick={onToggleReveal}
      >
        <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm ring-1 ring-border/40 transition-colors hover:border-primary/15">
          <CardHeader className="relative gap-2 border-b border-border/60 bg-background p-5">
            <CardTitle className="font-heading text-xl tracking-tight sm:text-2xl">
              Question
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-1 flex-col p-6 text-center">
            <div className="flex flex-1 items-center justify-center">
              <p className="max-w-2xl text-lg font-medium text-foreground sm:text-2xl">
                {front}
              </p>
            </div>
            <p className="pt-4 text-center text-xs font-medium tracking-wide text-muted-foreground">
              Tap to reveal answer
            </p>
          </CardContent>
        </Card>
      </button>
    </div>
  );
}

/**
 * Renders the answer side of the study card.
 */
function FlashcardBack({
  back,
  onToggleReveal,
}: {
  back: string;
  onToggleReveal: () => void;
}) {
  return (
    <div className="backface-hidden absolute inset-0 translate-z-0 antialiased transform-[rotateY(180deg)]">
      <button
        type="button"
        className="block h-full w-full text-left"
        onClick={onToggleReveal}
      >
        <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-primary/15 bg-card shadow-sm shadow-primary/8 ring-1 ring-primary/10">
          <CardHeader className="relative gap-1 border-b border-primary/10 bg-background p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl tracking-tight">
                Answer
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex h-full flex-1 flex-col p-6 text-center">
            <div className="flex flex-1 items-center justify-center">
              <p className="max-w-2xl text-base leading-7 text-foreground sm:text-lg">
                {back}
              </p>
            </div>
            <p className="pt-4 text-center text-xs font-medium tracking-wide text-muted-foreground">
              Tap to return to question
            </p>
          </CardContent>
        </Card>
      </button>
    </div>
  );
}

/**
 * Renders detached study actions below the flashcard.
 */
function FlashcardActions({
  grades,
  isPending,
  isRevealed,
  onGrade,
}: {
  grades: Array<{ grade: ReviewGrade; label: string }>;
  isPending: boolean;
  isRevealed: boolean;
  onGrade: (grade: ReviewGrade) => void;
}) {
  if (!isRevealed) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-md bg-card shadow-sm shadow-primary/10">
      {grades.map((item) => (
        <Button
          key={item.grade}
          className={cn(
            "w-full rounded-none border-0 font-semibold shadow-none",
            item.grade !== grades[0]?.grade && "border-l border-border/60",
            item.grade === 2 &&
            "bg-chart-5/20 text-chart-5 hover:bg-chart-5/28",
            item.grade === 3 &&
            "bg-chart-2/20 text-chart-2 hover:bg-chart-2/28",
            item.grade === 4 &&
            "bg-chart-1/20 text-chart-1 hover:bg-chart-1/28",
          )}
          disabled={isPending}
          onClick={() => onGrade(item.grade)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}


function Empty() {
  return (
    <AnkiEmptyState
      actionHref="/anki"
      actionLabel="Back to decks"
      description="There are no cards due right now. That is a good sign: today’s review load is clear."
      icon={CheckCircle2}
      title="Nothing is due yet"
    />
  );
}

function Complete({ deckTitle }: { deckTitle: string }) {
  return (
    <AnkiEmptyState
      actionHref="/anki"
      actionLabel="Return to deck library"
      description={`You finished the current review queue for ${deckTitle}. Let the spacing do the rest for now.`}
      icon={CheckCircle2}
      title="Session complete"
    />
  );
}

/**
 * Compound interaction shell for deck study sessions.
 */
export const StudySession = {
  Complete,
  Empty,
  Flashcard,
  Progress: ProgressPanel,
  Root,
};
