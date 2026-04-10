import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { PassFailBadge } from "../components/shared/quiz-badges";
import { ResultReviewAccordion } from "../components/learner/result-review-accordion";
import { StatCard } from "../components/shared/stat-card";
import { getAttemptRecord } from "../lib/mock-data";

/**
 * Renders the learner result screen.
 * @param props Attempt identifier from the route.
 * @returns Result page.
 */
export function QuizResultPage({ attemptId }: { attemptId: string }) {
  const attempt = getAttemptRecord(attemptId);
  const correctCount = attempt.answers.filter((answer) => answer.isCorrect === true).length;
  const incorrectCount = attempt.answers.filter((answer) => answer.isCorrect === false).length;
  const unansweredCount = attempt.answers.filter((answer) => answer.isCorrect === null).length;

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Body>
        <div className="rounded-[2rem] border border-border/70 bg-card/90 p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Result</p>
              <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">{attempt.quizTitle}</h1>
              <p className="text-sm leading-7 text-muted-foreground">Submitted at {attempt.submittedAt ?? "Apr 13, 2026 · 9:32 AM"}.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">{attempt.score ?? 0}/{attempt.maxScore} points</Badge>
              <PassFailBadge passed={attempt.passed} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Correct" value={`${correctCount}`} detail="Questions you handled with confidence." />
          <StatCard label="Incorrect" value={`${incorrectCount}`} detail="Items worth another pass." />
          <StatCard label="Unanswered" value={`${unansweredCount}`} detail="Prompts still waiting on review or grading." />
        </div>

        <ResultReviewAccordion attempt={attempt} />

        <QuizPageShell.Actions>
          <Button className="rounded-full" render={<Link href={`/quizzes/${attempt.quizId}`} />} nativeButton={false}>Retake quiz</Button>
          <Button variant="outline" className="rounded-full" render={<Link href="/quizzes" />} nativeButton={false}>Back to list</Button>
        </QuizPageShell.Actions>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
