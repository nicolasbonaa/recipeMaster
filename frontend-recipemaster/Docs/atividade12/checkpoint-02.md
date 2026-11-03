# Atividade 12 — Checkpoint 2

## Leitura guiada

- Os feeds geral e filtrado usam `parsePagination`, com página padrão 1, limite padrão 12 e teto 50.
- A criação de receita já era transacional: `Recipe.create` e `User.increment` usam a mesma transação.
- A autenticação fica nos endpoints privados; leituras públicas usam `optionalAuth` quando necessário.
- Validações ficam nos validators de usuário, receita e comentário; ids de follow são convertidos no controller.
- O `errorHandler` centraliza erros de Services e validators em respostas HTTP consistentes.
- A regressão curl cobre perfil, feeds, follows, seguidores, seguindo, curtidas, comentários e meus itens.

## Evidências de código

- API: `backend-recipemaster/config/constants.js`, `utils/pagination.js`, `modules/recipe/recipeController.js`, `modules/follow/followController.js`.
- Frontend: `src/config/constants.js`, `src/composables/useAsyncData.js`, `usePaginatedList.js`, `useAuthenticatedAction.js`, `src/composables/useToast.js`, `src/components/ToastContainer.vue`.

## ADR-013

| O que é | Por que não foi resolvido hoje | Em qual aula será resolvido |
|---|---|---|
| Algumas telas administrativas ainda não usam os composables de leitura. | Elas são placeholders e não possuem fluxo real de dados para migrar sem inventar comportamento. | Atividade 13 — telas administrativas e cobertura do frontend |
