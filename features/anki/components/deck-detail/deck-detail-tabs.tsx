"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookCopy, LayoutList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeckDetail } from "./deck-detail";
import { DeckStoriesPanel } from "./deck-stories-panel";
import type { AnkiDeckCardViewModel } from "../../types/ui";

const DEFAULT_TAB = "cards";
const TAB_QUERY_PARAM = "tab";
const TAB_VALUES = ["cards", "stories"] as const;

type DeckDetailTabValue = (typeof TAB_VALUES)[number];

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(searchParams.get(TAB_QUERY_PARAM));

  function handleTabChange(nextTab: string) {
    const resolvedTab = getActiveTab(nextTab);
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    nextSearchParams.set(TAB_QUERY_PARAM, resolvedTab);

    router.replace(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
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

/**
 * Resolves the requested query-param value to a supported tab id.
 * @param value Candidate tab value from the URL or tab change event.
 * @returns A valid deck-detail tab id.
 */
function getActiveTab(value: string | null): DeckDetailTabValue {
  if (value && isDeckDetailTabValue(value)) {
    return value;
  }

  return DEFAULT_TAB;
}

/**
 * Checks whether a string is one of the supported deck-detail tab ids.
 * @param value Candidate tab id.
 * @returns Whether the provided value matches a supported tab.
 */
function isDeckDetailTabValue(value: string): value is DeckDetailTabValue {
  return TAB_VALUES.includes(value as DeckDetailTabValue);
}
