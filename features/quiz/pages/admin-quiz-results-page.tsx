import Link from "next/link";
import { ArrowUpRight, Download, Filter } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttemptStatusBadge, PassFailBadge } from "../components/shared/quiz-badges";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { StatCard } from "../components/shared/stat-card";
import { getAttemptRecords, getQuizAnalytics, getQuizRecord } from "../lib/mock-data";

/**
 * Renders the quiz analytics and results overview screen.
 * @param props Quiz identifier to inspect.
 * @returns Results overview page.
 */
export function AdminQuizResultsPage({ quizId }: { quizId: string }) {
  const quiz = getQuizRecord(quizId);
  const analytics = getQuizAnalytics(quizId);
  const attempts = getAttemptRecords(quizId);

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/admin/quizzes" />}>Quiz Studio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink render={<Link href={`/admin/quizzes/${quiz.id}/edit`} />}>{quiz.title}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Results</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard label="Attempts" value={`${analytics.totalAttempts}`} detail="Total learners who reached submit." />
          <StatCard label="Average score" value={`${analytics.averageScore}%`} detail="Blended across auto and manual grading." />
          <StatCard label="Pass rate" value={`${analytics.passRate}%`} detail="Learners crossing the passing threshold." />
          <StatCard label="Completion" value={`${analytics.completionRate}%`} detail="Started attempts that reached submission." />
        </div>

        <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,0.7fr))_auto]">
              <Input defaultValue="Aarav" className="h-12 rounded-2xl" />
              <Input defaultValue="This week" className="h-12 rounded-2xl" />
              <Input defaultValue="70-100%" className="h-12 rounded-2xl" />
              <Button variant="outline" className="h-12 rounded-2xl"><Filter data-icon="inline-start" />Apply filters</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Attempts table</p>
                <h2 className="mt-2 font-heading text-3xl">Who is succeeding, and who still needs grading?</h2>
              </div>
              <Button variant="outline" className="rounded-full"><Download data-icon="inline-start" />Export</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Attempt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="whitespace-normal"><div className="flex flex-col"><span className="font-medium">{attempt.learnerName}</span><span className="text-sm text-muted-foreground">{attempt.learnerEmail}</span></div></TableCell>
                    <TableCell>#{attempt.attemptNumber}</TableCell>
                    <TableCell><AttemptStatusBadge status={attempt.status} /></TableCell>
                    <TableCell><div className="flex items-center gap-2"><span>{attempt.score ?? "Pending"}/{attempt.maxScore}</span><PassFailBadge passed={attempt.passed} /></div></TableCell>
                    <TableCell>{attempt.startedAt}</TableCell>
                    <TableCell>{attempt.submittedAt ?? "Still open"}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/attempts/${attempt.id}/review`} className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm font-medium hover:bg-background">
                        View details
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
