## Titulo
- Título: 112 - Inventário
- Permissão: `112_inventory`
- Ambiente: Usuário
- Rota: `/stock/inventory`

## Objetivo
- Realizar contagem física do estoque e comparar com o estoque do sistema, permitindo gerar ajustes automáticos para corrigir divergências

## Corpo

#### Listagem de dados (inventários)

| Coluna        | Descrição                                |
| ------------- | ---------------------------------------- |
| Nº Inventário | Código sequencial do inventário          |
| Data          | Data de criação do inventário            |
| Escopo        | Todos os Produtos / Categoria específica |
| Qtd. Itens    | Quantidade de produtos no inventário     |
| Lidos         | Quantidade de itens já contados          |
| Divergências  | Quantidade de itens com diferença        |
| Status        | Em Andamento / Finalizado                |
| Responsável   | Nome do usuário que criou o inventário   |
| Ações         | Continuar / Detalhes                     |

- **Filtro**: nº inventário, status (em andamento / finalizado), período (data início / data fim)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Novo Inventário** — Botão no topo da tela → abre formulário de criação (desabilitado se já existe inventário Em Andamento)
- **Continuar** — Visível apenas se status = Em Andamento → abre o componente de contagem
- **Detalhes** — Visível apenas se status = Finalizado → abre o componente de detalhes (readonly)

#### Componente para criação

Componente separado (`InventoryForm.vue`)

| Campo      | Tipo     | Obrigatório | Observação                                          |
| ---------- | -------- | ----------- | --------------------------------------------------- |
| Escopo     | radio    | Sim         | Todos os Produtos / Por Categoria                   |
| Categoria  | select   | Condicional | Visível apenas se escopo = Por Categoria (tela 108) |
| Data       | date     | Sim         | Padrão: data atual                                  |
| Observação | textarea | Não         |                                                     |

- Ao criar, o sistema gera imediatamente a **lista fixa de itens** (snapshot) conforme o escopo selecionado, com o `Estoque Sistema` congelado naquele momento
- Apenas produtos do tipo **Produto** são incluídos (Serviço é ignorado)
- Produtos cadastrados após a criação do inventário **não entram** na lista — o snapshot é definitivo
- O inventário é criado com status **Em Andamento**

#### Componente de contagem (inventário ativo)

Componente separado (`InventoryCount.vue`)

**Cabeçalho:**
- Nº Inventário
- Data
- Escopo
- Observação (se informada)
- Responsável (nome do usuário)
- **Progresso**: "Lidos: X / Y" (X = itens contados, Y = total de itens)

**Busca:**
- Campo de busca no topo para encontrar item por **nome**, **código de barras** ou **código interno**

**Filtro de itens:**
- Todos — exibe todos os itens do inventário
- Faltantes — exibe apenas itens sem contagem (Contagem vazio)
- Lidos — exibe apenas itens já contados (Contagem preenchido)

**Grid de contagem (paginado, 10 itens por página):**

| Campo           | Tipo   | Obrigatório | Observação                                           |
| --------------- | ------ | ----------- | ---------------------------------------------------- |
| Produto         | text   | —           | Nome do produto (readonly)                           |
| Un. Medida      | text   | —           | Unidade de medida (readonly)                         |
| Estoque Sistema | number | —           | Quantidade congelada no momento da criação (readonly) |
| Contagem        | number | Não         | Quantidade encontrada na contagem física             |
| Diferença       | number | —           | Contagem − Estoque Sistema (readonly, calculado)     |
| Contado por     | text   | —           | Nome do usuário que registrou a contagem (readonly)  |

- Um item é considerado **Lido** quando o campo Contagem possui um valor preenchido
- O campo **Contagem** é editável enquanto o inventário estiver Em Andamento
- Background do campo **Diferença**: `success` se > 0, `danger` se < 0 (cores do [Theme Store](../../../CodeBase/Theme%20Store.md))
- Botão **Salvar Contagem** — salva os itens lidos da página atual (obrigatório antes de trocar de página)
- Botão **Finalizar Inventário** — confirm dialog antes de finalizar

#### Componente de detalhes (inventário finalizado)

Componente separado (`InventoryDetails.vue`) — todos os campos readonly

**Cabeçalho:**
- Nº Inventário
- Data
- Escopo
- Observação (se informada)
- Responsável (nome do usuário)
- **Progresso**: "Divergências: X / Y" (X = itens com diferença, Y = total de itens)

**Busca:**
- Campo de busca para encontrar item por **nome**, **código de barras** ou **código interno**

**Filtro de itens:**
- Todos — exibe todos os itens do inventário
- Com Divergência — exibe apenas itens onde Contagem ≠ Estoque Sistema
- Sem Divergência — exibe apenas itens onde Contagem = Estoque Sistema

**Lista de itens (paginada, 10 itens por página):**

| Coluna          | Descrição                                        |
| --------------- | ------------------------------------------------ |
| Produto         | Nome do produto                                  |
| Un. Medida      | Unidade de medida do produto                     |
| Estoque Sistema | Quantidade registrada no sistema na época         |
| Contagem        | Quantidade encontrada na contagem física         |
| Diferença       | Contagem − Estoque Sistema (calculado)           |
| Contado por     | Nome do usuário que registrou a contagem         |

- Coluna **Diferença**: texto em `success` se > 0, `danger` se < 0 (cores do [Theme Store](../../../CodeBase/Theme%20Store.md))
- Botão **Gerar Ajuste de Estoque** — visível apenas se houver divergências
- Botão **Ver Ajuste** — visível se o ajuste já foi gerado (link para detalhes do ajuste na tela 111)

## Regras específicas
- Somente **1 inventário ativo** (Em Andamento) por vez — botão Novo Inventário desabilitado se já existir um ativo
- O campo `created_by` salva o ID do usuário que criou o inventário
- Para cada item, salvar `counted_by` com o ID do usuário que registrou/atualizou a contagem
- **Contagem simultânea**: múltiplos usuários podem contar itens do mesmo inventário ao mesmo tempo — cada item salva individualmente via API
- **Congelamento de estoque**: ao criar o inventário, o `Estoque Sistema` de cada item é congelado (salvo no banco). Enquanto o inventário estiver Em Andamento, os produtos incluídos ficam **bloqueados para entrada e saída de estoque** (telas 110 e 111). A API deve rejeitar movimentações para produtos em inventário ativo
- Status **Em Andamento**: permite editar as quantidades contadas, acessível via botão **Continuar**
- Status **Finalizado**: inventário travado, apenas visualização via botão **Detalhes**. Produtos desbloqueados para movimentações
- Ao finalizar: todos os itens devem estar lidos (Contagem preenchida, >= 0)
- Grid paginado com **10 itens por página** — o usuário deve salvar a contagem antes de trocar de página
- O botão **Gerar Ajuste de Estoque** só aparece em inventários finalizados que possuem divergências
- Ao clicar em **Gerar Ajuste de Estoque**, o sistema cria automaticamente um ajuste (tela 111) com os itens divergentes, usando motivo: "Ajuste gerado pelo Inventário Nº {numero}"
- Para cada item do ajuste gerado, inserir um registro na tabela `product_movimentations` com `type = inventory` — ver [product_movimentations](../../../Database/product_movimentations.md)
- Após gerar o ajuste, o inventário salva a referência do ajuste gerado (`adjustment_id`)
- Se o ajuste já foi gerado, o botão muda para **Ver Ajuste** (link para detalhes do ajuste na tela 111)
- Apenas **um ajuste** pode ser gerado por inventário
- Apenas produtos do tipo **Produto** participam do inventário (Serviço é ignorado)
- **Validação (Zod)**: escopo obrigatório, data obrigatória, categoria obrigatória se escopo = Por Categoria
