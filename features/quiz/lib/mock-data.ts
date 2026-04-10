import type {
  QuizUiAnalyticsRecord,
  QuizUiAttemptRecord,
  QuizUiQuestion,
  QuizUiRecord,
} from "../types/ui";

const javascriptQuizQuestions: QuizUiQuestion[] = [
  {
    id: "question-1",
    text: "Which keyword declares a block-scoped variable in JavaScript?",
    explanation: "Both `let` and `const` are block scoped, but this item asks for one correct choice.",
    type: "SINGLE_CHOICE",
    order: 1,
    points: 2,
    isRequired: true,
    options: [
      { id: "option-1", text: "var", order: 1, isCorrect: false },
      { id: "option-2", text: "let", order: 2, isCorrect: true },
      { id: "option-3", text: "function", order: 3, isCorrect: false },
    ],
  },
  {
    id: "question-2",
    text: "Select the values that are primitive types.",
    explanation: "Strings and booleans are primitive values, while arrays are objects.",
    type: "MULTIPLE_CHOICE",
    order: 2,
    points: 3,
    isRequired: true,
    options: [
      { id: "option-4", text: "string", order: 1, isCorrect: true },
      { id: "option-5", text: "Array", order: 2, isCorrect: false },
      { id: "option-6", text: "boolean", order: 3, isCorrect: true },
      { id: "option-7", text: "Date", order: 4, isCorrect: false },
    ],
  },
  {
    id: "question-3",
    text: "JSON stands for JavaScript Object Notation.",
    explanation: "The acronym expands to JavaScript Object Notation.",
    type: "TRUE_FALSE",
    order: 3,
    points: 1,
    isRequired: true,
    options: [
      { id: "option-8", text: "True", order: 1, isCorrect: true },
      { id: "option-9", text: "False", order: 2, isCorrect: false },
    ],
  },
  {
    id: "question-4",
    text: "What does the DOM stand for?",
    explanation: "The browser exposes the HTML document through the Document Object Model.",
    type: "SHORT_ANSWER",
    order: 4,
    points: 4,
    isRequired: true,
    correctTextAnswer: "Document Object Model",
    options: [],
  },
];

export const quizLibrary: QuizUiRecord[] = [
  {
    id: "js-basics",
    title: "JavaScript Foundations",
    description: "A warm-up quiz for syntax, primitives, and browser essentials with a steady beginner-friendly pace.",
    status: "PUBLISHED",
    timeLimitMin: 20,
    passingScore: 70,
    sectionCount: 3,
    questionCount: 12,
    createdAt: "Apr 10, 2026",
    updatedAt: "Apr 12, 2026",
    sections: [
      {
        id: "section-1",
        title: "Language Basics",
        description: "Variables, types, and tiny logic checks.",
        order: 1,
        questions: javascriptQuizQuestions.slice(0, 2),
      },
      {
        id: "section-2",
        title: "Runtime Thinking",
        description: "Interpreting behavior in the browser.",
        order: 2,
        questions: javascriptQuizQuestions.slice(2, 4),
      },
      {
        id: "section-3",
        title: "Confidence Check",
        description: "A short wrap-up section with recap prompts.",
        order: 3,
        questions: [],
      },
    ],
  },
  {
    id: "grammar-garden",
    title: "Grammar Garden",
    description: "Sentence repair exercises focused on tense agreement and article choice.",
    status: "DRAFT",
    timeLimitMin: 15,
    passingScore: 75,
    sectionCount: 2,
    questionCount: 8,
    createdAt: "Apr 08, 2026",
    updatedAt: "Apr 11, 2026",
    sections: [
      {
        id: "section-4",
        title: "Articles",
        description: "Small choices that change the whole sentence.",
        order: 1,
        questions: javascriptQuizQuestions.slice(0, 2),
      },
      {
        id: "section-5",
        title: "Verb Flow",
        description: "Choosing the tense that matches the moment.",
        order: 2,
        questions: javascriptQuizQuestions.slice(2, 4),
      },
    ],
  },
  {
    id: "reading-rhythm",
    title: "Reading Rhythm",
    description: "A narrative comprehension quiz once used in a seasonal reading sprint.",
    status: "ARCHIVED",
    timeLimitMin: 25,
    passingScore: 65,
    sectionCount: 4,
    questionCount: 16,
    createdAt: "Mar 26, 2026",
    updatedAt: "Apr 02, 2026",
    sections: [
      {
        id: "section-6",
        title: "Narrative Signals",
        description: "Reading scenes for intent and pacing.",
        order: 1,
        questions: javascriptQuizQuestions,
      },
      {
        id: "section-7",
        title: "Inference",
        description: "Reading what the text implies, not just what it states.",
        order: 2,
        questions: [],
      },
      {
        id: "section-8",
        title: "Vocabulary in Motion",
        description: "Meaning from context with short evidence checks.",
        order: 3,
        questions: [],
      },
      {
        id: "section-9",
        title: "Reflection",
        description: "Learner interpretation and response.",
        order: 4,
        questions: [],
      },
    ],
  },
];

export const quizAttempts: QuizUiAttemptRecord[] = [
  {
    id: "attempt-1",
    quizId: "js-basics",
    quizTitle: "JavaScript Foundations",
    learnerName: "Aarav Sharma",
    learnerEmail: "aarav@example.com",
    attemptNumber: 1,
    status: "AUTO_GRADED",
    score: 8,
    maxScore: 10,
    passed: true,
    startedAt: "Apr 12, 2026 · 3:00 PM",
    submittedAt: "Apr 12, 2026 · 3:18 PM",
    completionRate: 100,
    answers: [
      {
        id: "answer-1",
        questionId: "question-1",
        questionText: javascriptQuizQuestions[0].text,
        questionType: "SINGLE_CHOICE",
        learnerAnswer: "let",
        selectedOptionIds: ["option-2"],
        correctAnswer: "let",
        correctOptionIds: ["option-2"],
        explanation: javascriptQuizQuestions[0].explanation,
        isCorrect: true,
        awardedPoints: 2,
        maxPoints: 2,
        feedback: "Confident and correct.",
        needsManualReview: false,
      },
      {
        id: "answer-2",
        questionId: "question-2",
        questionText: javascriptQuizQuestions[1].text,
        questionType: "MULTIPLE_CHOICE",
        learnerAnswer: "string, boolean",
        selectedOptionIds: ["option-4", "option-6"],
        correctAnswer: "string, boolean",
        correctOptionIds: ["option-4", "option-6"],
        explanation: javascriptQuizQuestions[1].explanation,
        isCorrect: true,
        awardedPoints: 3,
        maxPoints: 3,
        feedback: "Great selection set.",
        needsManualReview: false,
      },
      {
        id: "answer-3",
        questionId: "question-3",
        questionText: javascriptQuizQuestions[2].text,
        questionType: "TRUE_FALSE",
        learnerAnswer: "True",
        selectedOptionIds: ["option-8"],
        correctAnswer: "True",
        correctOptionIds: ["option-8"],
        explanation: javascriptQuizQuestions[2].explanation,
        isCorrect: true,
        awardedPoints: 1,
        maxPoints: 1,
        feedback: "Quick and accurate.",
        needsManualReview: false,
      },
      {
        id: "answer-4",
        questionId: "question-4",
        questionText: javascriptQuizQuestions[3].text,
        questionType: "SHORT_ANSWER",
        learnerAnswer: "Document Object Model",
        selectedOptionIds: [],
        correctAnswer: "Document Object Model",
        correctOptionIds: [],
        explanation: javascriptQuizQuestions[3].explanation,
        isCorrect: true,
        awardedPoints: 2,
        maxPoints: 4,
        feedback: "Correct idea, but the response missed a little supporting detail.",
        needsManualReview: false,
      },
    ],
  },
  {
    id: "attempt-2",
    quizId: "js-basics",
    quizTitle: "JavaScript Foundations",
    learnerName: "Mira Thomas",
    learnerEmail: "mira@example.com",
    attemptNumber: 2,
    status: "SUBMITTED",
    score: null,
    maxScore: 10,
    passed: null,
    startedAt: "Apr 12, 2026 · 4:10 PM",
    submittedAt: "Apr 12, 2026 · 4:29 PM",
    completionRate: 100,
    answers: [
      {
        id: "answer-5",
        questionId: "question-1",
        questionText: javascriptQuizQuestions[0].text,
        questionType: "SINGLE_CHOICE",
        learnerAnswer: "let",
        selectedOptionIds: ["option-2"],
        correctAnswer: "let",
        correctOptionIds: ["option-2"],
        explanation: javascriptQuizQuestions[0].explanation,
        isCorrect: true,
        awardedPoints: 2,
        maxPoints: 2,
        feedback: "Clear answer.",
        needsManualReview: false,
      },
      {
        id: "answer-6",
        questionId: "question-4",
        questionText: javascriptQuizQuestions[3].text,
        questionType: "SHORT_ANSWER",
        learnerAnswer: "Document model in browser",
        selectedOptionIds: [],
        correctAnswer: "Document Object Model",
        correctOptionIds: [],
        explanation: javascriptQuizQuestions[3].explanation,
        isCorrect: null,
        awardedPoints: null,
        maxPoints: 4,
        feedback: "Needs manual confirmation for phrasing and completeness.",
        needsManualReview: true,
      },
    ],
  },
  {
    id: "attempt-3",
    quizId: "js-basics",
    quizTitle: "JavaScript Foundations",
    learnerName: "Aarav Sharma",
    learnerEmail: "aarav@example.com",
    attemptNumber: 3,
    status: "IN_PROGRESS",
    score: null,
    maxScore: 10,
    passed: null,
    startedAt: "Apr 13, 2026 · 9:15 AM",
    submittedAt: null,
    completionRate: 50,
    answers: [
      {
        id: "answer-7",
        questionId: "question-1",
        questionText: javascriptQuizQuestions[0].text,
        questionType: "SINGLE_CHOICE",
        learnerAnswer: "let",
        selectedOptionIds: ["option-2"],
        correctAnswer: "let",
        correctOptionIds: ["option-2"],
        explanation: javascriptQuizQuestions[0].explanation,
        isCorrect: true,
        awardedPoints: 2,
        maxPoints: 2,
        feedback: "Saved locally for now.",
        needsManualReview: false,
      },
    ],
  },
];

export const quizAnalytics: Record<string, QuizUiAnalyticsRecord> = {
  "js-basics": {
    quizId: "js-basics",
    totalAttempts: 24,
    averageScore: 78,
    passRate: 71,
    completionRate: 86,
  },
};

/**
 * Returns the mock quiz list used by the screen layer.
 * @returns All quiz records in display order.
 */
export function getQuizLibrary() {
  return quizLibrary;
}

/**
 * Returns one quiz record by id with a graceful fallback to the first quiz.
 * @param quizId Quiz identifier from the route.
 * @returns A stable quiz record for screen rendering.
 */
export function getQuizRecord(quizId: string) {
  return quizLibrary.find((quiz) => quiz.id === quizId) ?? quizLibrary[0];
}

/**
 * Returns analytics for the provided quiz id.
 * @param quizId Quiz identifier from the route.
 * @returns The analytics snapshot for the quiz.
 */
export function getQuizAnalytics(quizId: string) {
  return quizAnalytics[quizId] ?? quizAnalytics["js-basics"];
}

/**
 * Returns attempt rows for a quiz or the full learner history.
 * @param quizId Optional quiz identifier filter.
 * @returns Attempt records sorted by most recent first.
 */
export function getAttemptRecords(quizId?: string) {
  return quizAttempts.filter((attempt) => (quizId ? attempt.quizId === quizId : true));
}

/**
 * Returns one attempt record by id with a stable fallback.
 * @param attemptId Attempt identifier from the route.
 * @returns A stable attempt record for screen rendering.
 */
export function getAttemptRecord(attemptId: string) {
  return quizAttempts.find((attempt) => attempt.id === attemptId) ?? quizAttempts[0];
}
