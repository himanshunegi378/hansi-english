# Anki System REST API Contract

## Overview

This API provides endpoints for managing spaced-repetition flashcard decks, cards, and study sessions.

- Base URL: `/api/v1`
- Content-Type: `application/json`
- Authentication: all requests require the app's existing authenticated NextAuth session. The API does not use Bearer JWT tokens in v1.

## Success Envelope

All non-`204` success responses use this JSON shape:

```json
{
  "data": {}
}
```

Endpoints that return additional metadata include a top-level `meta` object:

```json
{
  "data": [],
  "meta": {
    "totalDue": 1
  }
}
```

## Error Envelope

All error responses use this JSON shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Card front text cannot be empty."
  }
}
```

Common status codes:

- `400` validation or malformed JSON
- `401` no active authenticated session
- `404` deck or card not found for the current user
- `500` unexpected server error

## Deck Management

### List All Decks

- Method: `GET`
- Endpoint: `/decks`

Response `200`:

```json
{
  "data": [
    {
      "id": "cuid123",
      "name": "JavaScript Basics",
      "description": "Core concepts",
      "totalCards": 45,
      "dueCards": 12,
      "createdAt": "2026-04-05T10:00:00.000Z"
    }
  ]
}
```

### Create a Deck

- Method: `POST`
- Endpoint: `/decks`

Request body:

```json
{
  "name": "Advanced React",
  "description": "Optional deck description"
}
```

Response `201`:

```json
{
  "data": {
    "id": "cuid124",
    "name": "Advanced React",
    "description": "Optional deck description",
    "createdAt": "2026-04-05T10:05:00.000Z"
  }
}
```

### Get Single Deck

- Method: `GET`
- Endpoint: `/decks/:id`

Response `200`:

```json
{
  "data": {
    "id": "cuid123",
    "name": "JavaScript Basics",
    "description": "Core concepts",
    "createdAt": "2026-04-05T10:00:00.000Z",
    "updatedAt": "2026-04-05T10:00:00.000Z",
    "cards": [
      {
        "id": "card_1",
        "deckId": "cuid123",
        "front": "What is a closure?",
        "back": "A function bundled with its lexical environment.",
        "interval": 2.4,
        "ease": 2.5,
        "nextReview": "2026-04-07T10:15:00.000Z",
        "createdAt": "2026-04-05T10:00:00.000Z",
        "updatedAt": "2026-04-05T10:15:00.000Z"
      }
    ]
  }
}
```

### Delete Deck

- Method: `DELETE`
- Endpoint: `/decks/:id`

Response `204 No Content`

## Card Management

### Add Card to Deck

- Method: `POST`
- Endpoint: `/decks/:id/cards`

Request body:

```json
{
  "front": "What does CSS stand for?",
  "back": "Cascading Style Sheets"
}
```

Response `201`:

```json
{
  "data": {
    "id": "card_2",
    "deckId": "cuid123",
    "front": "What does CSS stand for?",
    "back": "Cascading Style Sheets",
    "interval": 0,
    "ease": 2.5,
    "nextReview": "2026-04-05T10:00:00.000Z",
    "createdAt": "2026-04-05T10:00:00.000Z",
    "updatedAt": "2026-04-05T10:00:00.000Z"
  }
}
```

### Update Card

- Method: `PUT`
- Endpoint: `/cards/:id`

Request body:

```json
{
  "front": "Updated question?",
  "back": "Updated answer"
}
```

Response `200`: returns the updated card object in the standard `data` envelope.

### Delete Card

- Method: `DELETE`
- Endpoint: `/cards/:id`

Response `204 No Content`

## Study and Review

### Get Study Queue

- Method: `GET`
- Endpoint: `/decks/:id/study`

Returns cards where `nextReview <= now`.

Response `200`:

```json
{
  "data": [
    {
      "id": "card_1",
      "front": "What is a closure?",
      "back": "A function bundled with its lexical environment."
    }
  ],
  "meta": {
    "totalDue": 1
  }
}
```

### Submit Review

- Method: `POST`
- Endpoint: `/cards/:id/review`

Request body:

```json
{
  "grade": 3
}
```

Grades:

- `1` = Again
- `2` = Hard
- `3` = Good
- `4` = Easy

Response `200`:

```json
{
  "data": {
    "id": "card_1",
    "newInterval": 2.4,
    "newEase": 2.5,
    "nextReview": "2026-04-07T10:15:00.000Z"
  }
}
```
