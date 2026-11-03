# Atividade 12 — Checkpoint 2

## Leitura guiada

1. **Paginação:** havia números soltos nos controllers dos feeds geral e filtrado. A correção centraliza `DEFAULT_PAGE`, `DEFAULT_LIMIT` e `MAX_LIMIT` em [`config/constants.js`](./config/constants.js), interpreta valores inválidos em [`utils/pagination.js`](./utils/pagination.js) e usa o resultado em `recipeController.getFeed` e `followController.followingRecipes`.
2. **Transações:** a criação de receita já usa `sequelize.transaction`, incluindo `Recipe.create` e `User.increment` com a mesma transação em [`modules/recipe/recipeService.js`](./modules/recipe/recipeService.js).
3. **Erros:** os Services lançam erros com `statusCode`, enquanto o `errorHandler` transforma o erro em resposta HTTP. Os validators também usam o mesmo padrão para devolver `400`.
4. **Rotas protegidas:** feeds, criação/edição/exclusão, curtidas e follows usam `authenticate`; perfil público, detalhe e status de curtida usam `optionalAuth` quando a leitura aceita visitante.
5. **Validação:** parâmetros de follow são convertidos na borda por `parseUserId`; campos de receita, usuário e comentário têm validators próprios.
6. **Regressão:** a bateria real de curl cobre perfil, feed geral, feed filtrado, follow, listas, curtidas, comentários e meus itens.

## Perguntas extras

1. O padrão `new Error/statusCode/throw` aparece principalmente em `recipeService.js`, `likeService.js`, `commentService.js`, `followService.js` e `userService.js`; o `errorHandler` centraliza a resposta.
2. Além da paginação, o limite de upload aparece na configuração dos middlewares Multer. Ele é específico de arquivo e não deve ser misturado com limites de listagem.
3. Os ids inválidos de follow retornam `400` em `toggle-follow`, `follow-status` e nas listas; ids numéricos inexistentes retornam `404` pelo Service.

## ADR-013 — pendência própria

| O que é | Por que não foi resolvido hoje | Em qual aula será resolvido |
|---|---|---|
| Algumas telas antigas ainda repetem `try/catch/finally` localmente em vez de usar os composables desta atividade. | A migração incremental preserva o comportamento e reduz o risco de alterar fluxos de formulário durante o checkpoint. | Atividade 13 — refatoração e cobertura do frontend |
