# LabLIMS Backend - Test Categories

Working endpoints:
- GET /api/lab/test-categories
- GET /api/lab/test-categories/:id
- POST /api/lab/test-categories
- PUT /api/lab/test-categories/:id
- PATCH /api/lab/test-categories/:id

## Local MySQL + Prisma setup
1. Install and start MySQL locally, then create the `lab_lims` database (or use the existing Compose MySQL service from the repository root).
2. Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`, then set `DATABASE_URL` to the matching Prisma MySQL URL. URL-encode special characters in the URL username/password (for example, `%` becomes `%25`).
3. Run `npm install` from `backend`.
4. Run `npm run db:setup` from `backend` to create/update the Prisma-managed tables and seed the default test categories.
5. Run `npm run dev` from `backend`.

Use `npm run db:generate` to regenerate Prisma Client after editing `prisma/schema.prisma`. `npm run db:push` applies schema changes to the configured local database without creating a migration file.

Prisma persistence currently covers test categories, lab units, and lab tests. Billing, reports, employees, agents, referrers, and their related demo endpoints still use the in-memory data in `src/store.js` and reset when the backend restarts.

POST/PATCH body:
```json
{"name":"Haematology"}
```

The backend returns JSON errors for validation, duplicate names, missing records, missing routes and database errors. Every request gets an `X-Request-ID`, and the terminal logs API start/status/duration/requestId.

After POST or PATCH, your frontend should call GET again (or replace the returned row locally) so the UI immediately reflects database truth.
