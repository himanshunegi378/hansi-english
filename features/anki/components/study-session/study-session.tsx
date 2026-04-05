"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, RotateCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function Prompt({ prompt }: { prompt: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="gap-3 border-b border-border/60 bg-secondary/25 p-5 sm:p-6">
          <CardTitle className="font-heading text-3xl tracking-tight">Front of card</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Pause before revealing the answer and try to retrieve it from memory.
          </p>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <p className="text-lg leading-8 text-foreground sm:text-2xl sm:leading-10">{prompt}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Answer({ answer, visible }: { answer: string; visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="gap-3 border-b border-border/60 bg-secondary/20 p-5 sm:p-6">
          <CardTitle className="font-heading text-2xl tracking-tight">Back of card</CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <p className="text-base leading-7 text-foreground sm:text-lg sm:leading-8">{answer}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Grades({
  isAnswerVisible,
  isPending,
  onHideAnswer,
  onRevealAnswer,
  onSubmitGrade,
}: {
  isAnswerVisible: boolean;
  isPending: boolean;
  onHideAnswer: () => void;
  onRevealAnswer: () => void;
  onSubmitGrade: (grade: ReviewGrade) => void;
}) {
  const grades: Array<{ grade: ReviewGrade; label: string }> = [
    { grade: 1, label: "Again" },
    { grade: 2, label: "Hard" },
    { grade: 3, label: "Good" },
    { grade: 4, label: "Easy" },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-[2rem] border border-border/60 bg-card/90 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="outline" className="rounded-full bg-background/80 px-3 py-1">
          <Zap data-icon="inline-start" />
          Grade after you reveal the answer
        </Badge>
        <Button variant="outline" className="rounded-full" onClick={isAnswerVisible ? onHideAnswer : onRevealAnswer}>
          {isAnswerVisible ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />}
          {isAnswerVisible ? "Hide answer" : "Reveal answer"}
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {grades.map((item) => (
          <Button
            key={item.grade}
            variant={item.grade >= 3 ? "default" : "outline"}
            className="rounded-full"
            disabled={!isAnswerVisible || isPending}
            onClick={() => onSubmitGrade(item.grade)}
          >
            {isPending && item.grade === 1 ? <RotateCcw data-icon="inline-start" /> : null}
            {item.label}
          </Button>
        ))}
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
  Answer,
  Complete,
  Empty,
  Grades,
  Progress: ProgressPanel,
  Prompt,
  Root,
};
