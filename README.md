# SUH Backend — minimal TypeScript + Express + Postgres setup

Quick scaffold using ES modules, TypeScript, PostgreSQL and nodemon for development.

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env` and edit `DATABASE_URL`:

```bash
cp .env.example .env
```

3. Run database migrations

```bash
npm run migrate:up
```

## Run (development)

```bash
npm run dev
```

## Build & run (production)

```bash
npm run build
npm start
```

## Database Migrations

- **Run migrations**: `npm run migrate:up`
- **Rollback last migration**: `npm run migrate:down`
- **Create new migration**: `npm run migrate:create migration-name`

See [migrations/README.md](migrations/README.md) for more details.

## Notes

- `src/index.ts` is the server entrypoint with a `/db-time` route that queries Postgres.
- `src/db/dbConnection.ts` exports a `pool` (pg Pool) using `DATABASE_URL`.
- `src/db/schema.ts` contains TypeScript interfaces for database tables.
