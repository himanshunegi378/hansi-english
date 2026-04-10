import Link from "next/link";
import { Archive, Eye, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuizStatusBadge } from "../shared/quiz-badges";
import type { QuizUiRecord } from "../../types/ui";

/**
 * Renders the top control strip for the admin quiz builder.
 * @param props Quiz record used to seed the builder header.
 * @returns Builder header block.
 */
export function QuizBuilderHeader({ quiz }: { quiz: QuizUiRecord }) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <FieldGroup className="max-w-3xl">
          <Field>
            <FieldLabel htmlFor="builder-title">Quiz title</FieldLabel>
            <Input id="builder-title" defaultValue={quiz.title} className="h-12 rounded-2xl bg-background/70 text-lg font-medium" />
          </Field>
          <Field>
            <FieldLabel htmlFor="builder-description">Description</FieldLabel>
            <Textarea id="builder-description" defaultValue={quiz.description} className="min-h-28 rounded-[1.5rem] bg-background/70" />
          </Field>
        </FieldGroup>

        <div className="flex flex-col items-start gap-3">
          <QuizStatusBadge status={quiz.status} />
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full"><Save data-icon="inline-start" />Save changes</Button>
            <Button variant="outline" className="rounded-full"><Send data-icon="inline-start" />Publish</Button>
            <Button variant="outline" className="rounded-full"><Archive data-icon="inline-start" />Archive</Button>
            <Button variant="outline" className="rounded-full" render={<Link href={`/admin/quizzes/${quiz.id}/preview`} />} nativeButton={false}>
              <Eye data-icon="inline-start" />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
