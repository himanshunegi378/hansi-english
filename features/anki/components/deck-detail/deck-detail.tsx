"use client";

import { PencilLine, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnkiEmptyState } from "../shared/anki-empty-state";
import type { AnkiDeckCardViewModel } from "../../types/ui";

function Root({ children }: { children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
      {children}
    </Card>
  );
}

function Header({
  actions,
  description,
  title,
}: {
  actions?: React.ReactNode;
  description: string | null;
  title: string;
}) {
  return (
    <CardHeader className="gap-4 border-b border-border/60 bg-secondary/25 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <CardTitle className="font-heading text-3xl tracking-tight">{title}</CardTitle>
          <CardDescription className="text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">
            {description || "A concentrated study deck designed for quick, repeatable review."}
          </CardDescription>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </CardHeader>
  );
}

function Stats({
  createdAtLabel,
  dueCards,
  totalCards,
  updatedAtLabel,
}: {
  createdAtLabel: string;
  dueCards: number;
  totalCards: number;
  updatedAtLabel: string;
}) {
  const items = [
    { label: "Cards in deck", value: totalCards.toString() },
    { label: "Due now", value: dueCards.toString() },
    { label: "Created", value: createdAtLabel },
    { label: "Updated", value: updatedAtLabel },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge
          key={item.label}
          variant="default"
          className="border-border/40 bg-secondary/20 px-4 py-1.5 text-xs transition-colors hover:bg-secondary/40 sm:text-sm"
        >
          <span className="mr-2 border-r border-border/50 pr-2 font-normal uppercase tracking-[0.14em] text-muted-foreground">
            {item.label}
          </span>
          <span className="font-heading font-medium text-foreground">{item.value}</span>
        </Badge>
      ))}
    </div>
  );
}

function CardList({
  cards,
  onDelete,
  onEdit,
}: {
  cards: AnkiDeckCardViewModel[];
  onDelete: (card: AnkiDeckCardViewModel) => void;
  onEdit: (card: AnkiDeckCardViewModel) => void;
}) {
  if (cards.length === 0) {
    return <Empty />;
  }

  return (
    <Accordion
      multiple
      defaultValue={cards.map((card) => card.id)}
      className="flex flex-col gap-3"
    >
      {cards.map((card) => (
        <AccordionItem
          key={card.id}
          value={card.id}
          className="border border-border/60 bg-background/85 px-4 transition-all duration-200 hover:bg-background sm:px-5"
        >
          <AccordionTrigger className="py-5 hover:no-underline">
            <div className="flex flex-1 flex-col items-start gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-secondary/50 text-[0.65rem] font-bold text-muted-foreground">
                  FR
                </div>
                <span className="font-heading text-lg font-medium tracking-tight text-foreground line-clamp-1">
                  {card.front}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-border/40 bg-background/50 px-3 py-0.5 text-[0.65rem] font-medium"
                >
                  Next: {card.nextReviewLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-border/40 bg-background/50 px-3 py-0.5 text-[0.65rem] font-medium"
                >
                  Interval: {card.interval.toFixed(1)}d
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-border/40 bg-background/50 px-3 py-0.5 text-[0.65rem] font-medium"
                >
                  Ease: {card.ease.toFixed(2)}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            <div className="flex flex-col gap-6">
              <div className="relative rounded-[1.25rem] border border-border/40 bg-secondary/20 p-5">
                <div className="absolute -top-3 left-4 rounded-full bg-background px-3 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground border border-border/40">
                  Back Side
                </div>
                <p className="text-base leading-relaxed text-foreground/90">{card.back}</p>
              </div>
              <div className="flex justify-end gap-2 border-t border-border/40 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-full px-4 hover:bg-secondary/50"
                  onClick={() => onEdit(card)}
                >
                  <PencilLine data-icon="inline-start" />
                  Edit Card
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-full px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(card)}
                >
                  <Trash2 data-icon="inline-start" />
                  Delete
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Empty() {
  return (
    <AnkiEmptyState
      description="Add your first card to turn this deck into a review session."
      icon={Plus}
      title="This deck is still empty"
    />
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <CardContent className="flex flex-col gap-5 p-5 sm:gap-6 sm:p-6">{children}</CardContent>;
}

/**
 * Compound detail surface for a single deck.
 */
export const DeckDetail = {
  Body,
  CardList,
  Empty,
  Header,
  Root,
  Stats,
};
