CREATE TABLE "WordMeaningCache" (
    "id" TEXT NOT NULL,
    "lookupKey" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "phonetic" TEXT,
    "phonetics" JSONB NOT NULL,
    "hindiTranslation" TEXT,
    "meanings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordMeaningCache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WordMeaningCache_lookupKey_key" ON "WordMeaningCache"("lookupKey");
