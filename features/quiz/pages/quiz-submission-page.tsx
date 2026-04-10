import Link from "next/link";
import { CheckCircle2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { getAttemptRecord } from "../lib/mock-data";

/**
 * Renders the quiz submission success screen.
 * @param props Attempt identifier from the route.
 * @returns Submission confirmation page.
 */
export function QuizSubmissionPage({ attemptId }: { attemptId: string }) {
  const attempt = getAttemptRecord(attemptId);

  return (
    <QuizPageShell.Root className="justify-center">
      <QuizPageShell.Body>
        <Card className="mx-auto max-w-2xl rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:p-12">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/15 text-primary"><CheckCircle2 className="size-10" /></div>
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Attempt submitted</p>
              <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">Your quiz is safely in.</h1>
              <p className="text-sm leading-7 text-muted-foreground">Submitted at {attempt.submittedAt ?? "Apr 13, 2026 · 9:32 AM"}. You can review the result now or head back to the quiz catalog.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="rounded-full" render={<Link href={`/attempts/${attempt.id}/result`} />} nativeButton={false}>Go to result</Button>
              <Button variant="outline" className="rounded-full" render={<Link href="/quizzes" />} nativeButton={false}><ListChecks data-icon="inline-start" />Go to quizzes</Button>
            </div>
          </CardContent>
        </Card>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
