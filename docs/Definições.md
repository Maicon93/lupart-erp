# Definições Gerais

## Multi-Tenant
- O sistema é **multi-tenant**, onde cada empresa (company) é um tenant isolado
- `company_id` é o **tenant ID** — toda tabela de tenant possui essa coluna (NOT NULL)
- Tabelas globais como `access_plans` e `permissions` não possuem `company_id`
- Tabelas híbridas como `roles` e `users` possuem `company_id` nullable (null = global, preenchido = tenant)
- Todas as queries são filtradas por `company_id`, garantindo isolamento total entre empresas
- Dados **não são compartilhados** entre empresas/filiais

## Empresas e Filiais
- Existe uma tabela `companies` onde cada registro é uma empresa
- A coluna `matriz` armazena o **ID da company matriz** (auto-referência)
- Se `matriz = null` → é uma **Matriz**
- Se `matriz = <id>` → é uma **Filial** daquela Matriz
- Cada empresa (matriz ou filial) é um **tenant independente** com dados isolados

## Painéis
O sistema possui **dois ambientes separados**:
- **Painel Administrador**: acessado por admins. Contém o [Menu Administrador](Módulos/Administrador/Menu.md)
- **Painel do Usuário**: acessado por usuários de empresa. Contém o [Menu do Usuário](Módulos/Usuário/Menu.md)

## Roles
- `admin` → **Administrador**: usuário global, fora de qualquer tenant. Acessa o **Painel Administrador**
- `user` → **Usuário de empresa**: pertence a um ou mais tenants (companies). Acessa o **Painel do Usuário** conforme seus cargos e permissões
  - Um usuário pode ter **mais de uma empresa** vinculada
  - Um usuário pode ter **mais de um cargo** atrelado

## Inspeção de Tenant
- No Painel Administrador, a tela **Empresas** lista todas as empresas com um botão **Inspecionar**
- Ao clicar em Inspecionar, o `company_id` é setado no registro do usuário na tabela `users`
- O admin é **redirecionado para o Painel do Usuário** com os dados daquele tenant
- No Painel do Usuário, haverá um botão **"Administrador"** visível para voltar ao Painel Administrador

## Telas
- Todas as telas são numeradas (ver tabela em [Index](Index.md))
- Toda tela de usuário possui uma permissão específica para acesso
- A permissão é atrelada a um **cargo**, e o cargo é atribuído ao **usuário**

## Permissões
- Cada tela possui **uma permissão única** — o usuário tem acesso ou não
- A permissão é vinculada a um **cargo**, e o cargo é atribuído ao **usuário**
- Formato do nome da permissão: `{numero_tela}_{nome}` (ex: `01_dashboard`)
- Cada permissão possui:
  - `name`: identificador único (ex: `01_dashboard`)
  - `observation`: descrição explicativa de onde é usada

## Restrição de Tela
- Toda navegação de tela passa por uma verificação de permissão
- O sistema verifica se o **cargo do usuário** possui permissão para acessar a tela solicitada
- Se **não tiver permissão** → redireciona para `/`
- A rota `/` é o **Redirecionamento Inicial** — chama `GET /api/initial-route` e redireciona para a tela mais relevante conforme as permissões do usuário
- Se o usuário não possuir nenhuma permissão, é redirecionado para **Meu Perfil** (`/profile`)
- **Meu Perfil** é acessível a todos os usuários (sem permissão necessária) — evita loop infinito de redirecionamento

## Autenticação
- **JWT** com dois tokens:
  - **Access token**: curta duração, enviado no header `Authorization: Bearer`
    - Armazenado no **localStorage** do frontend
    - Incluído automaticamente pelo interceptor do axios
  - **Refresh token**: longa duração, enviado via **cookie HttpOnly** (seguro, não acessível por JS)
    - Armazenado no **banco de dados** (tabela `refresh_tokens`)
    - O cookie é gerenciado automaticamente pelo navegador (não manipulado por JS)
- Fluxo de renovação: quando o access token expira (401), o interceptor do axios faz a chamada de refresh automaticamente usando o cookie
- Detalhes técnicos: ver [API](Arquitetura/API.md) e [Axios](CodeBase/Axios.md)

## Layout
Ver [Layout](Layout.md)

## Tecnologia
Ver [Stack](Stack.md)

## Planos de Acesso
- Cada empresa possui um **plano de acesso** que define limites e cobrança
- Campos do plano:
  - **Nome** do plano
  - **Quantidade de usuários** permitidos
  - **Dias de vigência** (ciclo de faturamento)
  - **Valor da fatura** (R$)
- Planos iniciais (seed):
  - **Básico**: 30 dias, 2 usuários, R$ 130,00
  - **Enterprise**: 30 dias, 10 usuários, R$ 250,00

## Cadastro de Empresa
- O **admin** cria a empresa pelo **Painel Administrador**
- Não existe auto-cadastro (signup público)
- No cadastro da empresa, deve-se **vincular um usuário responsável**

## Armazenamento de Arquivos
- O sistema terá **upload de arquivos** (logo da empresa, imagens de produto, etc.)
- Armazenamento: **AWS S3**

## Paginação
- Padrão de **20 registros por página**
- Opções de quantidade: **20, 50, 100**

## Busca e Filtros
- Cada tela define seus próprios campos de busca e filtros
- Não há padrão global — será especificado no detalhamento de cada tela

## Impressão / PDF
- PDFs são gerados **no frontend** via **pdfmake**, usando os dados já carregados na tela
- Não há geração de PDF no backend

## Notificações
- O layout terá um **ícone de sino** na navbar (preparado para futuro)
- Inicialmente **sem notificações** — funcionalidade reservada para versão futura

## Exclusão e Inativação
- Registros nunca são excluídos fisicamente do banco de dados
- Duas abordagens conforme o tipo de entidade:
  - `status` (active/inactive) → entidades que podem ser reativadas (products, categories, payment_types)
  - `deleted_at` (timestamp) → entidades que o usuário "exclui" sem possibilidade de reativar (customers, suppliers, quotes)
- Detalhes em [API](Boas%20Práticas/API.md)

## Auditoria
- Todos os registros possuem `created_at` e `updated_at` (automáticos)
- `created_by` será usado apenas em situações específicas (definido no detalhamento de cada tela)

## Internacionalização (i18n)
- O sistema é **multilíngue**
- Código-fonte (variáveis, funções, tabelas, rotas, etc.) → **100% em inglês**
- Interface do usuário (labels, mensagens, textos) → **i18n** (traduzível)
- Línguas suportadas: **Português** (`pt-BR`) — padrão, **Inglês** (`en`)
- O idioma é armazenado diretamente na coluna `users.language` (varchar)
- No **cadastro do usuário**, informar:
  - **País** do usuário
  - **Língua** do sistema

### Convenção de chaves i18n
- Padrão: `modulo.contexto.CHAVE`
- Pastas/contextos em **minúsculo** (`products.errors.`, `common.actions.`)
- Chaves finais em **UPPER_SNAKE_CASE** (`NOT_ENOUGH_STOCK`, `SALE_COMPLETED`)
- Exemplos: `products.fields.NAME`, `products.errors.NOT_ENOUGH_STOCK`, `common.actions.SAVE`
- As chaves devem ser **exatamente iguais** na API e no frontend
- Na **API**: chave enviada via `messageCode`, com comentário em português descrevendo o significado
- No **frontend**: um arquivo por idioma (`pt-BR.json`, `en.json`), mesma estrutura de chaves em todos
- Chaves de uso global (botões, validações, status) ficam sob `common.*`
- Chaves específicas de módulo ficam sob `nome_do_modulo.*`

## Error Codes
- Existirá um arquivo de **ErrorCodes** com todos os códigos de erro da API
- Esse arquivo será **duplicado** no front e na API (mesma estrutura)
- Os códigos de erro são traduzidos via i18n no frontend

## Moeda e Formato
- Moeda padrão: **BRL (R$)**
- Formato de data: **DD/MM/AAAA**
- Separador decimal: vírgula (,)
- Separador de milhar: ponto (.)
