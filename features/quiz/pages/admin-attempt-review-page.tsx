import Link from "next/link";
import { ChevronLeft, Save, Send } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttemptStatusBadge, PassFailBadge, QuestionTypeBadge } from "../components/shared/quiz-badges";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { getAttemptRecord } from "../lib/mock-data";

/**
 * Renders the manual grading and attempt review screen.
 * @param props Attempt identifier to review.
 * @returns Attempt review surface.
 */
export function AdminAttemptReviewPage({ attemptId }: { attemptId: string }) {
  const attempt = getAttemptRecord(attemptId);

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/admin/quizzes" />}>Quiz Studio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink render={<Link href={`/admin/quizzes/${attempt.quizId}/results`} />}>{attempt.quizTitle}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{attempt.learnerName}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <Card className="rounded-[1.75rem] border-border/70 bg-card/90 shadow-sm">
          <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Attempt review</p>
                <h1 className="font-heading text-4xl tracking-tight">{attempt.learnerName}</h1>
                <p className="text-sm leading-7 text-muted-foreground">{attempt.quizTitle} · Attempt #{attempt.attemptNumber} · {attempt.learnerEmail}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <AttemptStatusBadge status={attempt.status} />
                <PassFailBadge passed={attempt.passed} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Started</p><p className="mt-2 font-medium">{attempt.startedAt}</p></div>
              <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Submitted</p><p className="mt-2 font-medium">{attempt.submittedAt ?? "Not submitted"}</p></div>
              <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Score</p><p className="mt-2 font-medium">{attempt.score ?? "Pending"}/{attempt.maxScore}</p></div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          {attempt.answers.map((answer) => (
            <Card key={answer.id} className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
              <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <QuestionTypeBadge type={answer.questionType} />
                  <PassFailBadge passed={answer.isCorrect} />
                </div>
                <h2 className="font-medium text-foreground">{answer.questionText}</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learner answer</p><p className="mt-2 text-sm leading-7 text-foreground/85">{answer.learnerAnswer}</p></div>
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Correct answer</p><p className="mt-2 text-sm leading-7 text-foreground/85">{answer.correctAnswer}</p></div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Awarded points</p>
                    <Input type="number" defaultValue={answer.awardedPoints ?? ""} className="mt-3" />
                  </div>
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Feedback</p>
                    <Textarea defaultValue={answer.feedback} className="mt-3 min-h-28 rounded-[1.25rem]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <QuizPageShell.Actions>
          <Button variant="outline" className="rounded-full" render={<Link href={`/admin/quizzes/${attempt.quizId}/results`} />}><ChevronLeft data-icon="inline-start" />Back to results</Button>
          <Button variant="outline" className="rounded-full"><Save data-icon="inline-start" />Save grading</Button>
          <Button className="rounded-full"><Send data-icon="inline-start" />Finalize grading</Button>
        </QuizPageShell.Actions>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
