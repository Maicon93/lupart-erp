# styles.md

## Prioridade de uso

1. **Classes Quasar** — sempre que disponível (flex, grid, espaçamento, tipografia, cores, sombras)
2. **CSS customizado** — apenas para o que o Quasar não cobre (tamanhos fixos, max-width, border-radius customizado, variáveis de tema)
3. **Nunca usar Tailwind** — Quasar já cobre utilitários

## Classes Quasar mais usadas

### Layout
- `row`, `column` — direção flex
- `items-center`, `justify-between`, `justify-center` — alinhamento
- `q-gutter-xs|sm|md|lg|xl` — gap entre filhos
- `col-12`, `col-md-6`, `col-lg-4` — grid 12 colunas responsivo

### Espaçamento
- `q-pa-md`, `q-px-lg`, `q-mb-sm` — padding/margin (`p`/`m` + direção + tamanho)
- Direções: `a` (all), `x` (horizontal), `y` (vertical), `t`/`b`/`l`/`r`
- Tamanhos: `none`, `xs`, `sm`, `md`, `lg`, `xl`

### Tipografia
- `text-h1` a `text-h6`, `text-subtitle1`, `text-subtitle2`, `text-body1`, `text-body2`, `text-caption`
- `text-weight-bold`, `text-weight-medium`
- `text-center`, `text-right`
- `text-primary`, `text-negative`, `text-grey`

### Cores
- `bg-primary`, `bg-dark`, `bg-grey-3` — fundos
- `text-white`, `text-primary` — textos

### Display e outros
- `window-height` — min-height: 100vh
- `full-width` — width: 100%
- `shadow-1` a `shadow-24` — sombras
- `rounded-borders` — border-radius 4px
- `no-border`, `no-shadow`

## Variáveis de tema (CSS custom properties)

Definidas em `src/styles/theme.css`. Usar sempre que a cor depende do tema (light/dark):

### Light Mode (`:root`)
- `--bg-page: #f8f8f8` — fundo da página
- `--bg-card: #ffffff` — fundo dos cards
- `--bg-header: #ffffff` — fundo do header
- `--bg-sidebar: #ffffff` — fundo da sidebar
- `--border-color: #e8e8e8` — bordas
- `--text-primary: #2c2c2c` — texto principal
- `--text-secondary: #888888` — texto secundário

### Dark Mode (`.dark-mode`)
- `--bg-page: #1a1a1a`
- `--bg-card: #242424`
- `--bg-header: #141414`
- `--bg-sidebar: #141414`
- `--border-color: #333333`
- `--text-primary: #e0e0e0`
- `--text-secondary: #888888`

## Quando usar CSS customizado

- Tamanhos fixos em pixels (`width: 72px`, `height: 48px`)
- `max-width` + `margin: 0 auto` (centralizar container)
- `border-radius: 50%` (círculos)
- `border-radius` diferente de 4px
- `transition` e animações
- Variáveis de tema (`var(--bg-page)`, `var(--text-primary)`)
- `border-bottom`, `border-left` (Quasar só tem `no-border`)

## Convenção de nomes CSS

- **BEM** para classes customizadas: `.bloco__elemento--modificador`
- Exemplo: `.test-card__header`, `.color-swatch__circle`
- Classes scoped no componente (`<style scoped>`)

## Dark Mode

- Classe `.dark-mode` aplicada no elemento raiz do layout
- As variáveis CSS se alternam automaticamente
- Componentes Quasar usam `$q.dark.set(value)` para reagir ao tema
- Cores de tema Quasar (`primary`, `secondary`, etc.) são as mesmas nos dois modos
