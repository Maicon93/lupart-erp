# ERP Lupart

Sistema ERP para **comércio e serviços** com suporte a múltiplas empresas e filiais.

## Visão Geral
- Multi-empresa e multi-filial
- Controle de acesso por cargos e permissões
- Cadastro de clientes PF e PJ
- Produtos e serviços (itens simples, sem variações)
- Controle de estoque
- PDV e vendas
- Relatórios gerenciais
- Fiscal: planejado para fase futura

## Navegação

### Documentação Geral
- [Definições](Definições.md) — Regras gerais do sistema
- [Layout](Layout.md) — Estrutura visual (navbar, sidebar, conteúdo)
- [Stack](Stack.md) — Stack tecnológica
- Pendências — Itens pendentes de definição

### Arquitetura
- [Projeto](Arquitetura/Projeto.md) — Estrutura do monorepo
- [Frontend](Arquitetura/Frontend.md) — Estrutura de pastas e padrões do frontend
- [API](Arquitetura/API.md) — Estrutura de pastas e padrões da API

### Boas Práticas
- [Frontend](Boas%20Práticas/Frontend.md) — Regras e convenções do frontend
- [API](Boas%20Práticas/API.md) — Regras e convenções da API

### Claude Code
- CLAUDE — Contexto principal do projeto
- general — Rules gerais
- api — Rules da API
- frontend — Rules do frontend
- skills-api — Regras para criação de skills da API
- skills-frontend — Regras para criação de skills do frontend

### CodeBase
- [Axios](CodeBase/Axios.md) — Interceptor e plugin do axios
- [Confirm Dialog](CodeBase/Confirm%20Dialog.md) — Componente de confirmação
- [Theme Store](CodeBase/Theme%20Store.md) — Store de tema e preferências visuais
- [Logger](CodeBase/Logger.md) — Logger estruturado (winston)
- [Router](CodeBase/Router.md) — Vue Router, guards de autenticação e permissão

### Módulos
- [Menu do Usuário](Módulos/Usuário/Menu.md) — Menu do usuário
- [Menu Administrador](Módulos/Administrador/Menu.md) — Menu do administrador
- [Cadastros](Módulos/Usuário/Cadastros/Clientes.md) — Clientes, Fornecedores, Produtos, Formas de Pagamento
- [Estoque](Módulos/Usuário/Controle%20de%20Estoque/Entrada%20de%20Estoque.md) — Entrada, Ajuste e Histórico de movimentações
- [Movimentações](Módulos/Usuário/Movimentações/Vendas.md) — PDV e Vendas
- [Relatórios](Módulos/Usuário/Relatórios/Vendas%20por%20Período.md) — Relatórios gerenciais
- [Administração](Módulos/Administrador/Empresas.md) — Empresas, Usuários, Cargos, Permissões

## Design Patterns Utilizados

| Pattern | Onde é aplicado |
| --- | --- |
| Repository | `repositories/` — abstrai acesso ao banco |
| Service Layer | `services/` — concentra regras de negócio |
| MVC | Models (TypeORM) + Views (Vue) + Controllers (Express) |
| Middleware | Auth, tenant, validação Zod encadeados antes do controller |
| Interceptor | Axios request (JWT) e response (toast, refresh token) |
| Singleton | Instância única do axios, Pinia stores |
| Provider/Inject | Confirm Dialog via `provide/inject` |
| Mixin | `mixins/` — lógica reutilizável entre componentes |

## Numeração de Telas

| Faixa    | Painel          |
| -------- | --------------- |
| 10–99    | Administrador   |
| 100+     | Usuário         |

- Telas do **Painel Administrador**: começam em **10**, sequencial
- Telas do **Painel do Usuário**: começam em **100**, sequencial
- Não há faixas por módulo — a numeração é contínua dentro de cada painel
