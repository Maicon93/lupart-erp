# interfaces.md

## Localização

- Interfaces/types **compartilhados** (usados em mais de um arquivo) → pasta `interfaces/`, com prefixo **I**, exportados
- Interfaces/types **locais** (usados apenas no próprio arquivo) → ficam dentro do arquivo, **sem** `export`
- Antes de criar uma interface local, verificar se já existe uma compartilhada que atende (evitar duplicação)

## Nomenclatura

- Prefixo **I** + PascalCase (ex: `IUser`, `IApiResponse`, `IAddressFields`)
- Arquivos na pasta `interfaces/` seguem o nome da interface (ex: `IAddressFields.ts`, `ITokenPair.ts`)

## Interfaces compartilhadas existentes

| Interface | Descrição | Usada por |
|-----------|-----------|-----------|
| `IApiResponse` | Wrapper padrão de resposta da API | Controllers |
| `IAuthRequest` | Extensão do Express Request com dados de autenticação | Middlewares, Controllers |
| `IAddressFields` | Campos de endereço (zipCode, street, number, etc.) | CustomerService, SupplierService, CompanyService |
| `IPersonInput` | Input de pessoa física/jurídica (extends IAddressFields) | CustomerService, SupplierService |
| `IBasicEntityInput` | Input de entidade simples (name + observation) | CategoryService, PaymentTypeService |
| `ITokenPair` | Par de tokens (token + refreshToken) | AuthService |

## Regras

- Nunca retornar o model completo na resposta — usar interfaces para definir o que a API expõe
- Ao criar um novo módulo, verificar se as interfaces compartilhadas existentes atendem antes de criar novas
- Se duas interfaces locais forem idênticas ou muito similares, extrair para uma compartilhada em `interfaces/`
