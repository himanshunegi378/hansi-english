import Link from "next/link";
import { Eye, WandSparkles } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionTypeBadge } from "../components/shared/quiz-badges";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { getQuizRecord } from "../lib/mock-data";

/**
 * Renders the learner-facing preview of a quiz for admins.
 * @param props Quiz identifier to preview.
 * @returns Preview surface.
 */
export function AdminQuizPreviewPage({ quizId }: { quizId: string }) {
  const quiz = getQuizRecord(quizId);

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/admin/quizzes" />}>Quiz Studio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink render={<Link href={`/admin/quizzes/${quiz.id}/edit`} />}>{quiz.title}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Preview</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="gap-4 border-b border-border/60 bg-secondary/20 p-5 sm:p-8">
            <Badge className="w-fit rounded-full bg-primary/15 px-3 py-1 text-foreground"><Eye data-icon="inline-start" />Preview mode</Badge>
            <CardTitle className="font-heading text-4xl tracking-tight sm:text-5xl">{quiz.title}</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{quiz.description}</p>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{quiz.questionCount} questions</span>
              <span>•</span>
              <span>{quiz.timeLimitMin} minute timer</span>
              <span>•</span>
              <span>{quiz.passingScore}% to pass</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 p-5 sm:p-8">
            {quiz.sections.map((section) => (
              <div key={section.id} className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5 sm:p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Section {section.order}</p>
                  <h2 className="font-heading text-3xl">{section.title}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{section.description}</p>
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  {section.questions.map((question) => (
                    <div key={question.id} className="rounded-[1.5rem] border border-border/60 bg-card/85 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <QuestionTypeBadge type={question.type} />
                        <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">{question.points} pts</Badge>
                      </div>
                      <h3 className="mt-3 text-lg font-medium text-foreground">{question.text}</h3>
                      <div className="mt-4 grid gap-3">
                        {question.options.length > 0 ? question.options.map((option) => (
                          <div key={option.id} className="rounded-[1.25rem] border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground/85">{option.text}</div>
                        )) : (
                          <div className="rounded-[1.25rem] border border-dashed border-border/60 bg-background/80 px-4 py-4 text-sm text-muted-foreground">Short-answer field preview</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button className="rounded-full self-start"><WandSparkles data-icon="inline-start" />Back to builder</Button>
          </CardContent>
        </Card>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
