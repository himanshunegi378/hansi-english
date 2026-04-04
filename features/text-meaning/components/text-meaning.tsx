"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MeaningTooltip } from "./meaning-tooltip";
import { useTextMeaningSelection } from "../hooks/use-text-meaning-selection";

interface TextMeaningProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps readable text and shows a meaning tooltip when the user selects a short phrase.
 * @param props Wrapped content and optional styling overrides.
 * @returns The selectable content with contextual meaning lookup.
 */
export function TextMeaning({ children, className }: TextMeaningProps) {
  const { clearSelection, containerRef, handlePointerSelection, selectedText } =
    useTextMeaningSelection();

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "cursor-text selection:bg-blue-200/80 dark:selection:bg-blue-500/40",
          className,
        )}
        onMouseUp={handlePointerSelection}
        onKeyUp={handlePointerSelection}
        onTouchEnd={() => window.setTimeout(handlePointerSelection, 100)}
      >
        {children}
      </div>
      <MeaningTooltip selectedText={selectedText} onClose={clearSelection} />
    </>
  );
}
