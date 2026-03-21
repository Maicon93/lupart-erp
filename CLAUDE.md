# Lupart — ERP para comércio e serviços

- Multi-tenant (`company_id` em toda tabela de tenant — tabelas globais não possuem)
- Multi-idioma (i18n: pt-BR, en)
- Dois painéis: Administrador (telas 10–99) e Usuário (telas 100+)

## Monorepo

```
lupart/
├── front/          # Vue3 + Quasar + JavaScript
├── api/            # TypeScript + TypeORM + PostgreSQL (REST)
├── docs/           # Documentação completa do projeto
└── .claude/        # Rules, skills, CLAUDE.md
```

## Stack

| Camada | Tecnologias |
|--------|------------|
| Frontend | Vue3, Quasar, JavaScript, Options API, Pinia, vue-i18n, Zod, vue3-toastify, ESLint, Prettier |
| API | TypeScript, TypeORM, Express, JWT, Zod, Winston, cors, express-rate-limit, ESLint, Prettier |
| Banco | PostgreSQL |
| Storage | AWS S3 |

## Arquitetura da API

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

- **Controller**: monta `IApiResponse`, retorna response
- **Service**: regras de negócio, retorna dados puros
- **Repository**: acesso ao banco via TypeORM

## Autenticação

- Access token (JWT) → localStorage → header `Authorization: Bearer`
- Refresh token → cookie HttpOnly → armazenado no banco (`refresh_tokens`)
- Renovação automática pelo interceptor do axios ao receber 401

## Documentação

Specs completas do projeto estão em `docs/`. Sempre consultar antes de implementar um módulo.

- `docs/Arquitetura/` — Estrutura do projeto, frontend e API
- `docs/Boas Práticas/` — Convenções de código (frontend e API)
- `docs/CodeBase/` — Helpers, interceptors, componentes globais
- `docs/Database/` — Schema de todas as tabelas (uma por arquivo)
- `docs/Módulos/Administrador/` — Specs dos módulos do painel admin
- `docs/Módulos/Usuário/` — Specs dos módulos do painel usuário
- `docs/Definições.md` — Regras gerais do sistema (i18n, moeda, auditoria)
- `docs/Layout.md` — Estrutura de layout (navbar, sidebar)

## Rules

Convenções e padrões detalhados estão em `.claude/rules/`:

- `general.md` — Regras gerais (naming, multi-tenant, soft delete)
- `api.md` — Padrões da API (camadas, IApiResponse, TypeORM)
- `frontend.md` — Padrões do frontend (Options API, services, componentes)
- `i18n.md` — Convenção de chaves i18n e sincronização API ↔ Frontend
- `commits.md` — Conventional Commits
- `testing.md` — Quando e como testar (unitários e integração)
- `teammates.md` — Regras de uso de Agent Teams
- `skills-api.md` — Template para criar skills de módulos da API
- `skills-frontend.md` — Template para criar skills de módulos do frontend

## Skills Disponíveis

<!-- Atualizar conforme skills forem criadas -->

## Comandos

```bash
# Frontend
cd front
npm install
npm run dev

# API
cd api
npm install
npm run dev
```
