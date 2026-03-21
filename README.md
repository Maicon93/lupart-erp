# Lupart

Multi-tenant ERP for commerce and services.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Vue3, Quasar, JavaScript, Pinia, vue-i18n, Zod, ESLint, Prettier, [Material Icons](https://fonts.google.com/icons) |
| API | TypeScript, Express, TypeORM, JWT, Zod, Winston, ESLint, Prettier |
| Database | PostgreSQL |
| Storage | AWS S3 |

## Project Structure

```
lupart/
├── front/          # Frontend (Vue3 + Quasar)
├── api/            # REST API (Express + TypeORM)
└── .claude/        # Claude Code rules and skills
```

## Setup

### API

```bash
cd api
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd front
npm install
npm run dev
```

## Features

- Multi-tenant architecture with company-level isolation
- Multi-language support (pt-BR, en)
- Admin and User panels with role-based access control
- Master data management (customers, suppliers, products, categories)
- Stock control (entries, adjustments, physical inventory)
- POS, sales, quotes, and service orders
- Financial management (receivables, payables, cash flow)
- Reports and analytics
