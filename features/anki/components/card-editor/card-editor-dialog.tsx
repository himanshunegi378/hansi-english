"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

function Root({
  children,
  onOpenChange,
  open,
}: {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return <Dialog open={open} onOpenChange={onOpenChange}>{children}</Dialog>;
}

function Content({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <DialogContent className="max-w-2xl rounded-[2rem] bg-card p-0 sm:max-w-2xl">
      <DialogHeader className="gap-3 px-6 pt-6">
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </DialogHeader>
      {children}
    </DialogContent>
  );
}

function Form({
  back,
  errors,
  front,
  onBackChange,
  onFrontChange,
}: {
  back: string;
  errors: { back?: string; front?: string };
  front: string;
  onBackChange: (value: string) => void;
  onFrontChange: (value: string) => void;
}) {
  return (
    <div className="px-6 py-5">
      <FieldGroup>
        <Field data-invalid={Boolean(errors.front)}>
          <FieldLabel htmlFor="anki-card-front">Front</FieldLabel>
          <Input
            id="anki-card-front"
            value={front}
            aria-invalid={Boolean(errors.front)}
            onChange={(event) => onFrontChange(event.target.value)}
            placeholder="Prompt, question, or target phrase"
            className="h-11 rounded-[1rem] px-4"
          />
          <FieldDescription>
            Keep the front short enough to prompt recall instead of passive reading.
          </FieldDescription>
          <FieldError>{errors.front}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.back)}>
          <FieldLabel htmlFor="anki-card-back">Back</FieldLabel>
          <Textarea
            id="anki-card-back"
            value={back}
            aria-invalid={Boolean(errors.back)}
            onChange={(event) => onBackChange(event.target.value)}
            placeholder="Answer, explanation, or translation"
            className="min-h-32 rounded-[1.5rem] px-4 py-3"
          />
          <FieldDescription>
            Use the back for the answer plus just enough context to make review meaningful.
          </FieldDescription>
          <FieldError>{errors.back}</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}

function Actions({
  isPending,
  submitLabel,
}: {
  isPending: boolean;
  submitLabel: string;
}) {
  return (
    <DialogFooter className="rounded-b-[2rem]">
      <Button type="submit" className="rounded-full" disabled={isPending}>
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </DialogFooter>
  );
}

/**
 * Compound dialog for both create-card and edit-card flows.
 */
export const CardEditorDialog = {
  Actions,
  Content,
  Form,
  Root,
};
