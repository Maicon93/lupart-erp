# testing.md

## Quando testar

- Ao finalizar um service da API que contenha lógica de negócio ou cálculos
- Ao modificar lógica existente em services já testados
- Nunca testar CRUDs simples, controllers ou frontend

## Como testar

- **Unitários**: service isolado com repository mockado. Testar cálculos, validações e regras de negócio
- **Integração**: service com banco PostgreSQL real (banco de teste). Testar fluxos multi-tabela e isolamento multi-tenant
- Stack: Vitest
- Arquivos de teste ao lado do service: `NomeDoService.test.ts`

## O que testar

Consultar `docs/Boas Práticas/API.md` seção "Testes" para a lista detalhada de cenários por módulo.

## Regra geral

- Se o service só faz CRUD sem lógica → sem teste
- Se o service tem cálculo, regra de negócio ou fluxo multi-tabela → teste obrigatório
