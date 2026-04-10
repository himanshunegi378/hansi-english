import { GripVertical, PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionTypeBadge } from "../shared/quiz-badges";
import type { QuizUiRecord } from "../../types/ui";

interface QuizBuilderSectionsProps {
  onOpenEditor: () => void;
  quiz: QuizUiRecord;
}

/**
 * Renders section and question cards for the admin builder surface.
 * @param props Quiz structure and editor trigger.
 * @returns Builder section stack.
 */
export function QuizBuilderSections({ onOpenEditor, quiz }: QuizBuilderSectionsProps) {
  return (
    <div className="flex flex-col gap-5">
      {quiz.sections.map((section) => (
        <Card key={section.id} className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-sm">
          <CardHeader className="gap-4 border-b border-border/60 bg-secondary/25 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <GripVertical className="mt-1 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-heading text-2xl">{section.title}</CardTitle>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full"><PencilLine data-icon="inline-start" />Edit section</Button>
                <Button variant="outline" className="rounded-full"><Trash2 data-icon="inline-start" />Delete</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            {section.questions.map((question) => (
              <div key={question.id} className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex max-w-3xl items-start gap-3">
                    <GripVertical className="mt-1 text-muted-foreground" />
                    <div className="flex flex-col gap-2">
                      <QuestionTypeBadge type={question.type} />
                      <h3 className="font-medium text-foreground">{question.text}</h3>
                      <p className="text-sm text-muted-foreground">{question.points} pts · {question.isRequired ? "Required" : "Optional"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full" onClick={onOpenEditor}><PencilLine data-icon="inline-start" />Edit</Button>
                    <Button variant="outline" className="rounded-full"><Plus data-icon="inline-start" />Duplicate</Button>
                    <Button variant="outline" className="rounded-full"><Trash2 data-icon="inline-start" />Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="rounded-full self-start" onClick={onOpenEditor}>
              <Plus data-icon="inline-start" />
              Add question
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button className="rounded-full self-start">
        <Plus data-icon="inline-start" />
        Add section
      </Button>
    </div>
  );
}
