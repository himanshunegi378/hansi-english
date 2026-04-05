"use client";

import { PencilLine, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.5rem] border border-border/60 bg-background/80 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
          <p className="mt-2 font-heading text-2xl text-foreground">{item.value}</p>
        </div>
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
    <div className="flex flex-col gap-3">
      {cards.map((card) => (
        <div key={card.id} className="rounded-[1.5rem] border border-border/60 bg-background/85 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-1 flex-col gap-3">
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-[1.25rem] bg-secondary/55 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Front</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{card.front}</p>
                </div>
                <div className="rounded-[1.25rem] bg-secondary/25 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Back</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{card.back}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full bg-background/80 px-3 py-1">
                  Next review: {card.nextReviewLabel}
                </Badge>
                <Badge variant="outline" className="rounded-full bg-background/80 px-3 py-1">
                  Interval: {card.interval.toFixed(2)} days
                </Badge>
                <Badge variant="outline" className="rounded-full bg-background/80 px-3 py-1">
                  Ease: {card.ease.toFixed(2)}
                </Badge>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="outline" className="rounded-full" onClick={() => onEdit(card)}>
                <PencilLine data-icon="inline-start" />
                Edit
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => onDelete(card)}>
                <Trash2 data-icon="inline-start" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
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
