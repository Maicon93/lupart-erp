# Axios — Interceptor e Plugin

Baseado em: `frontend/src/plugins/axios.js`

## Plugin
- O axios é registrado como plugin Vue (`app.use`)
- Disponível via `inject('$api')` ou `import { $api }` direto nos services
- Base URL configurada via variável de ambiente `VITE_API_BASE_URL`

## Request Interceptor
- Adiciona o token JWT automaticamente no header `Authorization: Bearer`
- Token obtido diretamente do `localStorage` (fonte da verdade)
- A store `auth` espelha o token para uso reativo nos componentes, mas o interceptor não depende dela

## Response Interceptor
- Intercepta **todas** as respostas da API
- Verifica o `IApiResponse` retornado:
  - Se tiver `messageCode` → exibe **toast** de acordo com o `type`:
    - `type: 'success'` → `toast.success(i18n(messageCode))`
    - `type: 'error'` → `toast.error(i18n(messageCode))`
    - `type: 'info'` → `toast.info(i18n(messageCode))`
    - `type: 'warning'` → `toast.warning(i18n(messageCode))`
  - Se **não** tiver `messageCode` → **não exibe toast**
- O `messageCode` é traduzido via **i18n** antes de exibir no toast

## Tratamento de Erros HTTP
- **401 (Unauthorized)**:
  - Tenta renovar o token via `/auth/refresh`
  - Se renovar com sucesso → repete a requisição original
  - Se falhar → executa logout e redireciona para `/login`
  - Requisições simultâneas são enfileiradas durante a renovação (evita múltiplos refresh)
- **Rotas de auth** (`/auth/login`, `/auth/register`, `/auth/refresh`) são ignoradas pelo fluxo de renovação

## Renovação de Token
- Usa uma instância separada do axios (evita loop com interceptor)
- Flag `isRefreshing` controla se já está renovando
- `failedQueue` armazena requisições que falharam enquanto o token está sendo renovado
- Ao renovar com sucesso, processa toda a fila com o novo token

## Logout
- Limpa `localStorage`
- Limpa stores (enterprise, etc.)
- Redireciona para `/login`
