# Atividade Pratica - Aula 05

## PARTE A - Backend: Upload de Arquivos com Multer

### Checklist das tarefas

- [x] Pasta `public/uploads/profiles/` criada com `default-profile.png`.
- [x] `multer` instalado no backend.
- [x] `BIO_MAX: 160` adicionado em `config/constants.js`.
- [x] `middlewares/profileMulter.js` criado.
- [x] `path` e `express.static` configurados antes das rotas da API.
- [x] `profileUpdateValidator` criado.
- [x] `updateUserProfile` criado no servico de usuario.
- [x] `updateProfile` criado no controller.
- [x] Rota `PUT /api/profile/me` criada na ordem `authenticate`, `multer`, `validator` e `controller`.

### Checklist dos testes

- [ ] Atualizacao sem foto funciona, mantendo a foto atual.
- [ ] Atualizacao com foto nova funciona e remove a foto antiga personalizada.
- [ ] `GET /uploads/profiles/<arquivo>` responde `200`.
- [ ] Bio acima de 160 caracteres e recusada com `400`.

## PARTE B - Frontend: Formulario Multipart e Tela de Meu Perfil

### Checklist da etapa

- [x] Link `Meu perfil` visivel na Navbar quando o usuario esta logado.
- [x] `.env` atualizado com `VITE_MEDIA_URL`.
- [x] `src/utils/media.js` criado.
- [x] `getMyProfile()` criado para carregar os dados reais.
- [x] `updateProfile(formData)` criado com `Content-Type: multipart/form-data` somente nessa chamada.
- [x] Tela de Meu Perfil permite editar nome e bio.
- [x] Tela valida imagem e tamanho maximo de 5 MB no frontend.
- [x] Preview local criado com `URL.createObjectURL`, sem chamada de rede.
- [x] Tela exibe mensagens de carregamento, sucesso e erro.

### Checklist dos testes

- [ ] Tela carrega os dados reais do usuario ao montar.
- [ ] Selecionar uma foto atualiza a previa instantaneamente sem chamada de rede.
- [ ] Salvar funciona sem trocar a foto.
- [ ] Salvar funciona trocando a foto.

> Os testes foram deixados desmarcados porque a execucao manual sera feita posteriormente. O passo a passo esta em `testes.md`.
