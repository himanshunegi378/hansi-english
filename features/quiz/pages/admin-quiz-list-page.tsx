import Link from "next/link";
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuizPageIntro } from "../components/shared/quiz-page-intro";
import { QuizPageShell } from "../components/shared/quiz-page-shell";
import { AdminQuizTable } from "../components/admin/admin-quiz-table";
import { getQuizLibrary } from "../lib/mock-data";

/**
 * Renders the admin quiz list screen.
 * @returns The quiz list management surface.
 */
export function AdminQuizListPage() {
  const quizzes = getQuizLibrary();

  return (
    <QuizPageShell.Root>
      <QuizPageShell.Header>
        <QuizPageIntro
          eyebrow="Admin / Quiz Studio"
          title="Shape the library before learners ever see a question."
          description="The list view is intentionally editorial instead of spreadsheet-heavy, so status, structure, and freshness are readable at a glance before you dive into builder work."
          actions={(
            <Button className="rounded-full" render={<Link href="/admin/quizzes/new" />} nativeButton={false}>
              <Plus data-icon="inline-start" />
              Create quiz
            </Button>
          )}
          meta={
            <>
              <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">{quizzes.length} quizzes in rotation</Badge>
              <Badge variant="outline" className="rounded-full bg-background/70 px-3 py-1">Warm editorial admin UI</Badge>
            </>
          }
        />
      </QuizPageShell.Header>

      <QuizPageShell.Body>
        <div className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
          <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.8fr))]">
            <Field>
              <FieldLabel htmlFor="quiz-search">Search quizzes</FieldLabel>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="quiz-search" defaultValue="JavaScript" className="h-12 rounded-2xl pl-12" />
              </div>
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select defaultValue="all">
                <SelectTrigger className="h-12 w-full rounded-2xl"><Filter /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Sort</FieldLabel>
              <Select defaultValue="recent">
                <SelectTrigger className="h-12 w-full rounded-2xl"><SlidersHorizontal /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="recent">Recently updated</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </div>

        <AdminQuizTable quizzes={quizzes} />
      </QuizPageShell.Body>
    </QuizPageShell.Root>
  );
}
