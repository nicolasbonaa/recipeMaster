# Recipe Master - Ficha da Atividade

## Identificacao

- **Projeto:** Recipe Master
- **Atividade:** Parte B - Frontend: Login, Pinia e Protecao de Rotas
- **Frontend:** Vue 3 + Vite
- **API:** `http://localhost:3000/api`
- **Cor de marca:** `#d96c4d` (laranja queimado)
- **Variavel CSS:** `--brand-color: #d96c4d`

## Checklist de Implementacao

- [x] `createPinia()` registrado em `src/main.js` antes do router.
- [x] Store `src/stores/auth.js` criada.
- [x] Token persistido em `localStorage` com a chave `recipeMaster_token`.
- [x] Interceptor de requisicao adiciona `Authorization: Bearer <token>`.
- [x] Interceptor de resposta limpa a sessao e redireciona ao Login quando recebe `401`.
- [x] Bootstrap 5 incluido via CDN.
- [x] `src/assets/main.css` criado com a cor de marca do projeto.
- [x] Tela de Login chama `authStore.login(...)`.
- [x] Login redireciona para a rota principal `/feed`.
- [x] Rotas com `meta.requiresAuth: true` possuem guarda de acesso.
- [x] `useAuthStore()` e chamado dentro dos callbacks apropriados.
- [x] Navbar exibe links diferentes para usuarios logados e deslogados.
- [x] Logout limpa a sessao e redireciona ao Login.
- [x] Tela de perfil faz uma requisicao autenticada e exibe `Perfil autenticado OK:` no Console.

## Evidencias para Entrega

### 1. Redirecionamento de rota protegida

Com o usuario deslogado, acessar `/feed` deve redirecionar para:

```text
/login?redirect=/feed
```

**Arquivo da evidencia:** `evidencia-01-redirecionamento.jpg`

### 2. Perfil autenticado

Com login valido, acessar `/perfil` deve registrar no Console:

```text
Perfil autenticado OK:
```

**Arquivo da evidencia:** `evidencia-02-perfil-autenticado.jpg`

### 3. Logout automatico com token invalido

Editar manualmente o valor de `recipeMaster_token` no Local Storage e acessar `/perfil` deve:

- gerar uma resposta `401` na requisicao `profile/me`;
- limpar o token do Local Storage;
- redirecionar o usuario para `/login`.

**Arquivo da evidencia:** `evidencia-03-logout-token-invalido.jpg`

## Validacao

- [x] API respondeu em `GET /api/`.
- [x] Build do frontend executado com `npm run build`.
- [x] Backend validado com `node --check`.

## Arquivos Principais

- `src/main.js`
- `src/stores/auth.js`
- `src/services/api.js`
- `src/router/index.js`
- `src/views/auth/LoginView.vue`
- `src/views/profile/MyProfileView.vue`
- `src/components/layout/TheNavbar.vue`
- `src/assets/main.css`
