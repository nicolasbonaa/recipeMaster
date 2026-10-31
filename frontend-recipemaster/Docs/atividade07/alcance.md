# Resposta ao checklist de alcance

1. Depois do login, o item **Publicar receita** aparece na Sidebar somente para usuario autenticado. O clique usa `router-link`, atualiza a URL para `/receitas/upload` e nao recarrega a pagina.
2. O formulario vazio apresenta mensagens para titulo, descricao e imagem antes de qualquer requisicao.
3. Como o Recipe Master e Grupo B, existe somente um arquivo obrigatorio: `image`.
4. Ao escolher uma imagem, a previsualizacao e criada localmente com `URL.createObjectURL`; nenhuma chamada de rede e feita nessa etapa.
5. Ao enviar, o service monta um `FormData`, envia para `POST /api/recipes` e atualiza a barra usando `event.loaded` e `event.total` de `onUploadProgress`.
6. A requisicao chega como `multipart/form-data` com boundary gerado pelo Axios/browser.
7. No backend, a imagem e salva em `public/uploads/recipes`, a linha e criada em `recipes` e `recipesCount` do usuario autenticado e incrementado na mesma transacao.
8. Erros de validacao exibem a mensagem retornada pela API; sucesso exibe `Receita publicada com sucesso.`.
