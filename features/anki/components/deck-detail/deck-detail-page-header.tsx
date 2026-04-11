"use client";

import Link from "next/link";
import { BookOpen, ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnkiPageShell } from "../layout/anki-page-shell";
import { AnkiSectionHeading } from "../shared/anki-section-heading";

interface DeckDetailPageHeaderProps {
  studyHref: string;
}

/**
 * Renders the deck detail page header and primary navigation actions.
 * @param props The study route for the active deck.
 * @returns The deck page header.
 */
export function DeckDetailPageHeader({
  studyHref,
}: DeckDetailPageHeaderProps) {
  return (
    <AnkiPageShell.Header>
      <AnkiSectionHeading
        eyebrow="Deck workspace"
        actions={(
          <AnkiPageShell.Actions>
            <Link href="/anki" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4")}>
              <ChevronLeft data-icon="inline-start" />
              Back to decks
            </Link>
            <Link href={studyHref} className={cn(buttonVariants({ variant: "default" }), "rounded-full px-4")}>
              <BookOpen data-icon="inline-start" />
              Start study
            </Link>
          </AnkiPageShell.Actions>
        )}
      />
    </AnkiPageShell.Header>
  );
}
