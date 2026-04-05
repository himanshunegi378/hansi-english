"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, RotateCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReviewGrade } from "../../backend/types";
import type { AnkiStudySessionState } from "../../types/ui";
import { AnkiEmptyState } from "../shared/anki-empty-state";

function Root({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-col gap-5">{children}</section>;
}

function ProgressPanel({ state }: { state: AnkiStudySessionState }) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-border/60 bg-card/90 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">Session progress</p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {state.reviewedCount}/{state.totalCount} reviewed
        </p>
      </div>
      <Progress value={state.progressValue} />
    </div>
  );
}

/**
 * Presents a study prompt and its revealed answer with separate visual states.
 */
function Flashcard({
  front,
  back,
  isRevealed,
  isPending,
  onReveal,
  onGrade,
}: {
  front: string;
  back: string;
  isRevealed: boolean;
  isPending: boolean;
  onReveal: () => void;
  onGrade: (grade: ReviewGrade) => void;
}) {
  const grades: Array<{ grade: ReviewGrade; label: string }> = [
    { grade: 1, label: "Again" },
    { grade: 2, label: "Hard" },
    { grade: 3, label: "Good" },
    { grade: 4, label: "Easy" },
  ];

  return (
    <div className="relative h-110 w-full transform-gpu sm:h-100">
      <div
        className={cn(
          "relative h-full w-full transition-all duration-700 transform-3d",
          isRevealed && "transform-[rotateY(180deg)]",
        )}
      >
        {/* Front Face */}
        <div className="backface-hidden absolute inset-0 translate-z-0 antialiased">
          <Card className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-secondary/30 shadow-sm ring-1 ring-border/40 transition-colors hover:border-primary/15">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-background/70 via-secondary/40 to-transparent" />
            <CardHeader className="relative gap-2 border-b border-border/60 bg-background/60 p-5 backdrop-blur-sm">
              <Badge
                variant="outline"
                className="w-fit rounded-full bg-background/80 text-muted-foreground"
              >
                Prompt Side
              </Badge>
              <CardTitle className="font-heading text-xl tracking-tight sm:text-2xl">
                Question
              </CardTitle>
              <CardDescription className="text-xs">
                Recall the answer from memory before you reveal.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center p-6 text-center">
              <p className="max-w-2xl text-lg font-medium text-foreground sm:text-2xl">
                {front}
              </p>
            </CardContent>
            <CardFooter className="border-border/60 bg-background/75 p-4">
              <Button
                className="w-full rounded-full"
                size="lg"
                onClick={onReveal}
              >
                Reveal Answer
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Back Face */}
        <div className="backface-hidden absolute inset-0 translate-z-0 antialiased transform-[rotateY(180deg)]">
          <Card className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-primary/15 bg-primary/6 shadow-sm shadow-primary/8 ring-1 ring-primary/10">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-background/50" />
            <CardHeader className="relative gap-1 border-b border-primary/10 bg-background/70 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-xl tracking-tight">
                  Answer
                </CardTitle>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-background/85"
                >
                  <Zap className="mr-1 h-3 w-3" />
                  Grade Session
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Check your recall, then choose how it felt.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative flex flex-1 items-center justify-center p-6 text-center">
              <p className="max-w-2xl text-base leading-7 text-foreground sm:text-lg">
                {back}
              </p>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 border-primary/10 bg-background/80 p-4 sm:grid-cols-4">
              {grades.map((item) => (
                <Button
                  key={item.grade}
                  variant={item.grade >= 3 ? "default" : "outline"}
                  className="rounded-full"
                  disabled={isPending}
                  onClick={() => onGrade(item.grade)}
                >
                  {isPending && item.grade === 1 ? (
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {item.label}
                </Button>
              ))}
            </CardFooter>
          </Card>
        </div>
      </div>
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
