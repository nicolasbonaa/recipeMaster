# Checklists - Atividade Prática - Aula 01

## PARTE A - Backend: construindo a API do seu projeto

### Etapa 1 - Setup do ambiente e criação do projeto
- [x] `node -v` e `npm -v` conferidos
- [x] Pasta `<seu-projeto>-api` criada, separada da pasta do front
- [x] `package.json` gerado com `npm init -y`

### Etapa 2 - Instalando as dependências e configurando os scripts
- [x] `express`, `cors`, `dotenv`, `morgan` instalados como dependências
- [x] `nodemon` instalado como devDependency
- [x] Scripts `start` e `dev` configurados no `package.json`

### Etapa 3 - Estrutura de pastas
- [x] Pastas `bin/`, `config/`, `middlewares/`, `modules/`, `routes/` criadas
- [x] `.gitignore` criado com `node_modules/` e `.env`

### Etapa 4 - O padrão único de resposta da API
- [x] `middlewares/apiResponse.js` criado com as funções `success` e `error`

### Etapa 5 - A primeira rota: GET /api
- [x] `routes/index.js` criado, com name / message adaptados ao nome do seu projeto
- [x] Campo `data.status` escrito exatamente assim (minúsculo, sem variação)

### Etapa 6 - CORS: autorizando o seu front
- [x] `.env` criado com PORT e CORS_ORIGIN corretos para o seu projeto

### Etapa 7 - Montando app.js e subindo o servidor
- [x] `app.js` criado, montando indexRouter sob o prefixo `/api`
- [x] `bin/www` criado
- [x] `npm run dev` sobe o servidor sem erros, exibindo a mensagem de confirmação

### Etapa 8 - Testando a API isoladamente
- [x] `curl http://localhost:3000/api` (ou a porta que você escolheu) responde o JSON esperado, com o nome do seu projeto

## PARTE B - Frontend: telas do seu projeto e integração com a sua API

### Etapa 1 - Verificação e criação do projeto
- [x] `curl` confirmou que a sua API (Parte A) está respondendo - se não respondeu, volte à Parte A antes de continuar
- [x] `npm run dev` abriu a página padrão do Vite + Vue em `http://localhost:5173`

### Etapa 2 - Organização de pastas e variáveis de ambiente
- [x] Estrutura de pastas criada
- [x] `HelloWorld.vue` removido e `style.css` limpo
- [x] `.env` criado com a `VITE_API_URL` apontando para a sua API
- [x] `.gitignore` configurado

### Etapa 3 - Vue Router: mapeando TODAS as telas do seu projeto
- [x] Tabela de tradução "funcionalidade -> tela" preenchida para o seu projeto
- [x] Uma tela placeholder criada para cada linha da tabela
- [x] `src/router/index.js` criado com todas as rotas do seu sistema
- [x] Router registrado em `main.js`
- [x] Navegando manualmente pela URL, cada rota carrega a tela correspondente

### Etapa 4 - Layout base: Navbar, Sidebar e Footer
- [x] `TheNavbar.vue`, `TheSidebar.vue` e `TheFooter.vue` criados, com links para as rotas do seu projeto
- [x] Layout montado em `App.vue`, com `<router-view />` no lugar certo
- [x] Ao navegar entre rotas, Navbar/Sidebar/Footer permanecem fixos e só o conteúdo central troca

### Etapa 5 - Consumindo a sua API: o marco visual da Landing
- [x] Landing Page exibindo "Status da API: online" com dados reais da sua API
- [x] Erro de CORS reproduzido intencionalmente e depois corrigido, com prints/anotações do que apareceu no Console e no Network do DevTools, e também do que apareceu (ou não) no terminal da API