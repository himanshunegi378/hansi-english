"use client";

import { CheckCircle2, CircleHelp, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { StoryProgress } from "../../types";

interface QuizHeaderProps {
  answeredCount: number;
  completionPercent: number;
  currentQuestionIndex: number;
  progress: StoryProgress | null;
  totalQuestions: number;
}

/**
 * Renders the quiz headline, completion bar, and points summary.
 * @param props The current question and score state.
 * @returns The quiz header block.
 */
export function QuizHeader({
  answeredCount,
  completionPercent,
  currentQuestionIndex,
  progress,
  totalQuestions,
}: QuizHeaderProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Study tools
          </p>
          <h3 className="font-heading text-2xl text-foreground">Comprehension check</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <Trophy data-icon="inline-start" />
            {progress?.earnedPoints ?? 0}/{progress?.totalPoints ?? totalQuestions * 10} pts
          </Badge>
          <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">
            <CircleHelp data-icon="inline-start" />
            {answeredCount}/{totalQuestions} answered
          </Badge>
          {progress?.completedAt ? (
            <Badge className="rounded-full px-3 py-1">
              <CheckCircle2 data-icon="inline-start" />
              Completed
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-foreground">Completion</span>
          <span className="text-muted-foreground">{completionPercent}%</span>
        </div>
        <Progress value={completionPercent} />
      </div>
    </div>
  );
}
