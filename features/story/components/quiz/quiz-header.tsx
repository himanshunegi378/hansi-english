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
    <div className="flex flex-col gap-4 px-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold text-foreground">Comprehension Check</h3>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <Trophy data-icon="inline-start" />
            {progress?.earnedPoints ?? 0}/{progress?.totalPoints ?? totalQuestions * 10} pts
          </Badge>
          <Badge variant="outline">
            <CircleHelp data-icon="inline-start" />
            {answeredCount}/{totalQuestions} answered
          </Badge>
          {progress?.completedAt ? (
            <Badge>
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
