# product_images

Imagens dos produtos armazenadas no S3.

| Coluna     | Tipo      | Nullable | Descrição                                                          |
| ---------- | --------- | -------- | ------------------------------------------------------------------ |
| id         | integer   | Não      | PK (auto-increment)                                                |
| product_id | integer   | Não      | FK → [products](products.md)                                                  |
| url        | varchar   | Não      | URL da imagem no S3 (path: /company/images/products/)              |
| position   | integer   | Não      | Ordem de exibição. Posição 1 = imagem principal                    |
| created_at | timestamp | Não      | Data/hora de upload                                                |

**Regras:**
- Múltiplas imagens por produto
- A imagem com `position = 1` é a principal (exibida em listagens, PDFs, etc.)
- Formatos aceitos: PNG, JPG
- Ao excluir uma imagem, o arquivo é removido do S3 e o registro é excluído fisicamente
- Ao reordenar, as posições são recalculadas sequencialmente
