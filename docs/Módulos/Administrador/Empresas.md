## Titulo
- Título: 12 - Empresas
- Permissão: `12_companies`
- Ambiente: Administrador
- Rota: `/admin/companies`

## Objetivo
- Listagem e gerenciamento de todas as empresas (matrizes e filiais) do sistema

## Corpo

#### Listagem de dados

| Coluna      | Descrição                 |
| ----------- | ------------------------- |
| Nome        | Nome da empresa           |
| CNPJ        | CNPJ formatado            |
| Plano       | Plano de acesso vinculado |
| Responsável | Usuário responsável       |
| Status      | Ativo / Inativo           |
| Ações       | Detalhes, Inspecionar     |

- **Filtro**: nome, CNPJ, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Nova Empresa** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Inativar/Ativar e listagem de filiais vinculadas
- **Inspecionar** — Seta `company_id` no usuário e redireciona para o Painel do Usuário

#### Componente para criação

Componente separado (`CompanyForm.vue`)

| Campo               | Tipo        | Obrigatório | Observação                                    |
| ------------------- | ----------- | ----------- | --------------------------------------------- |
| Nome                | text        | Sim         |                                               |
| CNPJ                | text (mask) | Sim         | Validação de CNPJ                             |
| Telefone            | text (mask) | Não         |                                               |
| E-mail              | text        | Não         |                                               |
| CEP                 | text (mask) | Não         | Busca ViaCEP — preenche endereço automaticamente |
| Endereço            | text        | Sim         | Preenchido pelo ViaCEP, editável              |
| Número              | text        | Sim         |                                               |
| Complemento         | text        | Sim         |                                               |
| Bairro              | text        | Sim         | Preenchido pelo ViaCEP, editável              |
| Cidade              | text        | Não         | Preenchido pelo ViaCEP, editável              |
| Estado              | text        | Não         | Preenchido pelo ViaCEP, editável              |
| Plano de acesso     | select      | Sim         | Lista de planos cadastrados                   |
| Usuário responsável | select      | Sim         | Vincula um usuário à empresa                  |
| Matriz              | select      | Não         | Se preenchido → é filial. Se vazio → é matriz. Hint persistente: "Deixe vazio para cadastrar como matriz" |

#### Componente para detalhes

Componente separado (`CompanyDetails.vue`)

- Exibe todos os dados da empresa com opção de edição
- Ação **Inativar/Ativar** — Confirm dialog antes de alterar o status
- Listagem de **filiais vinculadas** à empresa (quando for matriz)

## Regras específicas
- **Validação (Zod)**: CNPJ válido, nome obrigatório, endereço obrigatório (rua, número, complemento, bairro), plano obrigatório, usuário responsável obrigatório
- Botão "Salvar" com **spinner** enquanto processa
- Ao criar uma empresa, executar o helper `seedCompanyData(company_id)` que cria automaticamente:
	- [company_settings](../../Database/company_settings.md) com valores padrão
	- [company_profiles](../../Database/company_profiles.md) com dados de endereço informados no formulário
	- [payment_types](../../Database/payment_types.md): Dinheiro, PIX, Cartão de Débito, Cartão de Crédito, Boleto
	- [measurement_units](../../Database/measurement_units.md): Kg, Un, L, Serviço
	- [categories](../../Database/categories.md): Outros
	- [customers](../../Database/customers.md): Consumidor Final (CPF 000.000.000-00)
