# Boas Práticas — API

## Linguagem
- Código 100% em inglês (variáveis, funções, models, rotas)
- TypeScript strict mode

## Nomenclatura

| Contexto | Formato | Exemplo |
| --- | --- | --- |
| Classes | PascalCase | `ProductService`, `AuthController` |
| Models | PascalCase singular | `Product`, `Customer` |
| Tabelas (banco) | snake_case plural | `products`, `product_categories` |
| Colunas (banco) | snake_case | `company_id`, `created_at` |
| Variáveis | camelCase | `productList`, `isLoading` |
| Funções | camelCase | `getProducts`, `validateInput` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES`, `JWT_SECRET` |
| Interfaces (TS) | PascalCase com prefixo I | `IUser`, `IApiResponse` |
| Rotas/URLs | kebab-case plural | `/api/customers`, `/api/stock-entries` |
| Arquivos TS | PascalCase | `ProductService.ts`, `JWTUtil.ts` |

## Camadas
- Respeitar o fluxo: `Route → Middleware → Controller → Service → Repository`
- **Controller**: recebe request, chama service, monta `IApiResponse` e retorna response
- **Service**: toda regra de negócio fica aqui — retorna **dados puros**, nunca `IApiResponse`
- **Repository**: apenas acesso ao banco, sem lógica de negócio

## Models (TypeORM)
- Um model por arquivo
- Nome do model em PascalCase singular (ex: `Product`, `Customer`)
- Nome da tabela em snake_case plural (ex: `products`, `customers`)
- Toda entidade de tenant possui `company_id` (NOT NULL)
- Tabelas globais como `access_plans` e `permissions` não possuem `company_id`
- Tabelas híbridas como `roles` e `users` possuem `company_id` nullable (null = global, preenchido = tenant)
- **Chaves primárias**: sempre `id` sequencial (auto-increment) — nunca UUID

## Rotas
- RESTful: usar verbos HTTP corretamente (GET, POST, PUT, DELETE)
- Nomenclatura em kebab-case plural (ex: `/api/customers`, `/api/stock-entries`)
- Prefixo de versão: `/api/v1/...` (V2 seria um projeto novo)

## Respostas da API
- Todas as respostas da API seguem a interface `IApiResponse`:
```ts
interface IApiResponse<T = any> {
  type: 'success' | 'error' | 'info' | 'warning'  // obrigatório
  messageCode?: string                              // opcional
  data?: T                                          // opcional
}
```
- `type`: sempre presente — indica o tipo da resposta
- `messageCode`: código de mensagem para i18n (ex: `CREATED`, `NOT_FOUND`) — a API **nunca** retorna texto, apenas códigos
- `data`: objeto com os dados retornados (listagem, entidade, etc.)
- Usar ErrorCodes para códigos de erro — nunca retornar mensagens hardcoded
- Status HTTP corretos (200, 201, 400, 401, 403, 404, 500)

## Multi-Tenant
- Toda query deve filtrar por `company_id`
- Nunca confiar no `company_id` vindo do body — usar sempre o do middleware
- Rotas de admin não passam pelo middleware de tenant

## Validação
- Usar **Zod** para validação de dados
- Schemas ficam na pasta `src/schemas/` (ex: `CustomerSchema.ts`)
- A validação é feita via **middleware** que recebe o schema como parâmetro
- O middleware valida o body antes de chegar no controller
- Nunca confiar em dados vindos do frontend

## Interfaces e Types
- **Todas** as interfaces ficam na pasta `interfaces/` com prefixo **I** (ex: `IUser`, `IProduct`, `IMarkToDelete`)
- Types genéricos (usados em mais de um arquivo) → pasta `interfaces/`, com prefixo **I**
- Types locais (usados apenas no próprio arquivo) → ficam **dentro do arquivo .ts**, **sem** `export`
- Nunca retornar o model completo na resposta — usar interfaces para definir o que a API expõe

## Exclusão e Inativação
- Registros nunca são excluídos fisicamente do banco de dados
- Duas abordagens conforme o tipo de entidade:

| Abordagem | Quando usar | Exemplo |
| --- | --- | --- |
| `status` (active/inactive) | Entidades que podem ser reativadas | products, categories, payment_types |
| `deleted_at` (timestamp) | Entidades que o usuário "exclui" sem possibilidade de reativar | customers, suppliers, quotes |

- `status` = inactive → não aparece em seletores, mas continua visível em listagens com filtro
- `deleted_at` preenchido → não aparece em nenhuma listagem (filtro `deleted_at IS NULL`)
- Entidades com workflow (ex: `quotes`) podem usar **ambos**: `status` para o ciclo de vida e `deleted_at` para exclusão

## Armazenamento com Máscara
- Campos formatados são armazenados **com máscara** no banco de dados para facilitar consultas e exibição
- A máscara é aplicada no frontend e persistida no banco
- Campos que seguem essa regra:

| Campo | Máscara | Tabelas |
| --- | --- | --- |
| `cpf_cnpj` | `000.000.000-00` (CPF) ou `00.000.000/0000-00` (CNPJ) | customers, suppliers |
| `cnpj` | `00.000.000/0000-00` | companies |
| `phone` | `(99) 9999-9999` ou `(99) 99999-9999` | customers, suppliers, company_profiles, user_profiles |
| `zip_code` | `00000-000` | customers, suppliers, company_profiles |

## On Cascade / FK
- **Nunca** usar `ON DELETE CASCADE`
- Não deve ser possível deletar nenhum registro que esteja atrelado por uma FK
- A API deve validar vínculos antes de qualquer exclusão/inativação e retornar erro caso existam dependências

## Validação de Exclusão por Vínculos
- Toda exclusão (delete, soft delete ou inativação) deve verificar vínculos ativos antes de executar
- Se houver vínculos, a API deve rejeitar a operação e retornar erro explicativo via `IApiResponse`
- O `messageCode` deve indicar o motivo (ex: `ROLE_HAS_ACTIVE_USERS`, `PAYMENT_TYPE_HAS_TITLES`)
- A verificação é feita na camada **Service**, antes de executar a operação

## Transactions
- **SEMPRE** usar transaction ao persistir dados (create, update, delete)
- Garante rollback automático em caso de falha
- Transaction é gerenciada na camada **Service**

## Migrations
- Sempre criar migration para alterações no banco — nunca alterar manualmente
- Migrations devem ser reversíveis (up e down)
- Nomenclatura: `{timestamp}-{DescricaoEmPascalCase}.ts`

## Seeds
- Seeds para dados iniciais do sistema (permissões, roles padrão, etc.)
- Seeds de desenvolvimento separados dos de produção
- Toda criação de empresa deve chamar o helper [seedCompanyData](../CodeBase/Helpers/seedCompanyData.md) dentro da mesma transação — garantindo que a empresa já nasce com os registros iniciais necessários

## Segurança
- **Rate Limiting** (`express-rate-limit`):
  - Rotas de auth (login, refresh, reset): **5 requisições/minuto** por IP
  - Rotas gerais: **200 requisições/minuto** por usuário
  - Retornar **429** com `{ type: 'error', messageCode: 'TOO_MANY_REQUESTS' }`
  - Armazenamento: memória (single-server), migrar para Redis se escalar
- **CORS**: aberto para todas as origens (`cors()` sem restrição). Restringir via env quando necessário
- **Sanitização**: nunca confiar em input do usuário — validar com Zod + sanitizar strings

## Variáveis de Ambiente
- Nomes sempre em **UPPER_SNAKE_CASE** (ex: `DB_HOST`, `JWT_SECRET`, `AWS_S3_BUCKET`)
- Configs sensíveis (senhas, secrets, keys) **devem ser variáveis de ambiente** — nunca hardcoded
- Sempre que adicionar uma nova env, incluir também no `.env.example` (sem o valor real)

## Testes

### Unitários (service isolado, repository mockado)

**Estoque:**
- Cálculo de média ponderada na entrada de estoque
- Validação de estoque insuficiente antes de venda/ajuste
- Cálculo de divergência no inventário (quantidade física vs sistema)
- Bloqueio de operações quando inventário está ativo

**Vendas:**
- Cálculo de parcelas (divisão do total, datas de vencimento)
- Aplicação de desconto (percentual e valor fixo)
- Conversão de orçamento em venda

**Financeiro:**
- Baixa parcial de título (valor restante, status)
- Cálculo do fluxo de caixa por período (entradas vs saídas)

**Ordens de Serviço:**
- Cálculo de valor total (produtos + serviços)
- Transição de status (aberta → em andamento → finalizada → faturada)

### Integração (service + banco real)

**Multi-tenant:**
- Empresa A não acessa dados da Empresa B em cada entidade crítica
- company_id do middleware prevalece sobre company_id do body

**Fluxos multi-tabela:**
- Criar venda → deduzir estoque → gerar parcelas em contas a receber → registrar movimentação de produto
- Entrada de estoque → atualizar quantidade e custo médio do produto → registrar movimentação
- Finalizar inventário → gerar ajustes automáticos para divergências
- Inativar produto → validar que não tem vínculos ativos (venda em aberto, inventário ativo)

### Sem teste
- CRUDs simples (Categorias, Unidades de Medida, Tipos de Pagamento, Fornecedores)
- Controllers (passthrough para services)
- Frontend

## Geral
- Não commitar `console.log` — usar logger estruturado
- Funções pequenas e com responsabilidade única
- Nomes descritivos para variáveis e funções
- Tratar exceções com try/catch nos controllers
