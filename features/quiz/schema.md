generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum QuizStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum QuestionType {
  SINGLE_CHOICE
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
}

enum AttemptStatus {
  IN_PROGRESS
  SUBMITTED
  AUTO_GRADED
  MANUALLY_GRADED
}

model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  quizzes       Quiz[]        @relation("QuizCreatedBy")
  attempts      QuizAttempt[]
  answers       AttemptAnswer[]
}

model Quiz {
  id            String        @id @default(cuid())
  title         String
  description   String?
  status        QuizStatus    @default(DRAFT)
  timeLimitMin  Int?
  passingScore  Float?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  createdById   String
  createdBy     User          @relation("QuizCreatedBy", fields: [createdById], references: [id], onDelete: Cascade)

  sections      QuizSection[]
  attempts      QuizAttempt[]

  @@index([createdById])
  @@index([status])
}

model QuizSection {
  id            String        @id @default(cuid())
  title         String
  description   String?
  order         Int
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  quizId        String
  quiz          Quiz          @relation(fields: [quizId], references: [id], onDelete: Cascade)

  questions     Question[]

  @@unique([quizId, order])
  @@index([quizId])
}

model Question {
  id                 String          @id @default(cuid())
  text               String
  explanation        String?
  type               QuestionType
  order              Int
  points             Float           @default(1)
  isRequired         Boolean         @default(true)
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  sectionId          String
  section            QuizSection     @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  options            QuestionOption[]
  answers            AttemptAnswer[]

  // For short answer / fallback metadata
  correctTextAnswer  String?
  metadata           Json?

  @@unique([sectionId, order])
  @@index([sectionId])
  @@index([type])
}

model QuestionOption {
  id            String         @id @default(cuid())
  text          String
  order         Int
  isCorrect     Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  questionId    String
  question      Question       @relation(fields: [questionId], references: [id], onDelete: Cascade)

  selectedIn    AttemptAnswerOption[]

  @@unique([questionId, order])
  @@index([questionId])
}

model QuizAttempt {
  id              String          @id @default(cuid())
  startedAt       DateTime        @default(now())
  submittedAt     DateTime?
  status          AttemptStatus   @default(IN_PROGRESS)
  score           Float?
  maxScore        Float?
  passed          Boolean?
  attemptNumber   Int             @default(1)

  quizId          String
  quiz            Quiz            @relation(fields: [quizId], references: [id], onDelete: Cascade)

  userId          String
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  answers         AttemptAnswer[]

  @@unique([quizId, userId, attemptNumber])
  @@index([quizId])
  @@index([userId])
  @@index([status])
}

model AttemptAnswer {
  id               String                @id @default(cuid())
  textAnswer       String?
  isCorrect        Boolean?
  awardedPoints    Float?
  gradedAt         DateTime?
  createdAt        DateTime              @default(now())
  updatedAt        DateTime              @updatedAt

  attemptId        String
  attempt          QuizAttempt           @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  questionId       String
  question         Question              @relation(fields: [questionId], references: [id], onDelete: Cascade)

  userId           String
  user             User                  @relation(fields: [userId], references: [id], onDelete: Cascade)

  selectedOptions  AttemptAnswerOption[]

  @@unique([attemptId, questionId])
  @@index([attemptId])
  @@index([questionId])
  @@index([userId])
}

model AttemptAnswerOption {
  id              String          @id @default(cuid())
  answerId        String
  optionId        String

  answer          AttemptAnswer   @relation(fields: [answerId], references: [id], onDelete: Cascade)
  option          QuestionOption  @relation(fields: [optionId], references: [id], onDelete: Cascade)

  @@unique([answerId, optionId])
  @@index([optionId])
}