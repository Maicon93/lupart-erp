# Logger

Helper centralizado de logging usando **Winston**. Toda a API usa este helper — nunca `console.log` diretamente.

## Níveis de Log

| Nível | Quando usar |
| --- | --- |
| `error` | Erros inesperados, falhas de banco, exceções não tratadas |
| `warn` | Situações anômalas que não impedem o fluxo (token expirado, tentativa de acesso negada) |
| `info` | Ações relevantes do sistema (login, criação de registro, operações de negócio) |
| `debug` | Detalhes técnicos para desenvolvimento (queries, payloads, fluxo interno) |

## Assinatura

```ts
logger.info(message, context?)
logger.error(message, context?)
logger.warn(message, context?)
logger.debug(message, context?)
```

- `message`: string descritiva do evento
- `context`: objeto livre com qualquer dado relevante (opcional)

O logger é **genérico** — não conhece `req`, `res` ou qualquer estrutura específica. Quem chama passa apenas os dados que já possui.

## Formato

Todos os logs são em **JSON estruturado** para facilitar parsing e busca:

```json
{
  "level": "info",
  "message": "Customer created",
  "timestamp": "2026-02-28T14:30:00.000Z",
  "customerId": 15
}
```

## Helper (`src/helpers/Logger.ts`)

```ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
})

export default logger
```

## Uso no código

```ts
import logger from '../helpers/Logger'

// No Service — passa só os dados que já tem
logger.info('Customer created', { customerId: customer.id })

logger.error('Failed to create customer', {
  error: err.message,
  stack: err.stack,
})

// No Controller — tem acesso ao req, pode passar mais contexto
logger.warn('Unauthorized access attempt', {
  userId: req.userId,
  enterpriseId: req.enterpriseId,
  route: req.originalUrl,
})
```

## Regras

- **Nunca** usar `console.log` — sempre `logger.info`, `logger.error`, etc.
- **Nunca** logar dados sensíveis (senhas, tokens, dados de cartão)
- Log de `error` e `warn` devem incluir contexto suficiente para debugging
- Em **produção**: nível `info` (sem debug)
- Em **desenvolvimento**: nível `debug` (tudo visível)
- O nível é controlado pela env `LOG_LEVEL`

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `LOG_LEVEL` | `info` | Nível mínimo de log (`error`, `warn`, `info`, `debug`) |
