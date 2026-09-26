# LabLIMS Backend - Test Categories

Working endpoints:
- GET /api/lab/test-categories
- GET /api/lab/test-categories/:id
- POST /api/lab/test-categories
- PUT /api/lab/test-categories/:id
- PATCH /api/lab/test-categories/:id

## Setup
1. Copy `.env.example` to `.env` and set MySQL credentials.
2. Run `database/migrations/003_test_categories.sql` in MySQL.
3. `npm install`
4. `npm run dev`

POST/PATCH body:
```json
{"name":"Haematology"}
```

The backend returns JSON errors for validation, duplicate names, missing records, missing routes and database errors. Every request gets an `X-Request-ID`, and the terminal logs API start/status/duration/requestId.

After POST or PATCH, your frontend should call GET again (or replace the returned row locally) so the UI immediately reflects database truth.
