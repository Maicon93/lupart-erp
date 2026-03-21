# Boas Práticas — Frontend

## Linguagem
- Código 100% em inglês (variáveis, funções, componentes, arquivos)
- Textos exibidos ao usuário sempre via i18n, nunca hardcoded

## Nomenclatura

| Contexto | Formato | Exemplo |
| --- | --- | --- |
| Componentes Vue | PascalCase | `SidebarUser.vue`, `ConfirmDialog.vue` |
| Arquivos JS (services, helpers) | PascalCase | `CustomerService.js`, `ErrorCodes.js` |
| Variáveis | camelCase | `productList`, `isLoading` |
| Funções | camelCase | `getProducts`, `handleSubmit` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Rotas/URLs | kebab-case | `/dashboard`, `/stock-entry` |

## Componentes
- Usar **Options API**:
```js
export default {
  data() { ... },
  computed: { ... },
  watch: { ... },
  methods: { ... },
  
}
```
- Nomenclatura PascalCase para componentes (ex: `SidebarUser.vue`)
- Um componente por arquivo
- Props e emits sempre declarados explicitamente
- **Globais** (reutilizáveis em mais de um local) → pasta `src/components/`
  - Ex: `FullScreenLoading.vue`, `PdfViewer.vue`, `ConfirmDialog.vue`
- **Específicos de feature** → pasta `src/views/<modulo>/components/`
  - Ex: `ProductFormModal.vue` fica em `views/cadastros/components/`

## Estrutura de Views
- Cada módulo fica em sua pasta dentro de `views/`
- Componentes específicos da feature ficam em `views/<modulo>/components/`

## Validação
- Usar **Zod** para validação de dados nos formulários
- **SEMPRE** validar antes de enviar para a API
- Schemas ficam na pasta `src/schemas/` (ex: `CustomerSchema.js`)
- Um schema por entidade
- A validação é feita via helper que recebe o **objeto** e o **schema** como parâmetros
- Erros de validação são exibidos **inline** nos campos do formulário

## Services (Camada HTTP)
- **SEMPRE** abstrair requisições HTTP em services — **NUNCA** fazer chamada HTTP direto da view
- Um service por entidade (ex: `CustomerService.js`)
- Todos usam a instância centralizada do axios
- Tratar erros usando os ErrorCodes
- Fluxo: `View → Service → axios → API`

## Stores (Pinia)
- Usar Pinia **apenas para o necessário** — não exagerar
- Stores previstas: `auth`, `enterprise`, `theme`
- Não usar store para estado local de tela — usar refs/reactive
- Cache de dados fica na **API**, não no frontend

## Rotas
- Nomes de rota em inglês e kebab-case (ex: `stock-entry`)
- Toda rota protegida passa pelo guard de permissão
- Lazy loading em todas as views (`() => import(...)`)

## Permissões
- A validação de permissão é feita via **requisição HTTP** no `beforeEach` do Vue Router
- A cada navegação de página, o router faz uma chamada à API para verificar se o usuário tem permissão
- Isso garante que a permissão está **sempre atualizada** e **não pode ser burlada** no frontend
- Se a API retornar sem permissão, o router redireciona para uma página de acesso negado

## Lazy Loading e Loading States
- **Listagens**: sempre exibir **skeleton/placeholder** enquanto os dados estão carregando (lazy loading indicativo)
- **Botões e ações pesadas**: sempre exibir **spinner (loading)** no botão ao clicar, enquanto a operação estiver em andamento

## Tratamento de Erros
- Mensagens de erro/sucesso/info/warning vêm **sempre da API** via `IApiResponse`
- O interceptor do axios captura a resposta e exibe o **toast** automaticamente
- **Nunca** tratar erros manualmente nos services/views se o interceptor já cobre
- Validação Zod no frontend é a primeira barreira — erros inline nos campos antes de chamar a API

## Estilo
- Usar classes e componentes do Quasar como padrão
- Evitar CSS inline
- Variáveis de tema centralizadas (cores, espaçamentos)

## Geral
- Não commitar `console.log` — remover antes do commit
- Não usar `any` implícito (mesmo sendo JS, manter clareza nos dados)
- Funções pequenas e com responsabilidade única
- Nomes descritivos para variáveis e funções
