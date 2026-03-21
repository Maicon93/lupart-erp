# seedCompanyData

Helper executado ao criar uma nova empresa (tela 12). Recebe `company_id` como parâmetro e cria os registros iniciais necessários para o funcionamento do sistema.

## Assinatura

```typescript
seedCompanyData(companyId: number): Promise<void>
```

## Registros criados

| Tabela                | Registros                                                          |
| --------------------- | ------------------------------------------------------------------ |
| [company_settings](../../Database/company_settings.md)  | `allow_negative_stock = false`                                     |
| [company_profiles](../../Database/company_profiles.md)  | Dados de endereço informados no formulário de criação da empresa   |
| [payment_types](../../Database/payment_types.md)     | Dinheiro, PIX, Cartão de Débito, Cartão de Crédito, Boleto        |
| [measurement_units](../../Database/measurement_units.md) | Kg (Quilo), Un (Unidade), L (Litro), Serviço (Serviço)            |
| [categories](../../Database/categories.md)        | Outros (Categoria para produtos diversos ainda sem classificação)  |
| [customers](../../Database/customers.md)         | Consumidor Final (CPF 000.000.000-00, Telefone (99) 99999-9999)   |

## Regras
- Executado dentro da mesma transação de criação da empresa — se falhar, a empresa não é criada
- Chamado pela API ao confirmar o cadastro de empresa na tela 12
- Todos os registros são vinculados ao `company_id` recebido

## Chamado por
- [Empresas](../../Módulos/Administrador/Empresas.md) (tela 12) — ao criar nova empresa
