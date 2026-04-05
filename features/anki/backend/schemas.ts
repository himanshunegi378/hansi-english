import { z } from "zod";

export const createDeckSchema = z.object({
  name: z.string().trim().min(1, "Deck name cannot be empty.").max(120, "Deck name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Deck description must be 500 characters or fewer.")
    .optional()
    .nullable(),
});

export const createCardSchema = z.object({
  front: z.string().trim().min(1, "Card front text cannot be empty.").max(5000, "Card front text must be 5000 characters or fewer."),
  back: z.string().trim().min(1, "Card back text cannot be empty.").max(5000, "Card back text must be 5000 characters or fewer."),
});

export const updateCardSchema = createCardSchema;

export const reviewCardSchema = z.object({
  grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)], {
    error: "Grade must be between 1 and 4.",
  }),
});
