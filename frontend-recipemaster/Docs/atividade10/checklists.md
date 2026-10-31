# Atividade 10 - Checklist

## Backend

- [x] `COMMENT_MAX`, `likesCount` e `commentsCount` adicionados.
- [x] Models `Like` e `Comment` criados.
- [x] Índice único composto em `Like`.
- [x] Associações nos dois sentidos.
- [x] Tabelas e colunas sincronizadas no banco.
- [x] Módulo de curtidas com toggle, status e itens curtidos.
- [x] Módulo de comentários com criação e listagem.
- [x] Validador de comentários com `trim()` antes de `notEmpty()`.
- [x] Escritas de linha e contador dentro de transações.
- [x] Detalhe retorna `isLiked` e contadores.
- [x] Exclusão limpa curtidas e comentários em transação.
- [x] Contadores aparecem nos itens do perfil público.

## Testes de API

- [x] Curtida sem token retorna `401`.
- [x] Curtida em receita inexistente retorna `404`.
- [x] Alternância B: `201`, `200`, `201`, com contadores `1`, `0`, `1`.
- [x] Curtida de A eleva o contador para `2`.
- [x] `like-status` funciona com e sem token.
- [x] Detalhe retorna `isLiked`.
- [x] Lista de itens curtidos retorna autor e receitas.
- [x] Comentário sem token retorna `401`.
- [x] Comentário só com espaços retorna `400`.
- [x] Comentário com 501 caracteres retorna `400`.
- [x] Comentário em receita inexistente retorna `404`.
- [x] Comentário válido retorna `201`, texto aparado e autor.
- [x] Listagem pública de comentários retorna os mais novos primeiro.
- [x] Exclusão remove receita, curtidas e comentários.
- [ ] Regressão completa de upload, detalhe, feed, edição e perfil validada manualmente.

## Frontend

- [x] Services de curtidas e comentários criados.
- [x] Formatador criado em `src/utils/format.js`.
- [x] `LikeButton` com atualização otimista, rollback e `isBusy`.
- [x] Visitante é enviado ao login com retorno ao detalhe.
- [x] `CommentSection` possui estados de carregamento, erro e vazio.
- [x] Formulário de comentário valida vazio, espaços e limite de 500 caracteres.
- [x] Comentário novo aparece no topo sem recarregar a lista.
- [x] Texto usa interpolação segura e preserva quebras de linha.
- [x] Detalhe exibe curtidas e comentários.
- [x] Contadores aparecem nos cards.
- [x] Tela de itens curtidos possui rota e link na Sidebar.
- [x] Build de produção concluído.

## Evidências visuais pendentes

- [x] `detalhe-interacao.jpg`
- [x] `otimista.jpg`
- [x] `rollback.jpg`
- [x] `curtidos.jpg`
- [ ] `unique.jpg`
- [ ] Prints individuais dos curls da Parte A, Etapa 4.
