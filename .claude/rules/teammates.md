# Agent Teams

- Sugira o uso de teammates quando identificar trabalho genuinamente paralelo e independente (ex: dois módulos sem dependência entre si).
- Nunca crie teammates sem aprovação explícita do usuário.
- Não sugira teammates para CRUDs simples — o overhead de coordenação não compensa.
- Teammates fazem sentido quando o volume de trabalho por módulo é grande o suficiente para justificar a coordenação.
- Frontend depende da API — não separe API e frontend do mesmo módulo em teammates diferentes.
