"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWordMeaning } from "../hooks/use-word-meaning";
import type { SelectedText } from "../types";
import { MeaningContent } from "./meaning-content";

interface MeaningTooltipProps {
  onClose: () => void;
  selectedText: SelectedText | null;
}

const MOBILE_BREAKPOINT = 768;

/**
 * Fetches and renders a selected word's meaning in a floating tooltip or mobile bottom sheet.
 * @param props The active selection and close handler.
 * @returns The contextual meaning UI when text is selected.
 */
export function MeaningTooltip({
  onClose,
  selectedText,
}: MeaningTooltipProps) {
  const canDismissFromOpenChangeRef = useRef(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const { errorMessage, isLoading, meaning } = useWordMeaning(selectedText);

  useEffect(() => {
    /**
     * Keeps the tooltip layout in sync with the current viewport width.
     */
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    canDismissFromOpenChangeRef.current = false;
    const frameId = window.requestAnimationFrame(() => {
      canDismissFromOpenChangeRef.current = true;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [selectedText?.text]);

  if (!selectedText) {
    return null;
  }

  const triggerStyle = {
    left: selectedText.position.left,
    top: selectedText.position.top,
  };

  /**
   * Closes the overlay only after the initial mount frame has completed.
   * @param open The next open state emitted by the overlay component.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open && canDismissFromOpenChangeRef.current) {
      onClose();
    }
  };

  if (isMobile) {
    return (
      <Drawer open onOpenChange={handleOpenChange} direction="top">
        <DrawerContent data-text-meaning-overlay="true">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <BookOpen />
              <span className="capitalize">{selectedText.text}</span>
            </DrawerTitle>
          </DrawerHeader>
          <MeaningContent
            errorMessage={errorMessage}
            isLoading={isLoading}
            meaning={meaning}
            onClose={onClose}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed size-px -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={triggerStyle}
          />
        }
      />
      <PopoverContent
        side="top"
        align="center"
        sideOffset={12}
        data-text-meaning-overlay="true"
        className="w-[min(28rem,calc(100vw-1.5rem))] rounded-2xl p-0"
      >
        <PopoverHeader className="gap-2 p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <PopoverTitle className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <span className="capitalize">{selectedText.text}</span>
              </PopoverTitle>

            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close meaning tooltip"
            >
              <X />
            </Button>
          </div>
        </PopoverHeader>
        <MeaningContent
          errorMessage={errorMessage}
          isLoading={isLoading}
          meaning={meaning}
          onClose={onClose}
        />
      </PopoverContent>
    </Popover>
  );
}
