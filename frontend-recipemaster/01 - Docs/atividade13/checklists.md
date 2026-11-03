# Atividade 13 — Checklists

## Ficha (Seção 2)

| Nome | Shortz-App | Recipe Master |
| --- | --- | --- |
| Coleção do usuário | `Playlist` | `Collection` (tabela `collections`) |
| Model da junção | `PlaylistVideo` (`playlist_videos`) | `CollectionRecipe` (`collection_recipes`) |
| Contador de itens | `videosCount` | `recipesCount` |
| Rotas | `/api/my-playlists`, `/api/playlists` | `/api/my-collections`, `/api/collections` |
| Rota do status | `/api/videos/:videoId/playlists-status` | `/api/recipes/:id/collections-status` |
| Campo de texto da busca | `title` | `title` (receita) + `username` / `fullName` |
| Campo `hasVideo` | `hasVideo` | `hasRecipe` |
| Telas | `MyPlaylistsView`, `PlaylistDetailView` | `MyCollectionsView`, `CollectionDetailView` |

## Parte A — Backend

### Etapa 1 — Constantes, `parseId` e `followController`
- [x] Constantes de validação (`COLLECTION_TITLE_MIN/MAX`, `COLLECTION_DESCRIPTION_MAX`) e bloco `SEARCH` criados
- [x] `utils/parseId.js` criado e usado pelo `followController` (sem a função antiga) e pelo módulo de coleções

### Etapa 2 — Models e associações
- [x] `Collection` e `CollectionRecipe` + seis associações em `config/associations.js`
- [x] Tabelas, índices (`idx_collections_user_id`, `idx_unique_collection_recipe`, `idx_collection_recipes_recipe_id`) e FKs `ON DELETE CASCADE` conferidos no banco (`colecoes-banco.jpg`)

### Etapa 3 — Validator, Service, Controller e Rotas
- [x] Quatro arquivos do módulo `modules/collection`, registrados no `app.js` antes do 404 e do `errorHandler`
- [x] Duas escritas (linha + contador) numa só transação ao adicionar, remover e excluir
- [x] 403 para privada de outra pessoa; `isOwner` correto para dona, outra pessoa e visitante (`currentUserId !== null` primeiro)

### Etapa 4 — Busca de verdade
- [x] Busca no banco com `escapeLike`, `Promise.all` e entrada tratada (`typeof`, `trim`, mínimo e máximo)
- [x] Controller `async`/`await` e rota com `asyncHandler`

### Etapa 5 — Exclusão da receita limpa as coleções
- [x] Exclusão desconta o contador de cada coleção e apaga a junção, na mesma transação
- [x] Teste de controle feito e descrito (resposta 3; `contador-controle.jpg` e `contador-certo.jpg`)

### Etapa 6 — Testes
- [x] Bateria `backend-recipemaster/scripts/teste-aula-13.ps1` executada; um print por curl (`curl-teste1.jpg` … `curl-teste25.jpg`, ver `curl-parte-a.md`)

## Parte B — Frontend

### Seção 9 — Alcançabilidade (respondida antes de programar)

| Peça | Caminho de clique |
| --- | --- |
| Minhas Coleções | item "Minhas Coleções" no menu do avatar (novo) e item "Minhas coleções" da Sidebar |
| Criar / excluir coleção | botão "Nova coleção" (modal) e botão "Excluir" no cartão (confirmação) |
| Detalhe da coleção | clique no cartão, na lista |
| Salvar uma receita | botão "Salvar" no detalhe da receita (visitante → login → volta à receita) |
| Remover receita da coleção | botão "Remover da coleção" em cada card do detalhe (só para a dona) |
| Busca | barra da Navbar (Enter ou lupa) e item "Explorar" da Sidebar |

- [x] `router/index.js` tem `my-collections` (`requiresAuth`), `collection-detail` (pública, sem `requiresAuth`) e `search`; o nome `search` é o mesmo usado no `router.push`
- [x] `TheSidebar.vue` aponta para paths que existem (`/minhas-colecoes`, `/search`)
- [x] **Lacuna conhecida (decisão de escopo):** a coleção pública de outra pessoa só é alcançável por link; nenhuma tela lista as coleções públicas de alguém.

### Etapa 1 — Constantes, service e Home
- [x] `LIMITS.COLLECTION_*` e `SEARCH` (`MIN_LENGTH: 2`, `DEBOUNCE_MS: 400`); `collectionService.js` com as sete funções (`create` com `{ silent: true }`); a Home não chama mais `search(...)`

### Etapa 2 — `runOptimistic`
- [x] `utils/optimistic.js` criado (`apply` devolve o `undo`; sem `if` e sem toast)
- [x] Curtir e seguir refatorados, sem regressão (otimista, offline com rollback e toast, visitante → login → volta)

### Etapa 3 — Minhas Coleções e Detalhe
- [x] Modal de criação, lista e detalhe funcionando, com 403/404 na própria tela
- [x] Cartão clicável (`stretched-link`) com botão "Excluir" por cima

### Etapa 4 — Modal "Salvar"
- [x] Caixas marcadas conforme o servidor, otimistas, com rollback e uma cerca por linha
- [x] Botão "Salvar" no detalhe, com o comportamento do visitante

### Etapa 5 — Debounce, busca e Navbar
- [x] Digitar uma palavra inteira sem pausa gera uma requisição (`debounce.jpg`)
- [x] Termo na URL: F5 e link funcionam; Navbar leva à busca com o termo; Voltar não passa por cada pausa (`router.replace`)

### Etapa 6 — Teste prático
- [x] Os seis passos testados em sequência a partir do login, por clique

## Entrega
- [x] Prints em `01 - Docs/atividade13`
- [x] `respostas.md` e este `checklists.md` atualizados
- [x] ZIPs não criados, conforme solicitado
