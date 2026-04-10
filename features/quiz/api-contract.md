Below is a practical **REST API contract** for the quizzing system.

I am assuming:

* JSON request/response
* REST style URLs
* `/api/v1` base path
* authenticated user is inferred from token
* admin/creator APIs and learner/attempt APIs are separate by purpose

You can rename paths later. The important part is the shape and consistency.

---

# Base conventions

## Base URL

```txt
/api/v1
```

## Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

## Common response envelope

You do not have to use an envelope, but it helps consistency.

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Question type is invalid",
    "details": {
      "field": "type"
    }
  }
}
```

---

# 1. Create quiz

## URL

```http
POST /api/v1/quizzes
```

## Payload

```json
{
  "title": "JavaScript Basics Quiz",
  "description": "Quiz for core JS fundamentals",
  "status": "DRAFT",
  "timeLimitMin": 20,
  "passingScore": 60
}
```

## 201 Created

```json
{
  "success": true,
  "data": {
    "id": "quiz_123",
    "title": "JavaScript Basics Quiz",
    "description": "Quiz for core JS fundamentals",
    "status": "DRAFT",
    "timeLimitMin": 20,
    "passingScore": 60,
    "createdById": "user_1",
    "createdAt": "2026-04-10T12:00:00Z",
    "updatedAt": "2026-04-10T12:00:00Z"
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

## 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

# 2. Get quiz list

## URL

```http
GET /api/v1/quizzes?status=PUBLISHED&page=1&pageSize=10
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "quiz_123",
        "title": "JavaScript Basics Quiz",
        "description": "Quiz for core JS fundamentals",
        "status": "PUBLISHED",
        "timeLimitMin": 20,
        "passingScore": 60,
        "createdAt": "2026-04-10T12:00:00Z",
        "updatedAt": "2026-04-10T13:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

# 3. Get quiz detail

## URL

```http
GET /api/v1/quizzes/{quizId}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "quiz_123",
    "title": "JavaScript Basics Quiz",
    "description": "Quiz for core JS fundamentals",
    "status": "PUBLISHED",
    "timeLimitMin": 20,
    "passingScore": 60,
    "sections": [
      {
        "id": "section_1",
        "title": "Basics",
        "description": "Core concepts",
        "order": 1,
        "questions": [
          {
            "id": "question_1",
            "text": "Which of the following is a primitive type?",
            "explanation": "string is a primitive type in JS",
            "type": "SINGLE_CHOICE",
            "order": 1,
            "points": 2,
            "isRequired": true,
            "options": [
              {
                "id": "option_1",
                "text": "string",
                "order": 1
              },
              {
                "id": "option_2",
                "text": "Array",
                "order": 2
              }
            ]
          }
        ]
      }
    ],
    "createdAt": "2026-04-10T12:00:00Z",
    "updatedAt": "2026-04-10T13:00:00Z"
  }
}
```

## 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "QUIZ_NOT_FOUND",
    "message": "Quiz not found"
  }
}
```

---

# 4. Update quiz

## URL

```http
PATCH /api/v1/quizzes/{quizId}
```

## Payload

```json
{
  "title": "JavaScript Basics - Updated",
  "description": "Updated description",
  "status": "PUBLISHED",
  "timeLimitMin": 25,
  "passingScore": 70
}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "quiz_123",
    "title": "JavaScript Basics - Updated",
    "description": "Updated description",
    "status": "PUBLISHED",
    "timeLimitMin": 25,
    "passingScore": 70,
    "updatedAt": "2026-04-10T14:00:00Z"
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot archive a draft quiz directly"
  }
}
```

## 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to modify this quiz"
  }
}
```

---

# 5. Create section

## URL

```http
POST /api/v1/quizzes/{quizId}/sections
```

## Payload

```json
{
  "title": "Basics",
  "description": "Core concepts",
  "order": 1
}
```

## 201 Created

```json
{
  "success": true,
  "data": {
    "id": "section_1",
    "quizId": "quiz_123",
    "title": "Basics",
    "description": "Core concepts",
    "order": 1,
    "createdAt": "2026-04-10T12:05:00Z",
    "updatedAt": "2026-04-10T12:05:00Z"
  }
}
```

## 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "SECTION_ORDER_ALREADY_EXISTS",
    "message": "A section with this order already exists in the quiz"
  }
}
```

---

# 6. Create question

## URL

```http
POST /api/v1/sections/{sectionId}/questions
```

## Payload for single choice

```json
{
  "text": "Which keyword declares a block-scoped variable?",
  "explanation": "let and const are block scoped, var is function scoped",
  "type": "SINGLE_CHOICE",
  "order": 1,
  "points": 2,
  "isRequired": true,
  "options": [
    {
      "text": "var",
      "order": 1,
      "isCorrect": false
    },
    {
      "text": "let",
      "order": 2,
      "isCorrect": true
    },
    {
      "text": "function",
      "order": 3,
      "isCorrect": false
    }
  ]
}
```

## Payload for short answer

```json
{
  "text": "What does JSON stand for?",
  "type": "SHORT_ANSWER",
  "order": 2,
  "points": 3,
  "isRequired": true,
  "correctTextAnswer": "JavaScript Object Notation"
}
```

## 201 Created

```json
{
  "success": true,
  "data": {
    "id": "question_1",
    "sectionId": "section_1",
    "text": "Which keyword declares a block-scoped variable?",
    "explanation": "let and const are block scoped, var is function scoped",
    "type": "SINGLE_CHOICE",
    "order": 1,
    "points": 2,
    "isRequired": true,
    "options": [
      {
        "id": "option_1",
        "text": "var",
        "order": 1,
        "isCorrect": false
      },
      {
        "id": "option_2",
        "text": "let",
        "order": 2,
        "isCorrect": true
      }
    ],
    "createdAt": "2026-04-10T12:10:00Z",
    "updatedAt": "2026-04-10T12:10:00Z"
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUESTION_OPTIONS",
    "message": "Single choice question must have exactly one correct option"
  }
}
```

---

# 7. Update question

## URL

```http
PATCH /api/v1/questions/{questionId}
```

## Payload

```json
{
  "text": "Which keyword declares a block-scoped variable in JavaScript?",
  "points": 3,
  "isRequired": true
}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "question_1",
    "text": "Which keyword declares a block-scoped variable in JavaScript?",
    "points": 3,
    "isRequired": true,
    "updatedAt": "2026-04-10T12:30:00Z"
  }
}
```

---

# 8. Delete question

## URL

```http
DELETE /api/v1/questions/{questionId}
```

## 204 No Content

No response body.

## 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "QUESTION_NOT_FOUND",
    "message": "Question not found"
  }
}
```

---

# 9. Start quiz attempt

## URL

```http
POST /api/v1/quizzes/{quizId}/attempts
```

## Payload

Usually empty.

```json
{}
```

You may also allow:

```json
{
  "resumeAttemptId": null
}
```

## 201 Created

```json
{
  "success": true,
  "data": {
    "id": "attempt_1",
    "quizId": "quiz_123",
    "userId": "user_2",
    "status": "IN_PROGRESS",
    "attemptNumber": 1,
    "startedAt": "2026-04-10T15:00:00Z",
    "submittedAt": null,
    "score": null,
    "maxScore": 10,
    "passed": null
  }
}
```

## 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "ATTEMPT_ALREADY_IN_PROGRESS",
    "message": "An attempt is already in progress for this quiz"
  }
}
```

## 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "QUIZ_NOT_FOUND",
    "message": "Quiz not found"
  }
}
```

---

# 10. Get attempt detail

## URL

```http
GET /api/v1/attempts/{attemptId}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "attempt_1",
    "quizId": "quiz_123",
    "userId": "user_2",
    "status": "IN_PROGRESS",
    "attemptNumber": 1,
    "startedAt": "2026-04-10T15:00:00Z",
    "submittedAt": null,
    "score": null,
    "maxScore": 10,
    "passed": null,
    "answers": [
      {
        "id": "answer_1",
        "questionId": "question_1",
        "textAnswer": null,
        "isCorrect": true,
        "awardedPoints": 2,
        "selectedOptions": [
          {
            "optionId": "option_2"
          }
        ]
      }
    ]
  }
}
```

---

# 11. Save answer for a question

This endpoint is the most important one.

## URL

```http
PUT /api/v1/attempts/{attemptId}/answers/{questionId}
```

Use `PUT` because this is effectively “replace answer for this question in this attempt”.

## Payload for single choice

```json
{
  "selectedOptionIds": ["option_2"]
}
```

## Payload for multiple choice

```json
{
  "selectedOptionIds": ["option_2", "option_4"]
}
```

## Payload for short answer

```json
{
  "textAnswer": "JavaScript Object Notation"
}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "answer_1",
    "attemptId": "attempt_1",
    "questionId": "question_1",
    "textAnswer": null,
    "isCorrect": true,
    "awardedPoints": 2,
    "selectedOptions": [
      {
        "optionId": "option_2"
      }
    ],
    "updatedAt": "2026-04-10T15:05:00Z"
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ANSWER_PAYLOAD",
    "message": "selectedOptionIds is required for SINGLE_CHOICE question"
  }
}
```

## 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "ATTEMPT_ALREADY_SUBMITTED",
    "message": "Cannot update answers for a submitted attempt"
  }
}
```

---

# 12. Submit attempt

## URL

```http
POST /api/v1/attempts/{attemptId}/submit
```

## Payload

```json
{}
```

You may also support:

```json
{
  "forceSubmit": true
}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "attempt_1",
    "quizId": "quiz_123",
    "userId": "user_2",
    "status": "AUTO_GRADED",
    "startedAt": "2026-04-10T15:00:00Z",
    "submittedAt": "2026-04-10T15:20:00Z",
    "score": 8,
    "maxScore": 10,
    "passed": true,
    "summary": {
      "totalQuestions": 5,
      "answeredQuestions": 5,
      "correctQuestions": 4,
      "incorrectQuestions": 1
    }
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "QUIZ_NOT_READY_FOR_SUBMISSION",
    "message": "Attempt contains unanswered required questions"
  }
}
```

## 409 Conflict

```json
{
  "success": false,
  "error": {
    "code": "ATTEMPT_ALREADY_SUBMITTED",
    "message": "Attempt has already been submitted"
  }
}
```

---

# 13. Get attempt result

## URL

```http
GET /api/v1/attempts/{attemptId}/result
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "attemptId": "attempt_1",
    "quizId": "quiz_123",
    "score": 8,
    "maxScore": 10,
    "passed": true,
    "status": "AUTO_GRADED",
    "submittedAt": "2026-04-10T15:20:00Z",
    "answers": [
      {
        "questionId": "question_1",
        "questionText": "Which keyword declares a block-scoped variable?",
        "isCorrect": true,
        "awardedPoints": 2,
        "selectedOptionIds": ["option_2"],
        "correctOptionIds": ["option_2"],
        "explanation": "let and const are block scoped"
      }
    ]
  }
}
```

## 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "RESULT_NOT_AVAILABLE",
    "message": "Results are not yet available for this attempt"
  }
}
```

---

# 14. Get my attempts for a quiz

## URL

```http
GET /api/v1/quizzes/{quizId}/attempts/me
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "attempt_1",
        "attemptNumber": 1,
        "status": "AUTO_GRADED",
        "score": 8,
        "maxScore": 10,
        "passed": true,
        "startedAt": "2026-04-10T15:00:00Z",
        "submittedAt": "2026-04-10T15:20:00Z"
      },
      {
        "id": "attempt_2",
        "attemptNumber": 2,
        "status": "IN_PROGRESS",
        "score": null,
        "maxScore": 10,
        "passed": null,
        "startedAt": "2026-04-10T16:00:00Z",
        "submittedAt": null
      }
    ]
  }
}
```

---

# 15. Manual grade short answer / subjective answer

Useful when `SHORT_ANSWER` is not auto-graded.

## URL

```http
PATCH /api/v1/answers/{answerId}/grade
```

## Payload

```json
{
  "isCorrect": true,
  "awardedPoints": 3,
  "feedback": "Good answer"
}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "answer_55",
    "isCorrect": true,
    "awardedPoints": 3,
    "gradedAt": "2026-04-10T17:00:00Z",
    "feedback": "Good answer"
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_GRADE",
    "message": "Awarded points cannot exceed question points"
  }
}
```

---

# 16. Publish quiz

You can do this with `PATCH /quizzes/{id}`, but a dedicated action endpoint is often cleaner.

## URL

```http
POST /api/v1/quizzes/{quizId}/publish
```

## Payload

```json
{}
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "quiz_123",
    "status": "PUBLISHED",
    "updatedAt": "2026-04-10T18:00:00Z"
  }
}
```

## 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "QUIZ_INCOMPLETE",
    "message": "Quiz must contain at least one question before publishing"
  }
}
```

---

# 17. Archive quiz

## URL

```http
POST /api/v1/quizzes/{quizId}/archive
```

## 200 OK

```json
{
  "success": true,
  "data": {
    "id": "quiz_123",
    "status": "ARCHIVED",
    "updatedAt": "2026-04-10T18:10:00Z"
  }
}
```

---

# Recommended validation rules

These are not endpoints, but they should be reflected in your contract.

## For `SINGLE_CHOICE`

* must have at least 2 options
* exactly 1 correct option

## For `MULTIPLE_CHOICE`

* must have at least 2 options
* at least 1 correct option

## For `TRUE_FALSE`

* can be modeled as 2 options:

  * True
  * False

## For `SHORT_ANSWER`

* no option list required
* may have `correctTextAnswer` for auto-grading
* otherwise graded manually

---

# Suggested status codes to use consistently

## Success

* `200 OK` for fetch/update/action success
* `201 Created` for creation
* `204 No Content` for delete

## Errors

* `400 Bad Request` for validation/business rule failure
* `401 Unauthorized` for no auth
* `403 Forbidden` for auth but no permission
* `404 Not Found` for missing resource
* `409 Conflict` for duplicate/order/submission conflicts
* `422 Unprocessable Entity` optional if you want semantic validation split from 400
* `500 Internal Server Error` for unexpected issues

Example:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong"
  }
}
```

---

# Optional normalized error code list

You should standardize codes like:

```txt
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
QUIZ_NOT_FOUND
SECTION_NOT_FOUND
QUESTION_NOT_FOUND
ATTEMPT_NOT_FOUND
ATTEMPT_ALREADY_IN_PROGRESS
ATTEMPT_ALREADY_SUBMITTED
INVALID_QUESTION_OPTIONS
SECTION_ORDER_ALREADY_EXISTS
QUESTION_ORDER_ALREADY_EXISTS
QUIZ_INCOMPLETE
RESULT_NOT_AVAILABLE
INTERNAL_SERVER_ERROR
```

---

# Best endpoint set for MVP

If you want to keep the first version small, build these first:

* `POST /quizzes`
* `GET /quizzes/{quizId}`
* `POST /quizzes/{quizId}/sections`
* `POST /sections/{sectionId}/questions`
* `POST /quizzes/{quizId}/attempts`
* `PUT /attempts/{attemptId}/answers/{questionId}`
* `POST /attempts/{attemptId}/submit`
* `GET /attempts/{attemptId}/result`

That is enough to ship a functional quiz system.

---

# Nice backend response shape for authoring

For admin screens, it is often useful to return nested authoring data:

```json
{
  "id": "quiz_123",
  "title": "JavaScript Basics Quiz",
  "sections": [
    {
      "id": "section_1",
      "title": "Basics",
      "questions": [
        {
          "id": "question_1",
          "text": "What is closure?",
          "options": []
        }
      ]
    }
  ]
}
```

For learner screens, it is often better to hide correctness until submission:

```json
{
  "id": "quiz_123",
  "title": "JavaScript Basics Quiz",
  "sections": [
    {
      "id": "section_1",
      "questions": [
        {
          "id": "question_1",
          "text": "Which keyword declares a block-scoped variable?",
          "type": "SINGLE_CHOICE",
          "options": [
            {
              "id": "option_1",
              "text": "var"
            },
            {
              "id": "option_2",
              "text": "let"
            }
          ]
        }
      ]
    }
  ]
}
```

Do not expose `isCorrect` in learner fetch APIs before submission.

---

I can convert this next into either:

* **OpenAPI / Swagger YAML**
* **frontend TypeScript interfaces**
* **backend DTO contract for NestJS**
