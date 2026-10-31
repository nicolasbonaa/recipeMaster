# Atividade Pratica - Aula 07

## Parte A - Backend

- [x] Pasta `public/uploads/recipes/` criada.
- [x] `TITLE_MAX` adicionado a `VALIDATION`.
- [x] Model `Recipe` criado com `title`, `description`, `image` e `userId`.
- [x] `config/associations.js` criado com `User.hasMany(Recipe)` e `Recipe.belongsTo(User)`.
- [x] Middleware `recipeMulter.js` criado para um arquivo de imagem.
- [x] Validator, service, controller e routes de receita criados.
- [x] Ordem da rota conferida: `auth -> multer -> validator -> controller`.
- [x] Rota montada em `app.js` como `POST /api/recipes`.
- [x] Associações carregadas antes de `sequelize.sync()` em `bin/www`.
- [x] O service cria a receita e incrementa `User.recipesCount` na mesma transacao.

## Parte B - Frontend

- [x] `recipeService.js` criado com `onUploadProgress`.
- [x] Formulario de titulo, descricao e imagem criado.
- [x] Preview local criado com `URL.createObjectURL`, sem chamada de rede.
- [x] `.progress-bar` e `.thumbnail-preview` adicionadas ao CSS.
- [x] Barra de progresso e mensagens de sucesso/erro implementadas.
- [x] Link `Publicar receita` visivel apenas para usuarios autenticados.
- [x] Rota protegida `/receitas/upload` existente no Vue Router.

## Checklist de alcance e testes

- [x] Login e acesso ao link levam a `/receitas/upload` sem recarregar a pagina.
- [x] Envio vazio mostra os erros de campos obrigatorios.
- [x] Selecao da imagem mostra preview sem chamada de rede.
- [x] Envio usa `multipart/form-data` e informa progresso.
- [x] A API recusa titulo, descricao ou imagem ausentes com status `400`.
- [x] A API recusa arquivo que nao seja imagem com status `400`.
- [x] Upload valido cria o registro e incrementa `recipesCount`.

## Evidencias

Os prints pedidos pela atividade devem ser adicionados nesta pasta com os nomes `formulario-preenchido.jpg`, `progresso-upload.jpg`, `upload-multipart.jpg`, `link-envio.jpg` e os prints dos curls. A validacao de banco/API exige um ambiente MySQL configurado no arquivo `.env` local.
