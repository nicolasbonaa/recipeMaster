# Atividade Pratica - Aula 09

Projeto Grupo B: receita com arquivo unico de imagem.

## Parte A - Backend

- [x] Detalhe recarrega a receita depois de incrementar `views`.
- [x] `GET /api/my-recipes` lista os itens do usuario autenticado, do mais novo para o mais antigo.
- [x] `GET /api/recipes/:id/edit` verifica 404 antes de 403 e nao incrementa visualizacoes.
- [x] `PUT /api/recipes/:id` aceita texto e troca opcional da imagem.
- [x] `DELETE /api/recipes/:id` remove registro, imagem e decrementa `recipesCount`.
- [x] `GET /api/profile/:username` usa `optionalAuth`, retorna itens ordenados e `isOwner`.
- [x] `errorHandler` remove o arquivo recebido quando a requisicao falha depois do upload.
- [ ] Prints dos curls e contagens de arquivos: executar com MySQL, duas contas e imagens reais.

## Parte B - Frontend

- [x] `useClickOutside.js` criado.
- [x] `BaseModal.vue` criado com fechamento por X, fora e Escape.
- [x] Servicos de meus itens, edicao, exclusao e perfil publico criados.
- [x] `RecipeCard` nao usa ancora envolvendo todo o card, possui autor clicavel e slot `actions`.
- [x] Menu do avatar com editar perfil, ver perfil, meus itens e sair.
- [x] Perfil publico com itens e acoes condicionais.
- [x] Meus itens com editar, excluir, busy e remocao local apos sucesso.
- [x] Tela de edicao com pre-preenchimento, preview e imagem opcional.
- [x] Detalhe mostra autor clicavel e botao Editar apenas para o dono.
- [x] Upload oferece link para Meus Itens apos sucesso.
- [x] Feed existente continua compilando.
- [ ] Prints `menu-avatar.jpg`, `perfil-publico.jpg`, `modal-exclusao.jpg`, `editar.jpg` e evidencias manuais: capturar com o projeto em execucao.

## Validacao automatica

- [x] `node --check` nos arquivos backend alterados.
- [x] `npm run build` no frontend.
- [x] Diagnosticos do editor sem erros nos arquivos centrais alterados.
