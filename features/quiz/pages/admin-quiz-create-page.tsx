import Link from "next/link";
import { ChevronLeft, Save, Sparkles } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QuizPageShell } from "../components/shared/quiz-page-shell";

/**
 * Renders the admin create-quiz screen.
 * @returns The quiz creation form surface.
 */
export function AdminQuizCreatePage() {
  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link href="/admin/quizzes" />}>Quiz Studio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Create quiz</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
          <CardContent className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1.1fr)_20rem]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">New quiz</p>
                <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">Start with the shell, then build the pressure points.</h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">This first form only sets the top-level quiz posture: title, tone, timing, and the threshold learners need to cross.</p>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="quiz-title">Title</FieldLabel>
                  <Input id="quiz-title" defaultValue="JavaScript Basics Quiz" className="h-12 rounded-2xl" />
                  <FieldError>Title is required</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="quiz-description">Description</FieldLabel>
                  <Textarea id="quiz-description" defaultValue="Quiz for core JS fundamentals with a lightweight practical tone." className="min-h-32 rounded-[1.5rem]" />
                </Field>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select defaultValue="draft">
                      <SelectTrigger className="h-12 w-full rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="time-limit">Time limit</FieldLabel>
                    <Input id="time-limit" type="number" defaultValue="20" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="passing-score">Passing score</FieldLabel>
                    <Input id="passing-score" type="number" defaultValue="60" />
                  </Field>
                </div>
              </FieldGroup>

              <QuizPageShell.Actions>
                <Button variant="outline" className="rounded-full" render={<Link href="/admin/quizzes" />} nativeButton={false}><ChevronLeft data-icon="inline-start" />Cancel</Button>
                <Button variant="outline" className="rounded-full"><Save data-icon="inline-start" />Save draft</Button>
                <Button className="rounded-full" render={<Link href="/admin/quizzes/js-basics/edit" />} nativeButton={false}><Sparkles data-icon="inline-start" />Save and continue</Button>
              </QuizPageShell.Actions>
            </div>

            <div className="rounded-[1.75rem] border border-border/60 bg-background/70 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Before you save</p>
              <div className="mt-4 flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
                <p>Keep the title concrete and outcome-led so it reads clearly in the learner catalog.</p>
                <p>Use draft status when the quiz still needs sections, questions, or answer review.</p>
                <p>Time limits work best when they create focus, not panic. Keep them honest to the question count.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
