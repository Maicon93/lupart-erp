# Arquitetura Frontend

**Stack**: Vue3 + Quasar + JavaScript

## Estrutura de Pastas

```
frontend/
├── src/
│   ├── assets/                # Imagens, fontes, arquivos estáticos
│   ├── components/            # Componentes reutilizáveis globais
│   │   ├── ui/                # Componentes de UI genéricos
│   │   ├── navbar/            # NavbarComponent.vue
│   │   ├── sidebar/           # SidebarUser.vue, SidebarAdmin.vue
│   │   └── layout/            # LayoutComponent.vue (layout padrão)
│   ├── mixins/                # Mixins Vue (lógica reutilizável entre componentes)
│   ├── config/                # Configurações (axios, constantes)
│   ├── i18n/                  # Arquivos de tradução
│   │   ├── locales/
│   │   │   ├── pt-BR.json
│   │   │   └── en.json
│   │   └── index.js
│   ├── layouts/               # Layouts base (DashboardLayout, AuthLayout)
│   ├── plugins/               # Plugins (axios, quasar, i18n)
│   ├── router/                # Rotas (index.js, guards)
│   ├── schemas/               # Schemas Zod (validação de formulários)
│   ├── services/              # Chamadas HTTP à API
│   │   └── admin/             # Services específicos do painel admin
│   ├── stores/                # Pinia stores (auth, enterprise, etc.)
│   ├── utils/                 # Utilitários (formatadores, masks, ErrorCodes)
│   │   └── ErrorCodes.js      # Códigos de erro (duplicado da API)
│   ├── views/                 # Páginas/Telas
│   │   ├── admin/             # Telas do Painel Administrador
│   │   ├── auth/              # Login, recuperação de senha
│   │   ├── dashboard/         # Dashboard
│   │   ├── cadastros/         # Clientes, Fornecedores, Produtos, etc.
│   │   ├── estoque/           # Entrada, Ajuste, Inventário, Histórico
│   │   ├── movimentacoes/     # PDV, Vendas, Orçamentos, OS
│   │   ├── financeiro/        # Contas a Receber/Pagar, Fluxo, Caixa
│   │   ├── relatorios/        # Relatórios
│   │   └── configuracoes/     # Configurações da Empresa, Meu Plano, Usuários
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
├── package.json
├── vite.config.js
└── quasar.config.js
```

## Padrões

### Rotas
- Cada módulo tem suas rotas definidas em arquivos separados
- Guard de autenticação em todas as rotas protegidas
- Guard de permissão verifica acesso à tela antes de renderizar
- Sem permissão → redireciona para `/`

### Componentes
- Nomenclatura: `PascalCase` (ex: `SidebarUser.vue`)
- **Options API** (`export default { data, computed, watch, methods }`)

### Services
- Um service por entidade (ex: `CustomerService.js`, `ProductService.js`)
- Todos usam instância centralizada do axios com interceptors

### Stores (Pinia)
- `auth` → dados do usuário logado, token, role
- `enterprise` → dados da empresa/tenant ativo
