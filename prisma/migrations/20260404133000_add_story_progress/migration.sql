CREATE TYPE "AnswerValueType" AS ENUM ('OPTION', 'TEXT', 'BOOLEAN');

CREATE TABLE "StoryProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "earnedPoints" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "lastAnsweredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StoryAnswer" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "valueType" "AnswerValueType" NOT NULL,
    "selectedOption" TEXT,
    "textAnswer" TEXT,
    "booleanAnswer" BOOLEAN,
    "isCorrect" BOOLEAN NOT NULL,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryAnswer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StoryProgress_userId_storyId_key" ON "StoryProgress"("userId", "storyId");
CREATE INDEX "StoryProgress_storyId_idx" ON "StoryProgress"("storyId");
CREATE UNIQUE INDEX "StoryAnswer_progressId_questionId_key" ON "StoryAnswer"("progressId", "questionId");
CREATE INDEX "StoryAnswer_questionId_idx" ON "StoryAnswer"("questionId");

ALTER TABLE "StoryProgress"
ADD CONSTRAINT "StoryProgress_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryProgress"
ADD CONSTRAINT "StoryProgress_storyId_fkey"
FOREIGN KEY ("storyId") REFERENCES "Story"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryAnswer"
ADD CONSTRAINT "StoryAnswer_progressId_fkey"
FOREIGN KEY ("progressId") REFERENCES "StoryProgress"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryAnswer"
ADD CONSTRAINT "StoryAnswer_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "Question"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
