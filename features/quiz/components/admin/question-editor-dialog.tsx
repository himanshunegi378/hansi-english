"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionEditorDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

/**
 * Renders the add/edit question drawer-style dialog.
 * @param props Open state controls.
 * @returns Question editor dialog.
 */
export function QuestionEditorDialog({ onOpenChange, open }: QuestionEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[1.75rem] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>Shape the prompt, mark the answer mode, and keep the grading guidance tight.</DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[75vh] flex-col gap-5 overflow-y-auto p-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="question-text">Question text</FieldLabel>
              <Textarea id="question-text" defaultValue="Which keyword declares a block-scoped variable in JavaScript?" className="min-h-28 rounded-[1.5rem]" />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>Question type</FieldLabel>
                <Select defaultValue="single">
                  <SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="single">Single choice</SelectItem>
                      <SelectItem value="multiple">Multiple choice</SelectItem>
                      <SelectItem value="boolean">True / false</SelectItem>
                      <SelectItem value="short">Short answer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="question-points">Points</FieldLabel>
                <Input id="question-points" type="number" defaultValue="2" />
              </Field>
              <Field orientation="horizontal" className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                <FieldLabel htmlFor="question-required">Required</FieldLabel>
                <Switch id="question-required" defaultChecked />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="question-explanation">Explanation</FieldLabel>
              <Textarea id="question-explanation" defaultValue="let and const are block scoped, while var is scoped to the nearest function." className="min-h-24 rounded-[1.5rem]" />
            </Field>

            <FieldSet>
              <FieldLegend>Options</FieldLegend>
              <div className="grid gap-3">
                {["var", "let", "function"].map((option, index) => (
                  <div key={option} className="grid gap-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <RadioGroup defaultValue="option-2">
                      <RadioGroupItem value={`option-${index + 1}`} aria-label={`Set ${option} as correct`} />
                    </RadioGroup>
                    <Input defaultValue={option} />
                    <Button variant="outline" className="rounded-full">Delete</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="rounded-full self-start">Add option</Button>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Grading mode</FieldLegend>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-start gap-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                  <Checkbox defaultChecked />
                  <div>
                    <p className="font-medium text-foreground">Auto grade</p>
                    <p className="text-sm text-muted-foreground">Use the correct answer to evaluate immediately.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                  <Checkbox />
                  <div>
                    <p className="font-medium text-foreground">Manual review</p>
                    <p className="text-sm text-muted-foreground">Flag the answer for a teacher decision.</p>
                  </div>
                </label>
              </div>
            </FieldSet>
          </FieldGroup>
        </div>

        <DialogFooter className="rounded-b-[1.75rem]">
          <Button variant="outline" className="rounded-full">Cancel</Button>
          <Button variant="outline" className="rounded-full">Save and add next</Button>
          <Button className="rounded-full">Save question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
