import { Field, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { QuestionTypeBadge } from "../shared/quiz-badges";
import type { QuizUiQuestion } from "../../types/ui";

interface QuizQuestionCardProps {
  answer: string | string[] | null;
  isMarked: boolean;
  onAnswerChange: (value: string | string[]) => void;
  onMarkToggle: (nextValue: boolean) => void;
  question: QuizUiQuestion;
}

/**
 * Renders the active question and answer controls.
 * @param props Current question state and handlers.
 * @returns Question content card.
 */
export function QuizQuestionCard({
  answer,
  isMarked,
  onAnswerChange,
  onMarkToggle,
  question,
}: QuizQuestionCardProps) {
  const selectedValues = Array.isArray(answer) ? answer : [];

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <QuestionTypeBadge type={question.type} />
        <span className="rounded-full border border-border/60 bg-background/75 px-3 py-1 text-sm text-muted-foreground">{question.points} pts</span>
        {question.isRequired ? <span className="rounded-full border border-border/60 bg-background/75 px-3 py-1 text-sm text-muted-foreground">Required</span> : null}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Question {question.order}</p>
        <h3 className="font-heading text-3xl leading-tight">{question.text}</h3>
      </div>

      <div className="mt-6">
        {question.type === "SINGLE_CHOICE" || question.type === "TRUE_FALSE" ? (
          <FieldSet>
            <FieldLegend variant="label">Choose one option</FieldLegend>
            <RadioGroup value={typeof answer === "string" ? answer : ""} onValueChange={(value) => onAnswerChange(value)}>
              {question.options.map((option) => (
                <label key={option.id} className="flex items-start gap-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                  <RadioGroupItem value={option.id} aria-label={option.text} />
                  <div className="text-sm leading-7 text-foreground/85">{option.text}</div>
                </label>
              ))}
            </RadioGroup>
          </FieldSet>
        ) : null}

        {question.type === "MULTIPLE_CHOICE" ? (
          <FieldSet>
            <FieldLegend variant="label">Select all that apply</FieldLegend>
            <div className="grid gap-3">
              {question.options.map((option) => {
                const checked = selectedValues.includes(option.id);
                return (
                  <label key={option.id} className="flex items-start gap-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                    <Checkbox checked={checked} onCheckedChange={() => onAnswerChange(checked ? selectedValues.filter((value) => value !== option.id) : [...selectedValues, option.id])} />
                    <div className="text-sm leading-7 text-foreground/85">{option.text}</div>
                  </label>
                );
              })}
            </div>
          </FieldSet>
        ) : null}

        {question.type === "SHORT_ANSWER" ? (
          <Field>
            <FieldLabel htmlFor={question.id}>Your answer</FieldLabel>
            <Textarea id={question.id} value={typeof answer === "string" ? answer : ""} onChange={(event) => onAnswerChange(event.target.value)} className="min-h-40 rounded-[1.5rem] bg-background/70" />
          </Field>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-[1.25rem] border border-border/60 bg-background/70 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Mark for review</p>
          <p className="text-sm text-muted-foreground">Keep this question in your final check before submit.</p>
        </div>
        <Switch checked={isMarked} onCheckedChange={onMarkToggle} />
      </div>
    </div>
  );
}
