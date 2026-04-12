"use client";

import { Loader2, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { MeaningResult } from "../types";

interface MeaningContentProps {
  errorMessage: string | null;
  isLoading: boolean;
  meaning: MeaningResult | null;
  onClose: () => void;
}

/**
 * Renders the inner content shared by the desktop popover and mobile drawer.
 * @param props The resolved meaning state and interaction handlers.
 * @returns Structured dictionary content.
 */
export function MeaningContent({
  errorMessage,
  isLoading,
  meaning,
  onClose,
}: MeaningContentProps) {
  const pronunciationAudio =
    meaning?.phonetics.find((phonetic) => phonetic.audio)?.audio;

  /**
   * Plays the first available pronunciation audio.
   */
  const playPronunciation = () => {
    if (!pronunciationAudio) {
      return;
    }

    const audio = new Audio(pronunciationAudio);
    audio.playbackRate = 0.5;
    void audio.play();
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <div className="flex flex-wrap items-center gap-2">
        {meaning?.hindiTranslation ? (
          <Badge variant="secondary">{meaning.hindiTranslation}</Badge>
        ) : null}
        {meaning?.phonetic ? <Badge variant="secondary">{meaning.phonetic}</Badge> : null}
        {meaning?.phonetics.slice(0, 2).map((phonetic) => (
          <Badge key={`${phonetic.text}-${phonetic.audio ?? "no-audio"}`} variant="outline">
            {phonetic.text}
          </Badge>
        ))}
        {pronunciationAudio ? (
          <Button type="button" variant="outline" size="sm" onClick={playPronunciation}>
            <Volume2 data-icon="inline-start" />
            Hear pronunciation
          </Button>
        ) : null}
      </div>

      <Separator />

      <div className="text-sm leading-6 text-foreground">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Looking up the meaning…</span>
          </div>
        ) : errorMessage ? (
          <p className="text-destructive">{errorMessage}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {meaning?.hindiHowItFitsInContext ? (
              <>
                <div className="flex flex-col gap-1 rounded-lg bg-background/70">
                  <p className="text-xs font-medium text-muted-foreground">
                    Hindi context explanation
                  </p>
                  <p>{meaning.hindiHowItFitsInContext}</p>
                </div>
                <Separator />
              </>
            ) : null}
            {meaning?.meanings.slice(0, 3).map((entry, meaningIndex) => (
              <div key={`${entry.partOfSpeech}-${meaningIndex}`} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{entry.partOfSpeech}</Badge>
                  {entry.synonyms.slice(0, 2).map((synonym) => (
                    <Badge key={synonym} variant="outline">
                      {synonym}
                    </Badge>
                  ))}
                </div>
                <ol className="ms-4 flex list-decimal flex-col gap-2">
                  {entry.definitions.slice(0, 3).map((definition, definitionIndex) => (
                    <li key={`${definition.definition}-${definitionIndex}`}>
                      <p>{definition.definition}</p>
                      {definition.hindiDefinition ? (
                        <p className="text-xs text-muted-foreground">
                          {definition.hindiDefinition}
                        </p>
                      ) : null}
                      {definition.example ? (
                        <p className="text-xs italic text-muted-foreground">
                          {definition.example}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
