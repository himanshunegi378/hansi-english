import { addMinutes } from "date-fns";
import type { ReviewGrade } from "./types";

interface ReviewStateInput {
  ease: number;
  grade: ReviewGrade;
  interval: number;
  now: Date;
}

interface ReviewStateResult {
  ease: number;
  interval: number;
  nextReview: Date;
}

const MINIMUM_EASE = 1.3;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

/**
 * Converts a floating-point day interval into an exact review timestamp.
 * @param now Current review timestamp.
 * @param intervalDays Interval in days, including fractional values.
 * @returns The precise next review timestamp.
 */
function getNextReviewDate(now: Date, intervalDays: number): Date {
  return new Date(now.getTime() + intervalDays * DAY_IN_MILLISECONDS);
}

/**
 * Calculates the next spaced-repetition state for a reviewed card.
 * @param input Existing card scheduling values and the submitted grade.
 * @returns The updated interval, ease, and due date.
 */
export function calculateReviewState(input: ReviewStateInput): ReviewStateResult {
  const roundedInterval = Math.max(0, Number(input.interval.toFixed(2)));
  const roundedEase = Number(input.ease.toFixed(2));

  if (input.grade === 1) {
    return {
      interval: 0,
      ease: Math.max(MINIMUM_EASE, Number((roundedEase - 0.2).toFixed(2))),
      nextReview: addMinutes(input.now, 10),
    };
  }

  if (input.grade === 2) {
    const interval = roundedInterval < 1 ? 1 : Number(Math.max(1, roundedInterval * 1.2).toFixed(2));
    return {
      interval,
      ease: Math.max(MINIMUM_EASE, Number((roundedEase - 0.15).toFixed(2))),
      nextReview: getNextReviewDate(input.now, interval),
    };
  }

  if (input.grade === 3) {
    const interval = roundedInterval < 1 ? 1 : roundedInterval === 1 ? 2 : Number((roundedInterval * roundedEase).toFixed(2));
    return {
      interval,
      ease: roundedEase,
      nextReview: getNextReviewDate(input.now, interval),
    };
  }

  const interval = roundedInterval < 1 ? 3 : Number((roundedInterval * roundedEase * 1.3).toFixed(2));
  return {
    interval,
    ease: Number((roundedEase + 0.15).toFixed(2)),
    nextReview: getNextReviewDate(input.now, interval),
  };
}
