# WebMate — Backend API Documentation

This document specifies the REST and streaming API contracts provided by the `@webmate/backend` service.

> [!IMPORTANT]
> In **Phase 0**, only the `GET /health` endpoint is actively implemented. All endpoints under `/api/v1/*` are **planned specifications** that will be built in Phase 3 and Phase 4.

---

## 1. Base URL & Protocol

- **Local Development**: `http://127.0.0.1:4000`
- **Protocol**: HTTP/1.1 (Development) / HTTPS (Production)
- **Content Type**: `application/json` (Standard REST) or `text/event-stream` (AI token streaming)

---

## 2. Active Endpoints (Phase 0)

### `GET /health`
Returns the operational health and version status of the backend service.

- **Method**: `GET`
- **URL**: `/health`
- **Headers**: None required
- **Response**: `200 OK`

```json
{
  "status": "ok",
  "service": "@webmate/backend",
  "version": "0.1.0",
  "timestamp": "2026-11-09T11:00:00.000Z"
}
```

---

## 3. Planned Endpoints (Phase 3 & Phase 4)

### `POST /api/v1/chat` *(Planned: Phase 3)*
Streams AI companion conversational responses using Server-Sent Events (SSE).

- **Method**: `POST`
- **URL**: `/api/v1/chat`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: text/event-stream`
- **Request Body**:
```json
{
  "conversationId": "uuid-v4",
  "message": "Can you explain what this section is about?",
  "pageContext": {
    "url": "https://docs.example.com/api",
    "title": "API Documentation",
    "selectedText": "OAuth2 Token Exchange mechanism..."
  }
}
```
- **Response**: `200 OK` (`text/event-stream`)
```
event: token
data: {"token": "OAuth2"}

event: token
data: {"token": " is an authorization"}

event: done
data: {"finishReason": "stop"}
```

---

### `POST /api/v1/analyze/page` *(Planned: Phase 4)*
Analyzes extracted webpage content and generates a companion summary.

- **Method**: `POST`
- **URL**: `/api/v1/analyze/page`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "url": "https://example.com/pricing",
  "title": "Pricing & Plans",
  "content": "Cleaned readable text extracted from the DOM...",
  "maxLength": "concise"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": "This page outlines three subscription tiers: Free, Pro, and Enterprise.",
    "keyTakeaways": [
      "Free tier includes basic usage up to 1,000 requests/month.",
      "Pro unlocks unlimited API usage at $20/month."
    ],
    "suggestedActions": [
      "Check the Free tier limitations",
      "Compare feature matrix"
    ]
  },
  "timestamp": "2026-11-09T11:00:00.000Z"
}
```

---

### `POST /api/v1/analyze/element` *(Planned: Phase 4)*
Explains a specific highlighted or clicked DOM element.

- **Method**: `POST`
- **URL**: `/api/v1/analyze/element`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "tagName": "BUTTON",
  "innerText": "Deploy to Production",
  "attributes": {
    "class": "btn-primary",
    "aria-label": "Trigger production deployment pipeline",
    "data-testid": "deploy-btn"
  },
  "surroundingContext": "Form section: Continuous Deployment settings"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "elementRole": "Action Button",
    "explanation": "Clicking this button starts the build pipeline that pushes your code directly to live production users.",
    "warning": "Ensure all automated integration tests pass before clicking."
  },
  "timestamp": "2026-11-09T11:00:00.000Z"
}
```

---

## 4. Standard Error Response Envelope

All API errors return a consistent JSON envelope:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The provided pageContext exceeds the maximum allowed token limit."
  },
  "timestamp": "2026-11-09T11:00:00.000Z"
}
```

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400` | `INVALID_REQUEST` | Missing or malformed parameters. |
| `429` | `RATE_LIMIT_EXCEEDED` | Request quota per minute has been exhausted. |
| `500` | `INTERNAL_SERVER_ERROR` | An unexpected backend or LLM gateway failure occurred. |
