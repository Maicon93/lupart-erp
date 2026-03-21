## Titulo
- Título: 109 - Tipos de Pagamento
- Permissão: `109_payment_types`
- Ambiente: Usuário
- Rota: `/payment-types`

## Objetivo
- Cadastro e gerenciamento dos tipos de pagamento aceitos pela empresa (ex: Pix, Cartão de Crédito)

## Corpo

#### Listagem de dados

| Coluna | Descrição                                 |
| ------ | ----------------------------------------- |
| Nome   | Nome do tipo de pagamento                 |
| Status | Checkbox readonly indicando ativo/inativo |
| Ações  | Detalhes                                  |

- **Filtro**: nome, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Novo Tipo de Pagamento** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Inativar/Ativar

#### Componente para criação e edição

Componente separado (`PaymentTypeForm.vue`)

| Campo      | Tipo     | Obrigatório | Observação |
| ---------- | -------- | ----------- | ---------- |
| Nome       | text     | Sim         |            |
| Observação | textarea | Não         |            |

## Regras específicas
- Nome do tipo de pagamento deve ser único dentro do tenant
- **Validação (Zod)**: nome obrigatório
- Botão "Salvar" com **spinner** enquanto processa

## Seed

| Nome              |
| ----------------- |
| Dinheiro          |
| PIX               |
| Cartão de Débito  |
| Cartão de Crédito |
| Boleto            |
