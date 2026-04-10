"use client";

import Link from "next/link";
import { useState } from "react";
import { Layers3, Sparkles } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { QuizBuilderHeader } from "../components/admin/quiz-builder-header";
import { QuizBuilderSections } from "../components/admin/quiz-builder-sections";
import { QuestionEditorDialog } from "../components/admin/question-editor-dialog";
import { getQuizRecord } from "../lib/mock-data";

/**
 * Renders the admin quiz builder screen.
 * @param props Quiz identifier to load into the builder.
 * @returns Interactive builder layout.
 */
export function AdminQuizBuilderPage({ quizId }: { quizId: string }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const quiz = getQuizRecord(quizId);

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/admin/quizzes" />}>Quiz Studio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{quiz.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <QuizBuilderHeader quiz={quiz} />
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <Tabs defaultValue="builder">
          <TabsList variant="line">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="outline">Section outline</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
              <CardContent className="flex flex-col gap-5 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Structure</p>
                  <h2 className="mt-2 font-heading text-2xl">What this quiz feels like</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {quiz.sections.map((section) => (
                    <button key={section.id} type="button" className="rounded-[1.25rem] border border-border/60 bg-background/75 p-4 text-left transition-colors hover:bg-background">
                      <p className="font-medium text-foreground">{section.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.questions.length} questions · {section.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <QuizBuilderSections quiz={quiz} onOpenEditor={() => setIsEditorOpen(true)} />
          </TabsContent>

          <TabsContent value="outline">
            <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
              <CardContent className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                {quiz.sections.map((section) => (
                  <div key={section.id} className="rounded-[1.5rem] border border-border/60 bg-background/75 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Section {section.order}</p>
                    <h3 className="mt-2 font-heading text-2xl">{section.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-sm text-muted-foreground">
                      <Layers3 className="size-4" />
                      {section.questions.length} prompts
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Builder note</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">The builder is intentionally dense but still soft-edged, because authoring needs more signal than spectacle once real content starts stacking up.</p>
            </div>
            <Link href={`/admin/quizzes/${quiz.id}/preview`} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background">
              <Sparkles className="size-4" />
              Preview learner view
            </Link>
          </CardContent>
        </Card>
      </QuizPageShell.Body>

      <QuestionEditorDialog open={isEditorOpen} onOpenChange={setIsEditorOpen} />
    </QuizPageShell.Root>
  );
}
