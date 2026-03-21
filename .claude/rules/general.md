# general.md

- Código 100% em inglês (variáveis, funções, classes, arquivos, tabelas, rotas)
- Textos exibidos ao usuário sempre via **i18n**, nunca hardcoded
- Nomenclatura: `camelCase` para variáveis/funções, `PascalCase` para classes/componentes, `UPPER_SNAKE_CASE` para constantes
- Funções pequenas e com responsabilidade única
- Nomes descritivos para variáveis e funções — **nunca abreviar** (ex: `repository`, nunca `repo`; `button`, nunca `btn`)
- Nunca commitar `console.log`
- Multi-tenant: toda tabela de dados possui `company_id` — toda query filtra por `company_id`
- Chaves primárias: sempre `id` sequencial (auto-increment) — nunca UUID
- Soft delete: registros nunca são excluídos fisicamente — são inativados (campo `status`: Ativo/Inativo)
- Nunca usar `ON DELETE CASCADE` — validar vínculos antes de exclusão/inativação
- Tabelas com campo `active`: novos registros criados como `Ativo` por padrão
- ErrorCodes: arquivo duplicado no front e na API — códigos traduzidos via i18n no frontend
