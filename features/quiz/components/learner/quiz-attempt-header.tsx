import { Clock3, Save, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuizAttemptHeaderProps {
  answeredCount: number;
  autosaveLabel: string;
  currentIndex: number;
  reviewCount: number;
  timeRemaining: string;
  totalQuestions: number;
}

/**
 * Renders the sticky summary header for the learner attempt screen.
 * @param props Attempt progress and status values.
 * @returns Attempt header block.
 */
export function QuizAttemptHeader({
  answeredCount,
  autosaveLabel,
  currentIndex,
  reviewCount,
  timeRemaining,
  totalQuestions,
}: QuizAttemptHeaderProps) {
  const progressValue = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">In progress</p>
          <h2 className="font-heading text-3xl">Question {currentIndex + 1} of {totalQuestions}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{answeredCount} answered · {reviewCount} marked for review</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1"><Clock3 data-icon="inline-start" />{timeRemaining}</Badge>
          <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1"><Save data-icon="inline-start" />{autosaveLabel}</Badge>
          <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1"><TimerReset data-icon="inline-start" />Auto-save active</Badge>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Progress</span>
          <span className="text-muted-foreground">{progressValue}%</span>
        </div>
        <Progress value={progressValue} />
      </div>
    </div>
  );
}
