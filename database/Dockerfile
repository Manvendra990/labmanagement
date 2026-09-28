FROM mysql:8.4

COPY database/schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY backend/database/migrations/003_test_categories.sql /docker-entrypoint-initdb.d/02-test-categories.sql