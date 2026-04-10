"use client";

import { PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnkiEmptyState } from "../shared/anki-empty-state";
import type { AnkiDeckCardViewModel } from "../../types/ui";

function Root({ children }: { children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden rounded-md border-border/70 bg-card/90 shadow-sm">
      {children}
    </Card>
  );
}

/**
 * Renders the top section of the deck detail with title, card count, and actions.
 */
function Header({
  actions,
  description,
  title,
  totalCards,
}: {
  actions?: React.ReactNode;
  description: string | null;
  title: string;
  totalCards: number;
}) {
  return (
    <CardHeader className="gap-4 border-b border-border/60 bg-secondary/25 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <CardTitle className="font-heading text-3xl tracking-tight">
            {title}{" "}
            <span className="text-xl font-normal text-muted-foreground">
              ({totalCards} {totalCards === 1 ? "card" : "cards"})
            </span>
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">
            {description || "A concentrated study deck designed for quick, repeatable review."}
          </CardDescription>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </CardHeader>
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
        <div
          key={card.id}
          className="flex flex-col gap-5 rounded-md border border-border/60 bg-background/85 p-4 transition-all duration-200 hover:bg-background sm:p-5"
        >
          <div className="flex flex-col gap-1">
            <p className="font-heading text-xl font-bold tracking-tight text-foreground">
              {card.front}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {card.back}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/80">
            <span>Review scheduled {card.nextReviewLabel}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-border" />
              {Math.ceil(card.interval)} day interval
            </span>
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


export const DeckDetail = {
  CardList,
  Empty,
  Header,
  Root,
};
