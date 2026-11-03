# Atividade 11 - Checklist

## Checagem de Alcançabilidade (ADR-012)

- [x] **Seguir / deixar de seguir**: Botão no perfil público de outra pessoa (`/perfil/:username`); visitante é redirecionado ao login e retorna ao perfil após autenticar.
- [x] **Listas de seguidores/seguindo**: Contadores de "Seguidores" e "Seguindo" no perfil público e no próprio perfil funcionam como links clicáveis para `/perfil/:username/seguidores` e `/perfil/:username/seguindo`; abas permitem alternar entre as duas listas sem recarregar; botão de retorno para o perfil.
- [x] **Feed filtrado**: Acessível diretamente pelo item "Seguindo" da `TheSidebar` (`/seguindo`), com rota protegida (`requiresAuth: true`), paginação "Carregar mais" e estado vazio amigável com link para o Feed geral.
- [x] **Consistência Sidebar / Router**: Verificado que o item "Seguindo" em `TheSidebar.vue` aponta para `/seguindo` e possui rota correspondente mapeada em `router/index.js` para `FollowingFeedView.vue`.

---

## Backend (API)

### Etapa 1 — Model Follow e Associações
- [x] `followModel.js` criado com `followerId` e `followingId` referenciando `users`.
- [x] Índice único composto `['follower_id', 'following_id']` criado.
- [x] Índice simples `['following_id']` criado.
- [x] Associações com apelidos `Follow.belongsTo(User, { as: 'Follower', foreignKey: 'followerId' })` e `Follow.belongsTo(User, { as: 'Following', foreignKey: 'followingId' })` registradas em `config/associations.js`.
- [x] Tabela `follows` sincronizada e índices validados no banco de dados.

### Etapa 2 — Service, Controller e Rotas
- [x] Três arquivos do módulo criados (`followService.js`, `followController.js`, `followRoutes.js`) e registrados em `app.js`.
- [x] `parseUserId` implementado convertendo o parâmetro em número na borda e retornando `400` para valores inválidos.
- [x] Validação impedindo seguir a si mesmo com retorno `400`.
- [x] Validação de usuário inexistente com retorno `404`.
- [x] Três escritas atômicas em uma só transação (inserção/remoção em `follows`, incremento/decremento de `followersCount` no alvo e de `followingCount` no autor).
- [x] `toggle-follow` retornando `201` ao seguir e `200` ao deixar de seguir com dados atualizados `{ isFollowing, followersCount }`.
- [x] Endpoints `GET /api/users/:userId/followers` e `GET /api/users/:userId/following` públicos, sem expor hash de senha.

### Etapa 3 — Feed Filtrado e isFollowing no Perfil
- [x] Método `getFollowingRecipes` implementado com busca de IDs seguidos e `Op.in` paginado.
- [x] Retorno imediato de `[]` quando o usuário não segue ninguém.
- [x] `userController.getPublicProfile` retorna booleano `isFollowing` real para usuários autenticados.

### Etapa 4 — Bateria de Testes da API (curl)
- [x] Teste 1: Erros do `toggle-follow` (401 sem token, 400 id inválido, 400 seguir a si mesmo, 404 usuário inexistente).
- [x] Teste 2: Alternância de seguir/deixar de seguir (201, 200, 201) com contadores consistentes.
- [x] Teste 3: Contadores de seguidores e seguindo corretos de ambos os lados.
- [x] Teste 4: `follow-status` e `isFollowing` no perfil (visitante, outro usuário e dono).
- [x] Teste 5: Listas públicas de seguidores e seguindo (ordenação decrescente, sem senha).
- [x] Teste 6: Feed filtrado `/api/following-recipes` com paginação e retorno vazio para quem não segue ninguém.
- [x] Teste 7: Tentativa de inserção duplicada no banco recusada pelo índice único (`Error 1062`).
- [x] Teste 8: Regressão de rotas existentes (`/api/feed`, receitas, etc.) funcionando normalmente.

---

## Frontend

### Etapa 1 — Service
- [x] `followService.js` criado com `toggleFollow`, `getFollowers`, `getFollowing` e `getFollowingRecipes`.

### Etapa 2 — Componente FollowButton
- [x] Componente `FollowButton.vue` criado utilizando `defineModel` (`following` e `followersCount`).
- [x] Atualização otimista em 3 etapas com rollback em caso de falha.
- [x] Bloqueio durante requisição com flag `isBusy`.
- [x] Redirecionamento de visitante para tela de login com query `redirect` para retornar ao perfil.
- [x] Evitada leitura de `following.value` logo após atribuição usando variável local (`nowFollowing`).

### Etapa 3 — Perfil Público Ativo
- [x] `FollowButton` integrado ao perfil público com `v-model:following` e `v-model:followers-count`.
- [x] Botão oculto para o próprio dono do perfil.
- [x] Contadores de "Seguidores" e "Seguindo" transformados em links de navegação para as listas.

### Etapa 4 — Telas de Listas e Feed Filtrado
- [x] `FollowListView.vue` implementada reutilizando a mesma tela para as rotas `/perfil/:id/seguidores` e `/perfil/:id/seguindo` via `props: { kind }`.
- [x] Abas funcionais alternando entre seguidores e seguindo sem recarregar a página.
- [x] Estados de carregamento, erro e vazio amigável com indicação do usuário.
- [x] `FollowingFeedView.vue` implementada com paginação ("Carregar mais"), estado vazio com link para o feed e checagem ADR-012.
- [x] Rotas registradas no `router/index.js` e link ativo na `TheSidebar.vue`.

### Etapa 5 — Teste Prático e Evidências
- [x] Comportamento de visitante verificado com redirecionamento de login.
- [x] Atualização otimista testada com Slow 4G e rollback testado com Offline no DevTools.
- [x] Feed filtrado testado exibindo apenas publicações de contas seguidas.
