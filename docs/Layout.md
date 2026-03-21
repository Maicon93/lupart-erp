# Layout

O layout é um componente **Vue3 + Quasar** que envolve todas as telas do sistema.

## Layouts

| Layout | Arquivo | Uso |
|--------|---------|-----|
| **AuthLayout** | `src/layouts/AuthLayout.vue` | Login, Esqueci minha senha |
| **DashboardLayout** | `src/layouts/DashboardLayout.vue` | Todas as telas autenticadas (navbar + sidebar + conteúdo) |

## Estrutura do DashboardLayout

```
┌──────────────────────────────────────────────┐
│ 🏢 Minha Empresa              🔔        [Sair]│
│ () Maicon         Navbar                     │
├──────────┬───────────────────────────────────┤
│          │ ┌───────────────────────────────┐ │
│ Sidebar  │ │  Título da Tela               │ │
│          │ │  (conteúdo da tela)           │ │
│          │ │                               │ │
│          │ │                               │ │
│          │ │                               │ │
│          │ │                               │ │
│ v1.0.0   │ └───────────────────────[Admin] │ │
└──────────┴───────────────────────────────────┘
```

## Navbar (única)
- Componente único, compartilhado entre os dois painéis
- **Canto esquerdo**:
  - **Logo + Nome da empresa** (maior, em cima)
  - **Avatar neutro (ícone genérico) + Nome do usuário** (menor, em baixo)
- **Canto direito**: ícone de sino (notificações, futuro) + ícone de logout

## Sidebar (duas versões)
- **SidebarUser**: menu do [Painel do Usuário](Módulos/Usuário/Menu.md)
- **SidebarAdmin**: menu do [Painel Administrador](Módulos/Administrador/Menu.md)
- O sistema exibe a sidebar correspondente ao painel ativo
- **Rodapé**: versão do sistema (inicia em `v1.0.0`)

### Comportamento responsivo
- **Desktop**: sidebar **fixa**, sempre visível
- **Mobile/Tablet**: sidebar vira **drawer** (abre/fecha)

## Layout Padrão (área de conteúdo)
- Fica entre o Navbar e a Sidebar
- Define as **medidas globais** (padding, margens, largura máxima)
- Todas as telas são renderizadas **dentro** desse layout
- O conteúdo fica dentro de um **card/container com borda visual**
- Componente Vue3 que recebe o conteúdo via `<router-view />`
- O **título da tela** é renderizado **dentro do card**, por cada tela individualmente

## Cores do Tema

| Token | Dark | Light |
|-------|------|-------|
| primary | `#0f172b` | `#ffffff` |
| background | `#1d293d` | `#f9fafb` |

## Botão Administrador (inspeção)
- Botão **flutuante** no **canto inferior direito** da tela
- Visível **apenas** quando o admin está em modo inspeção de tenant
- Ao clicar, volta para o Painel Administrador
