import { Badge } from "@/components/ui/badge";
import type { QuizUiAttemptStatus, QuizUiQuestionType, QuizUiStatus } from "../../types/ui";

const quizStatusClasses: Record<QuizUiStatus, string> = {
  DRAFT: "bg-secondary text-secondary-foreground",
  PUBLISHED: "bg-primary/15 text-foreground",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const attemptStatusClasses: Record<QuizUiAttemptStatus, string> = {
  IN_PROGRESS: "bg-accent text-accent-foreground",
  SUBMITTED: "bg-secondary text-secondary-foreground",
  AUTO_GRADED: "bg-primary/15 text-foreground",
  MANUALLY_GRADED: "bg-primary text-primary-foreground",
};

const questionTypeLabels: Record<QuizUiQuestionType, string> = {
  SINGLE_CHOICE: "Single choice",
  MULTIPLE_CHOICE: "Multiple choice",
  TRUE_FALSE: "True / false",
  SHORT_ANSWER: "Short answer",
};

/**
 * Renders a quiz status badge.
 * @param props Quiz status value.
 * @returns Styled status badge.
 */
export function QuizStatusBadge({ status }: { status: QuizUiStatus }) {
  return <Badge className={`rounded-full px-3 py-1 ${quizStatusClasses[status]}`}>{status.toLowerCase()}</Badge>;
}

/**
 * Renders an attempt status badge.
 * @param props Attempt status value.
 * @returns Styled attempt status badge.
 */
export function AttemptStatusBadge({ status }: { status: QuizUiAttemptStatus }) {
  return <Badge className={`rounded-full px-3 py-1 ${attemptStatusClasses[status]}`}>{status.toLowerCase().replaceAll("_", " ")}</Badge>;
}

/**
 * Renders a question type badge.
 * @param props Question type value.
 * @returns Styled question type badge.
 */
export function QuestionTypeBadge({ type }: { type: QuizUiQuestionType }) {
  return <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">{questionTypeLabels[type]}</Badge>;
}

/**
 * Renders a pass or fail badge.
 * @param props Nullable pass state.
 * @returns Styled pass/fail badge.
 */
export function PassFailBadge({ passed }: { passed: boolean | null }) {
  if (passed === null) {
    return <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">Pending</Badge>;
  }

  return (
    <Badge className={`rounded-full px-3 py-1 ${passed ? "bg-primary text-primary-foreground" : "bg-destructive/15 text-foreground"}`}>
      {passed ? "Passed" : "Needs work"}
    </Badge>
  );
}
