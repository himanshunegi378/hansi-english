import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttemptStatusBadge, PassFailBadge } from "../components/shared/quiz-badges";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { getAttemptRecords } from "../lib/mock-data";

/**
 * Renders the learner attempt history screen.
 * @returns My attempts page.
 */
export function MyAttemptsPage() {
  const attempts = getAttemptRecords();

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbPage>My attempts</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">History</p>
              <h1 className="mt-2 font-heading text-4xl tracking-tight">Every run, one place.</h1>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz</TableHead>
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
                    <TableCell className="whitespace-normal"><div className="flex flex-col"><span className="font-medium">{attempt.quizTitle}</span><span className="text-sm text-muted-foreground">{attempt.learnerName}</span></div></TableCell>
                    <TableCell>#{attempt.attemptNumber}</TableCell>
                    <TableCell><AttemptStatusBadge status={attempt.status} /></TableCell>
                    <TableCell><div className="flex items-center gap-2"><span>{attempt.score ?? "Pending"}/{attempt.maxScore}</span><PassFailBadge passed={attempt.passed} /></div></TableCell>
                    <TableCell>{attempt.startedAt}</TableCell>
                    <TableCell>{attempt.submittedAt ?? "Still open"}</TableCell>
                    <TableCell className="text-right">
                      <Link href={attempt.status === "IN_PROGRESS" ? `/quizzes/${attempt.quizId}/start` : `/attempts/${attempt.id}/result`} className="rounded-full border border-border/60 px-4 py-2 text-sm font-medium hover:bg-background">
                        {attempt.status === "IN_PROGRESS" ? "Resume" : "View result"}
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
