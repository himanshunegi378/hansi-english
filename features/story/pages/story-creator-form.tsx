"use client";

import { type FieldError as HookFormFieldError, type UseFormRegister } from "react-hook-form";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type GenerateStoryInput } from "../schemas";
import { type EnglishLevel } from "../types";

const levelOrder: EnglishLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const levelLabels: Record<EnglishLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const levelDescriptions: Record<EnglishLevel, string> = {
  BEGINNER: "Simple vocabulary and shorter sentences for early confidence.",
  INTERMEDIATE: "Natural phrasing and richer context for everyday comprehension.",
  ADVANCED: "Nuanced language and layered meaning for confident readers.",
};

const levelAudience: Record<EnglishLevel, string> = {
  BEGINNER: "Best for learners who still need short sentences and obvious context clues.",
  INTERMEDIATE: "Best for learners who can follow everyday English and want more variety.",
  ADVANCED: "Best for learners who are ready for tone, inference, and richer vocabulary.",
};

const levelSignals: Record<EnglishLevel, string[]> = {
  BEGINNER: ["short sentences", "direct plot", "high clarity"],
  INTERMEDIATE: ["natural dialogue", "mixed sentence length", "strong context"],
  ADVANCED: ["subtle meaning", "richer vocabulary", "more inference"],
};

interface StoryCreatorFormProps {
  isGeneratingStory: boolean;
  level: EnglishLevel;
  onLevelChange: (level: EnglishLevel) => void;
  onSubmit: () => void;
  promptError?: HookFormFieldError;
  register: UseFormRegister<GenerateStoryInput>;
}

/**
 * Renders the admin story configuration form with prompt and level controls.
 * @param props Form bindings plus current generation state.
 * @returns The story setup card.
 */
export function StoryCreatorForm({
  isGeneratingStory,
  level,
  onLevelChange,
  onSubmit,
  promptError,
  register,
}: StoryCreatorFormProps) {
  const selectedSignals = levelSignals[level];

  return (
    <Card className="rounded-[2rem] border-border/80 bg-card shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="font-heading text-2xl text-foreground">
          Set up the story brief
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-7 text-foreground/75">
          Start with a topic, then choose the reading level that matches the learners who will
          open this story.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <FieldGroup>
            <Field data-invalid={Boolean(promptError)}>
              <FieldLabel htmlFor="story-prompt" className="text-foreground">
                Story prompt
              </FieldLabel>
              <Textarea
                id="story-prompt"
                aria-invalid={Boolean(promptError)}
                placeholder="Describe the setting, mood, or idea you want the story to explore."
                className="min-h-32 resize-none rounded-3xl border-border bg-background px-5 py-4 text-base leading-7 text-foreground shadow-none placeholder:text-muted-foreground/80"
                {...register("prompt", {
                  minLength: {
                    value: 5,
                    message: "Prompt must be at least 5 characters long.",
                  },
                  maxLength: {
                    value: 500,
                    message: "Prompt must be less than 500 characters.",
                  },
                  required: "Prompt is required.",
                })}
              />
              <FieldDescription className="text-foreground/70">
                Good prompts usually specify a place, situation, or character without over-directing
                every sentence.
              </FieldDescription>
              <FieldError errors={promptError ? [promptError] : undefined} />
            </Field>

            <FieldSet>
              <FieldLegend>Reading level</FieldLegend>
              <FieldDescription className="text-foreground/70">
                Choose the level by the reading experience you want the learner to have, not just
                by difficulty in the abstract.
              </FieldDescription>
              <ToggleGroup
                className="w-full flex-col gap-3 sm:flex-row"
                multiple={false}
                value={[level]}
                onValueChange={(values) => {
                  const nextLevel = values[0] as EnglishLevel | undefined;

                  if (nextLevel) {
                    onLevelChange(nextLevel);
                  }
                }}
              >
                {levelOrder.map((levelOption) => (
                  <ToggleGroupItem
                    key={levelOption}
                    value={levelOption}
                    variant="outline"
                    size="lg"
                    className="flex h-auto flex-1 flex-col items-start gap-3 rounded-3xl border-border bg-background px-4 py-4 text-left shadow-sm hover:border-foreground/20 hover:bg-secondary/70 data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:shadow-md data-[state=on]:ring-2 data-[state=on]:ring-primary/15"
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-semibold text-foreground">
                          {levelLabels[levelOption]}
                        </span>
                        <span className="text-sm leading-6 text-foreground/80">
                          {levelDescriptions[levelOption]}
                        </span>
                      </div>
                      {level === levelOption ? (
                        <span className="rounded-full bg-primary/10 p-1 text-primary">
                          <CheckCircle2 />
                        </span>
                      ) : null}
                    </div>

                    <span className="text-xs leading-6 text-foreground/70">
                      {levelAudience[levelOption]}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {levelSignals[levelOption].map((signal) => (
                        <Badge
                          key={signal}
                          variant="outline"
                          className="rounded-full border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                        >
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <div className="rounded-[1.5rem] border border-border bg-secondary/55 p-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-foreground/65">
                    Selected level
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {levelLabels[level]}
                    </Badge>
                    <p className="text-sm leading-7 text-foreground/80">
                      {levelAudience[level]}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSignals.map((signal) => (
                      <Badge
                        key={signal}
                        variant="outline"
                        className="rounded-full border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                      >
                        {signal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </FieldSet>
          </FieldGroup>

          <Button type="submit" className="w-full rounded-full sm:w-auto" disabled={isGeneratingStory}>
            {isGeneratingStory ? <Spinner data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
            {isGeneratingStory ? "Generating story..." : "Generate story"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
