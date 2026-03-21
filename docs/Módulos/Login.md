# Login

Telas de autenticação do sistema. Usam o **AuthLayout** — sem navbar/sidebar, card centralizado na tela.

## Layout

- **AuthLayout** (`src/layouts/AuthLayout.vue`)
- Card centralizado vertical e horizontalmente
- Logo do sistema no topo do card
- Fundo usa a cor `background` do tema
- Reaproveitado por todas as telas de autenticação

```
┌─────────────────────────────────────────────┐
│                                             │
│            ┌───────────────────┐            │
│            │   Logo Lupart     │            │
│            │                   │            │
│            │   E-mail          │            │
│            │   [____________]  │            │
│            │                   │            │
│            │   Senha           │            │
│            │   [____________]  │            │
│            │                   │            │
│            │   [   Entrar   ]  │            │
│            └───────────────────┘            │
│                                             │
└─────────────────────────────────────────────┘
```

## Tela: Login

- **Rota**: `/login`
- **Campos**: e-mail, senha
- **Ações**:
  - Botão "Entrar" com spinner enquanto processa
- **Validação (Zod)**: e-mail válido, senha não vazia
- **Fluxo ao logar**:
  1. API retorna access token + seta cookie HttpOnly do refresh token
  2. Salva access token no localStorage
  3. Salva dados do usuário na store `auth`
  4. Se role `admin` → redireciona direto para o Painel Administrador
  5. Se role `user` com **uma empresa** → seta `company_id` e redireciona para `/` (Tela Inicial)
  6. Se role `user` com **mais de uma empresa** → exibe tela de seleção de empresa antes de redirecionar
- **Erros**: exibidos via toast pelo interceptor (credenciais inválidas, usuário inativo, etc.)
- **Já logado**: se token válido no localStorage → redireciona direto, não mostra login
