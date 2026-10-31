# Atividade Pratica - Aula 08

Projeto Grupo B: receita com arquivo unico de imagem. Streaming, player e Range nao se aplicam.

## Parte A - Backend

- [x] `middlewares/optionalAuth.js` criado.
- [x] `GET /api/recipes/:id` publico com `optionalAuth`.
- [x] Detalhe popula o autor com `include` sem o campo `password`.
- [x] Contagem `views` adicionada e incrementada a cada detalhe.
- [x] Campo `isOwner` calculado a partir do token opcional.
- [x] `GET /api/feed` protegido por autenticacao.
- [x] Feed paginado por `page` e `limit`, usando `offset = (page - 1) * limit`.
- [x] Imagens continuam acessiveis por `/uploads/recipes/...` sem token.
- [ ] Prints dos curls da Parte A: executar com o MySQL e uma receita reais.

## Parte B - Frontend

- [x] URL de imagem adicionada em `src/utils/media.js`.
- [x] Componente reutilizavel `src/components/RecipeCard.vue` criado.
- [x] `getRecipeById` e `getFeed` adicionados ao `recipeService.js`.
- [x] Feed exibe receitas reais em grade.
- [x] Botao `Carregar mais` pagina o feed.
- [x] Detalhe exibe a imagem em resolucao real.
- [x] `isOwner` recebido da API e guardado no estado da tela.
- [x] Rota do detalhe permite acesso publico.

## Evidencias

Adicionar nesta pasta, apos executar o projeto com dados reais:

- `feed-real.jpg`
- `detalhe-real.jpg`
- `curl-detalhe-sem-token.jpg`
- `curl-detalhe-com-token.jpg`
- `curl-detalhe-404.jpg`
- `curl-feed-sem-token.jpg`
- `curl-feed-page-1.jpg`
- `curl-feed-page-2.jpg`

Nao ha `range-206.jpg` porque este projeto e Grupo B e nao possui streaming.
