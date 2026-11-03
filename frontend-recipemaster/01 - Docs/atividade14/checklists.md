# Atividade 14 — Checklists

## Ficha (Seção 2)

| Nome | Shortz-App | Recipe Master |
| --- | --- | --- |
| Model de notificação | `Notification` (`notifications`, módulo `notification`) | `Notification` (`notifications`, `modules/notification`) |
| Model de denúncia | `Report` (`reports`, módulo `report`) | `Report` (`reports`, `modules/report`) |
| Id do item nas duas tabelas | `videoId` | `recipeId` |
| Rota da denúncia | `POST /api/videos/:videoId/report` | `POST /api/recipes/:recipeId/report` |
| Texto de "curtiu" | "curtiu o seu vídeo" | "curtiu a sua receita" |
| Texto de "comentou" | "comentou no seu vídeo" | "comentou na sua receita" |
| Tela e componentes | `NotificationsView`, `ReportVideoModal` | `NotificationsView`, `ReportRecipeModal` |
| Os três gatilhos | `toggleLike`, `addComment`, `toggleFollow` | `likeService.toggleLike`, `commentService.createComment`, `followService.toggleFollow` |

Rotas de notificação: `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/:id/read`.

## Parte A — Backend

### Etapa 1 — Constantes, models e associações
- [x] `NOTIFICATION.TYPES` e `REPORT.REASONS` em `config/constants.js`; models `Notification` e `Report`; cinco associações (`Recipient`, `Actor`, `Reporter` e uma para a receita em cada um)
- [x] Tabelas, índices, `ENUM` e chaves estrangeiras conferidos no banco: `NO ACTION` em `reports`, `SET NULL` em `notifications` (`banco-notificacoes.jpg`)

### Etapa 2 — Módulo de notificações
- [x] Quatro arquivos do módulo, registrados no `app.js` antes do 404 e do `errorHandler`
- [x] `GET /notifications` sem token responde 401 (teste 1)

### Etapa 3 — Módulo de denúncias
- [x] Quatro arquivos do módulo `report` (Validator, Service, Controller, Routes), registrados no `app.js`
- [x] Ordem dos erros: 401 → 400 (motivo) → 400 (id) → 404 → 400 (própria receita) → 409

### Etapa 4 — Notificações nos três services e exclusão
- [x] As três ações criam o aviso dentro da transação, com o `t`; curtir e seguir também o apagam ao desfazer
- [x] A exclusão da receita apaga denúncias e notificações antes do `destroy` da receita
- [x] `cors` antes do `express.json()` no `app.js`
- [x] Teste de controle feito e descrito, nas duas partes (resposta 6; `controle-reports.jpg`, `controle-orfa.jpg`)

### Etapa 5 — Testes
- [x] Bateria `backend-recipemaster/scripts/teste-aula-14.ps1` executada (61 verificações; ver `curl-parte-a.md`); um print por curl (`curl-teste1.jpg` … `curl-teste61.jpg`). Os testes de banco (8) estão em `banco-notificacoes.jpg`.

## Parte B — Frontend

### Seção 8 — Alcançabilidade (respondida antes de programar)

| Peça | Caminho de clique |
| --- | --- |
| Notificações | sino na Navbar (todas as telas, só para quem está logado) |
| Marcar como lida | botão "Marcar como lida" na linha e clique na própria notificação |
| Ir ao que gerou o aviso | clique no texto: receita (curtir/comentar) ou perfil (seguir) |
| Ver as mais antigas / as novas | "Carregar mais notificações" no fim / "Atualizar" no topo |
| Denunciar | botão "Denunciar" no detalhe da receita (visitante → login → volta; o dono não o vê) |

- [x] `router/index.js`: rota `/notificacoes` com `requiresAuth` e nome `notifications`, o mesmo usado pelo sino em `{ name: 'notifications' }`; a tela `NotificationsView.vue` foi criada
- [x] **Lacuna conhecida (decisão de escopo):** a lista de notificações não se atualiza sozinha; só o número do sino. Para ver as novas, "Atualizar".

### Etapa 1 — Constantes, services e store
- [x] `NOTIFICATIONS.POLL_MS` (30000), `NOTIFICATION_TEXT` e `REPORT_REASONS`; `notificationService.js` e `reportService.js` (`{ silent: true }`); `stores/notifications.js` com `refresh`, `setUnreadCount`, `refreshIfVisible`, `startPolling` e `stopPolling`
- [x] `removeEventListener` recebe a mesma referência do `addEventListener` (`refreshIfVisible`)

### Etapa 2 — Sino na Navbar
- [x] O sino aparece só para quem está logado; o selo só com não lidas (`99+` acima de 99) e `aria-label` com o número
- [x] O número se atualiza sozinho; um só temporizador depois de logins e logouts repetidos (medido: 0 s, 30 s, 60 s); nenhuma requisição depois de sair

### Etapa 3 — Tela de notificações
- [x] Lista paginada, estado vazio, "Atualizar" e "Carregar mais notificações"
- [x] Marcar como lida otimista, com rollback e toast; uma requisição por clique duplo; o sino volta ao número do começo com duas linhas falhando juntas (medido: 12 → 10 → 12)

### Etapa 4 — Denunciar e logout
- [x] Modal com os cinco rádios; motivo obrigatório sem chamar a API; erro dentro do modal e sem toast; toast de sucesso
- [x] O dono da receita não vê o botão "Denunciar"
- [x] Logout com o Console limpo (`POST /api/logout` → 200, sem corpo)

### Etapa 5 — Teste prático
- [x] Os nove passos testados em sequência a partir do login, por clique (a sessão expirada foi simulada pelo `localStorage`: foi para o login, sem toast e sem laço)

## Entrega
- [x] Prints em `01 - Docs/atividade14`
- [x] `respostas.md` e este `checklists.md` atualizados
- [x] ZIPs não criados, conforme solicitado
