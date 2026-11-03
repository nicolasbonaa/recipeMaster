# Atividade 12 — Checklist

## Backend

- [x] `checkpoint-02.md` criado com leitura guiada e ADR-013.
- [x] `PAGINATION` criado em `config/constants.js`.
- [x] `utils/pagination.js` criado e usado nos dois controllers de feed.
- [x] Services usam as constantes de paginação.
- [x] Criação de receita e incremento do contador permanecem na mesma transação.
- [x] Bateria curl de regressão executada.

## Frontend

- [x] `src/config/constants.js` criado com chaves, limites, paginação e toasts.
- [x] `useToast` singleton e `ToastContainer` montado no `App.vue`.
- [x] Interceptor diferencia ações, leituras, `silent` e 401.
- [x] `useAsyncData`, `usePaginatedList` e `useAuthenticatedAction` criados.
- [x] Feed geral e feed filtrado usam `usePaginatedList`.
- [x] Telas de leitura principais usam `useAsyncData`.
- [x] Botões de curtir e seguir usam `useAuthenticatedAction`.
- [x] Limites de formulário centralizados nas constantes.
- [x] Prints obrigatórios gerados: toasts, login sem toast, paginação, uma requisição e curls individuais.
- [x] ZIP não criado, conforme solicitado.
