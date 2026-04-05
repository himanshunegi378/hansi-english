import prisma from "@/lib/prisma";

/**
 * Lists all decks for a user and loads enough card data to compute counts.
 * @param userId Authenticated user id.
 * @param now Current timestamp used to determine due cards.
 * @returns Deck records with card counts.
 */
export async function listDecksByUserId(userId: string, now: Date) {
  return prisma.deck.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          cards: true,
        },
      },
      cards: {
        where: {
          nextReview: {
            lte: now,
          },
        },
        select: {
          id: true,
        },
      },
    },
  });
}

/**
 * Loads a single user-owned deck with its cards.
 * @param deckId Deck id to fetch.
 * @param userId Authenticated user id.
 * @returns Deck record with cards, or null when missing.
 */
export async function findDeckById(deckId: string, userId: string) {
  return prisma.deck.findFirst({
    where: {
      id: deckId,
      userId,
    },
    include: {
      cards: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

/**
 * Creates a new deck for a user.
 * @param userId Authenticated user id.
 * @param data Deck creation payload.
 * @returns Newly created deck.
 */
export async function createDeck(userId: string, data: { description?: string | null; name: string }) {
  return prisma.deck.create({
    data: {
      userId,
      name: data.name,
      description: data.description ?? null,
    },
  });
}

/**
 * Deletes a user-owned deck.
 * @param deckId Deck id to delete.
 * @returns Deleted deck record.
 */
export async function deleteDeck(deckId: string) {
  return prisma.deck.delete({
    where: {
      id: deckId,
    },
  });
}

/**
 * Creates a card in a user-owned deck.
 * @param deckId Deck id to attach the card to.
 * @param data Card creation payload.
 * @returns Newly created card.
 */
export async function createCard(deckId: string, data: { back: string; front: string }) {
  return prisma.card.create({
    data: {
      deckId,
      front: data.front,
      back: data.back,
    },
  });
}

/**
 * Loads a user-owned card by id via its parent deck.
 * @param cardId Card id to fetch.
 * @param userId Authenticated user id.
 * @returns Card record with deck ownership, or null when missing.
 */
export async function findCardById(cardId: string, userId: string) {
  return prisma.card.findFirst({
    where: {
      id: cardId,
      deck: {
        userId,
      },
    },
  });
}

/**
 * Updates a card's front/back content.
 * @param cardId Card id to update.
 * @param data Updated card content.
 * @returns Updated card record.
 */
export async function updateCard(cardId: string, data: { back: string; front: string }) {
  return prisma.card.update({
    where: {
      id: cardId,
    },
    data,
  });
}

/**
 * Deletes a card by id.
 * @param cardId Card id to delete.
 * @returns Deleted card record.
 */
export async function deleteCard(cardId: string) {
  return prisma.card.delete({
    where: {
      id: cardId,
    },
  });
}

/**
 * Lists due cards for a user-owned deck.
 * @param deckId Deck id to query.
 * @param userId Authenticated user id.
 * @param now Current timestamp used to determine due cards.
 * @returns Due card records in review order.
 */
export async function listDueCards(deckId: string, userId: string, now: Date) {
  return prisma.card.findMany({
    where: {
      deckId,
      nextReview: {
        lte: now,
      },
      deck: {
        userId,
      },
    },
    orderBy: [
      {
        nextReview: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

/**
 * Updates a reviewed card and writes the corresponding review log atomically.
 * @param input Review persistence payload.
 * @returns Updated card after the transaction commits.
 */
export async function updateCardReview(input: {
  cardId: string;
  grade: number;
  newEase: number;
  newInterval: number;
  nextReview: Date;
  userId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const updatedCard = await tx.card.update({
      where: {
        id: input.cardId,
      },
      data: {
        interval: input.newInterval,
        ease: input.newEase,
        nextReview: input.nextReview,
      },
    });

    await tx.reviewLog.create({
      data: {
        cardId: input.cardId,
        userId: input.userId,
        grade: input.grade,
        newInterval: input.newInterval,
        newEase: input.newEase,
      },
    });

    return updatedCard;
  });
}
