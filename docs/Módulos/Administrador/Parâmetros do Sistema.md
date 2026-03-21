## Titulo
- Título: 15 - Parâmetros do Sistema
- Permissão: `15_system_parameters`
- Ambiente: Administrador
- Rota: `/admin/system-parameters`

## Objetivo
- Configurações globais do sistema gerenciadas pelo administrador

## Corpo

#### Tokens

Configuração de duração dos tokens JWT.

| Campo                          | Tipo   | Obrigatório | Observação       |
| ------------------------------ | ------ | ----------- | ---------------- |
| Duração do access token (min)  | number | Sim         | Em minutos       |
| Duração do refresh token (dias)| number | Sim         | Em dias          |

#### Upload

Configuração de limites para upload de arquivos (AWS S3).

| Campo                        | Tipo   | Obrigatório | Observação |
| ---------------------------- | ------ | ----------- | ---------- |
| Tamanho máximo de upload (MB)| number | Sim         | Em MB      |

## Regras específicas
- Dados armazenados na tabela `system_configurations` no formato **chave/valor**
- Cada seção é salva independentemente com botão "Salvar" e **spinner**
- **Validação (Zod)**: valores numéricos positivos
- Alterações nos tokens só afetam novos logins (tokens existentes mantêm a duração original)

## Seed

| Chave                  | Valor padrão |
| ---------------------- | ------------ |
| access_token_duration  | 15           |
| refresh_token_duration | 7            |
| max_upload_size        | 5            |

