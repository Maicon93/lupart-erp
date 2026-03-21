# Arquitetura API

**Stack**: TypeScript + TypeORM + PostgreSQL (REST)

## Estrutura de Pastas

```
api/
├── src/
│   ├── config/                # Configurações (database, storage, env)
│   │   ├── database.ts
│   │   └── storage.ts
│   ├── controllers/           # Controllers (recebe request, retorna response)
│   ├── models/                # Models TypeORM (mapeamento de tabelas)
│   ├── interfaces/            # Interfaces/Types TypeScript
│   ├── middlewares/            # Middlewares (auth, enterprise/tenant, validação)
│   │   ├── authMiddleware.ts
│   │   ├── enterpriseMiddleware.ts
│   │   └── validationMiddleware.ts  # Valida body via Zod schema
│   ├── migrations/            # Migrations do TypeORM
│   ├── repositories/          # Repositories (acesso ao banco)
│   ├── routes/                # Definição de rotas
│   ├── schemas/               # Schemas Zod (validação de input)
│   ├── scripts/               # Scripts utilitários (init DB, etc.)
│   ├── seeds/                 # Seeds (dados iniciais)
│   ├── services/              # Services (regras de negócio)
│   ├── helpers/               # Helpers (JWT, ErrorCodes, Logger, etc.)
│   │   ├── JWTUtil.ts
│   │   ├── ErrorCodes.ts      # Códigos de erro (duplicado do front)
│   │   └── Logger.ts          # Logger estruturado (winston)
│   ├── app.ts                 # Configuração do Express
│   └── index.ts               # Entry point
├── tests/
│   ├── auth/
│   ├── controllers/
│   ├── entities/
│   └── services/
├── package.json
└── tsconfig.json
```

## Padrão de Camadas

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

- **Route**: define endpoint e método HTTP
- **Middleware**: autenticação (JWT) + resolução do tenant (`company_id`)
- **Controller**: recebe request (já validada pelo middleware Zod), chama service, retorna response
- **Service**: regras de negócio
- **Repository**: queries ao banco via TypeORM

## Multi-Tenant na API
- O `enterpriseMiddleware` extrai o `company_id` do usuário autenticado
- Todas as queries são filtradas por `company_id`
- Rotas de admin não passam pelo middleware de tenant

## Autenticação
- JWT (access token + refresh token)
- **Access token**: curta duração, enviado no header `Authorization: Bearer`
- **Refresh token**: longa duração, enviado via **cookie HttpOnly** (seguro, não acessível por JS)
- Refresh token armazenado no banco (tabela `refresh_tokens`)
