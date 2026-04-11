"use client";

import { BookCopy, LayoutList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeckDetail } from "./deck-detail";
import { DeckStoriesPanel } from "./deck-stories-panel";
import type { AnkiDeckCardViewModel } from "../../types/ui";

interface DeckDetailTabsProps {
  cards: AnkiDeckCardViewModel[];
  deckId: string;
  onDeleteCard: (card: AnkiDeckCardViewModel) => void;
  onEditCard: (card: AnkiDeckCardViewModel) => void;
}

/**
 * Switches between a deck's cards and saved stories.
 * @param props Cards, story source deck id, and card action handlers.
 * @returns Tabbed deck content.
 */
export function DeckDetailTabs({
  cards,
  deckId,
  onDeleteCard,
  onEditCard,
}: DeckDetailTabsProps) {
  return (
    <Tabs defaultValue="cards">
      <TabsList variant="line">
        <TabsTrigger value="cards">
          <LayoutList data-icon="inline-start" />
          Cards
        </TabsTrigger>
        <TabsTrigger value="stories">
          <BookCopy data-icon="inline-start" />
          Stories
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards" className="pt-4 sm:pt-6">
        <DeckDetail.CardList
          cards={cards}
          onEdit={onEditCard}
          onDelete={onDeleteCard}
        />
      </TabsContent>

      <TabsContent value="stories" className="pt-4 sm:pt-6">
        <DeckStoriesPanel deckId={deckId} />
      </TabsContent>
    </Tabs>
  );
}
