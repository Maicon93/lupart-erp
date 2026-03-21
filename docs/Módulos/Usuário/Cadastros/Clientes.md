## Titulo
- Título: 105 - Clientes
- Permissão: `105_customers`
- Ambiente: Usuário
- Rota: `/customers`

## Objetivo
- Cadastro e gerenciamento de clientes da empresa

## Corpo

#### Listagem de dados

| Coluna   | Descrição                                 |
| -------- | ----------------------------------------- |
| Nome     | Nome do cliente                           |
| CPF/CNPJ | Documento formatado                       |
| Contato  | Telefone principal                        |
| E-mail   | E-mail do cliente                         |
| Ações    | Detalhes, Excluir                         |

- **Filtro**: nome, CPF/CNPJ
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Novo Cliente** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição
- **Excluir** — Confirm dialog → soft delete (`deleted_at`). Não permite excluir se houver vínculos ativos (vendas, orçamentos, OS, títulos financeiros) — exibe mensagem informando o motivo

#### Componente para criação e edição

Componente separado (`CustomerForm.vue`)

| Campo       | Tipo        | Obrigatório | Observação                                    |
| ----------- | ----------- | ----------- | --------------------------------------------- |
| Nome        | text        | Sim         |                                               |
| CPF/CNPJ    | text (mask) | Sim         | Usar [maskCpfCnpj](../../../CodeBase/maskCpfCnpj.md)                 |
| Contato     | text (mask) | Sim         | Usar [maskContact](../../../CodeBase/maskContact.md)                 |
| E-mail      | text        | Não         | Validação de e-mail                           |
| CEP         | text (mask) | Não         | Busca automática de endereço via API (ViaCEP) |
| Endereço    | text        | Não         | Preenchido automaticamente pelo CEP           |
| Número      | text        | Não         |                                               |
| Complemento | text        | Não         |                                               |
| Bairro      | text        | Não         | Preenchido automaticamente pelo CEP           |
| Cidade      | text        | Não         | Preenchido automaticamente pelo CEP           |
| Estado      | text        | Não         | Preenchido automaticamente pelo CEP           |
| Observações | textarea    | Não         | Anotações livres sobre o cliente              |

## Regras específicas
- CPF/CNPJ deve ser único dentro do tenant (não permitir duplicata na mesma empresa)
- Máscara do CPF/CNPJ ajusta automaticamente conforme o tamanho da entrada (11 dígitos → CPF, 14 dígitos → CNPJ)
- CEP busca endereço automaticamente via ViaCEP — usuário pode editar os campos retornados
- Exclusão via soft delete (`deleted_at`) — cliente não é removido fisicamente
- Não permite excluir se houver vínculos ativos (vendas, orçamentos, OS, títulos financeiros)
- **Validação (Zod)**: CPF ou CNPJ válido, e-mail válido (se preenchido), telefone válido
- Botão "Salvar" com **spinner** enquanto processa

## Seed

| Nome             | CPF/CNPJ       | Contato         | Observações    |
| ---------------- | -------------- | --------------- | -------------- |
| Consumidor Final | 000.000.000-00 | (99) 99999-9999 | Cliente padrão |
