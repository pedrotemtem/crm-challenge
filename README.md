# PaddyLabs CRM Challenge

A minimal CRM application built as a Turborepo monorepo with a Next.js + Material UI frontend and an Express + SQLite API.

## Live Demo

- **Frontend:** http://16.171.171.82:3000
- **API:** http://16.171.171.82:3123

## Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Monorepo    | Turborepo + pnpm                          |
| Backend     | Node.js · Express · TypeScript · SQLite   |
| Frontend    | Next.js · Material UI · TypeScript        |
| Deployment  | AWS EC2 (PM2)                             |

## Project Structure

```
apps/
  api/    Express + SQLite API
  web/    Next.js + MUI frontend
packages/
  types/             Shared TypeScript types
  ui/                Shared UI components
  eslint-config/     Shared ESLint config
  typescript-config/ Shared tsconfig presets
```

## Running Locally

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)

### Install & run

```bash
git clone https://github.com/pedrotemtem/crm-challenge.git
cd crm-challenge
pnpm install

# Configure the frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3123" > apps/web/.env.local

# Run both API and frontend
pnpm dev
```

- API: http://localhost:3123
- Frontend: http://localhost:3000

You can also run each app individually with `pnpm dev` inside `apps/api` or `apps/web`.

### Seed the Database

With the API running, populate it from the source CSV (hosted on S3):

```bash
curl -X POST http://localhost:3123/seed
```

## API Endpoints

### Customers
| Method | Endpoint                          | Description                  |
|--------|-----------------------------------|------------------------------|
| GET    | `/customers`                      | List all customers           |
| GET    | `/customers/:id`                  | Get a single customer        |
| GET    | `/customers/:id/subscriptions`    | Customer's subscriptions     |
| GET    | `/customers/:id/transactions`     | Customer's transactions      |

### Subscriptions
| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| GET    | `/subscriptions`                      | List all subscriptions       |
| GET    | `/subscriptions/:id`                  | Get a single subscription    |
| GET    | `/subscriptions/:id/transactions`     | Subscription's transactions  |

### Transactions
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/transactions`       | List all transactions    |
| GET    | `/transactions/:id`   | Get a single transaction |

### Seed
| Method | Endpoint   | Description                |
|--------|------------|----------------------------|
| POST   | `/seed`    | Seed database from S3 CSV  |

## Frontend Views

- **Customers** — Paginated table with search by name or email
- **Customer Detail** — Profile, subscriptions and recent transactions
- **Subscriptions** — Table with active/cancelled filter
- **Transactions** — Table with stats (total amount, count, success rate)

## Deployment

Both services run on a single AWS EC2 `t3.micro` instance under PM2. To redeploy, SSH into the instance and run:

```bash
~/deploy.sh
```

This pulls the latest code, rebuilds the API and restarts PM2.