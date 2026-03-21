# Router

Configuração do Vue Router com guards de autenticação e permissão.

## Estrutura

- Arquivo principal: `src/router/index.js`
- Rotas organizadas por módulo em arquivos separados

## Layouts por Rota

| Rota | Layout |
|------|--------|
| `/login` | AuthLayout |
| Todas as demais (autenticadas) | DashboardLayout |

## Guards (`beforeEach`)

A cada navegação, o router executa os seguintes checks em ordem:

1. **Autenticação**: verifica se existe token válido no localStorage
   - Se não estiver logado e a rota exige auth → redireciona para `/login`
   - Se já estiver logado e acessar `/login` → redireciona para `/`
2. **Permissão**: faz uma **requisição HTTP** à API (usando o plugin do [axios](Axios.md)) para verificar se o usuário tem permissão para acessar a tela
   - A cada navegação, sempre consulta a API (nunca cache local)
   - Garante que a permissão está **sempre atualizada** e **não pode ser burlada**
   - Se sem permissão → redireciona para `/`

## Rotas Públicas

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de login (AuthLayout) |

## Rotas sem Permissão

| Rota | Descrição |
|------|-----------|
| `/` | Tela Inicial — acesso garantido a todos os usuários autenticados (evita loop de redirecionamento) |

## Convenções

- Nomes de rota em inglês e kebab-case (ex: `stock-entry`, `payment-methods`)
- Lazy loading em todas as views: `() => import(...)`
- Cada módulo define suas rotas em arquivo separado
- Rotas do Painel Administrador e Painel do Usuário são separadas
