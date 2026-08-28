# Getting Started — Project Setup & Local Development

This guide explains how to spin up the local development environment, run the database with Docker, apply migrations, start the backend service, and execute automated tests.

---

## 1. Prerequisites

Make sure the following tools are installed on your machine:

- **Docker & Docker Compose** ([Download Docker Desktop](https://www.docker.com/products/docker-desktop/))
- **Bun** (v1.3+ recommended) — `curl -fsSL https://bun.sh/install | bash`
- **Node.js** (v20+ / v24)
- **Git**

---

## 2. Step-by-Step Quickstart

### Step 1: Clone and Install Dependencies

```bash
git clone <repository_url>
cd SIH

# Install monorepo dependencies
bun install
```

---

### Step 2: Start PostgreSQL with Docker

We provide a `docker-compose.yml` in the root directory that spins up PostgreSQL on port **5433** (to avoid port collisions with any local PostgreSQL installations on port 5432).

```bash
# Start PostgreSQL in the background
docker compose up -d

# Verify container is running and healthy
docker ps
```

---

### Step 3: Configure Environment Variables

Navigate to `apps/backend/` and copy `.env.example` to `.env`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Default local `.env` configuration:

```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# PostgreSQL Container Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sih_db?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="super-secret-access-token-key-change-in-prod-1234"
JWT_REFRESH_SECRET="super-secret-refresh-token-key-change-in-prod-5678"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Resend Email (Leave dummy or add your real key from https://resend.com)
RESEND_API_KEY=re_123456789
EMAIL_FROM=onboarding@resend.dev
```

---

### Step 4: Run Prisma Database Migrations

Apply the database migrations to create the tables in PostgreSQL using the shared database package (`@repo/database`):

```bash
# Apply migrations to your PostgreSQL container from repository root
bun run db:migrate

# Or directly in packages/database
bun run --cwd packages/database prisma:migrate
```

To view or manage the database visually with Prisma Studio:

```bash
bun run db:studio
```

---

### Step 5: Start the Backend Service

```bash
# Option A: Start backend directly with Bun
bun run --cwd apps/backend dev

# Option B: Start via Turborepo
bun run dev --filter=backend
```

The backend server will start on **`http://localhost:4000`**.

Verify the server is running:
```bash
curl http://localhost:4000/health
# Response: {"status":"ok","service":"SIH Backend Auth API",...}
```

---

## 3. Running Automated Tests

Run the test suite using Vitest:

```bash
# Run all unit and integration tests
bun run --cwd apps/backend test

# Run tests in watch mode
bun run --cwd apps/backend test:watch
```

Run static type checking across the entire monorepo:

```bash
bun run check-types
```

---

## 4. Useful Commands Reference

| Action | Command |
| :--- | :--- |
| **Start Database** | `docker compose up -d` |
| **Stop Database** | `docker compose down` |
| **Reset Database Data** | `docker compose down -v && docker compose up -d` |
| **Run Migrations** | `bun run --cwd apps/backend prisma migrate dev` |
| **Generate Prisma Client** | `bun run --cwd apps/backend prisma generate` |
| **Start Backend (Dev)** | `bun run --cwd apps/backend dev` |
| **Run Test Suite** | `bun run --cwd apps/backend test` |
| **Typecheck Monorepo** | `bun run check-types` |

---

## 5. Troubleshooting

### Port 5433 Already in Use
If port 5433 is in use on your system, change the port mapping in `docker-compose.yml` (e.g. `5434:5432`) and update the `DATABASE_URL` in `apps/backend/.env`.

### Docker Container Won't Start
Check container logs:
```bash
docker logs sih_postgres
```
