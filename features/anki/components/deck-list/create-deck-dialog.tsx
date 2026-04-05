"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

interface CreateDeckDialogProps {
  isPending: boolean;
  onSubmit: (input: { description?: string | null; name: string }) => Promise<boolean>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Renders the create-deck dialog and its controlled form.
 * @param props Dialog state, submit handler, and pending state.
 * @returns Deck creation dialog.
 */
export function CreateDeckDialog({
  isPending,
  onOpenChange,
  onSubmit,
  open,
}: CreateDeckDialogProps) {
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [name, setName] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrors({ name: "Deck name cannot be empty." });
      return;
    }

    const success = await onSubmit({
      description: description.trim() ? description.trim() : null,
      name: name.trim(),
    });

    if (success) {
      setDescription("");
      setErrors({});
      setName("");
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="">
            <DialogTitle className="text-2xl">Create a new deck</DialogTitle>
            <DialogDescription>
              Keep the first deck focused so learners can return to it often and build a steady review habit.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <FieldGroup>
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="anki-deck-name">Deck name</FieldLabel>
                <Input
                  id="anki-deck-name"
                  aria-invalid={Boolean(errors.name)}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (errors.name) {
                      setErrors({});
                    }
                  }}
                  placeholder="Everyday vocabulary"
                  className=""
                />
                <FieldError>{errors.name}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="anki-deck-description">Description</FieldLabel>
                <Textarea
                  id="anki-deck-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Optional context for the kind of words or phrases this deck covers."
                  className="min-h-28"
                />
                <FieldDescription>
                  This helps the deck feel intentional when the learner returns later.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter className="">
            <Button type="submit" className="" disabled={isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
              {isPending ? "Creating..." : "Create deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
