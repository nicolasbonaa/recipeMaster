# RecipeMaster – Mapeamento de Telas

Plataforma de Receitas Interativas

Formato de cada linha: **Tela, Justificativa, Categoria**

## ✅ Sempre necessárias (independente do projeto)

```
LandingView.vue, Página inicial sempre existe, Sempre

auth/LoginView.vue e auth/RegisterView.vue, "Cadastro e autenticação" está explícito, Sempre

FeedView.vue, Dois feeds - "Seguindo" e "Geral" (via abas/filtro ou duas views separadas), Sempre

admin/AdminDashboardView.vue, "Dashboard administrativo" está explícito, Sempre

admin/AdminUsersView.vue, Gerenciamento de usuários (moderação de usuários), Sempre

admin/AdminRecipesView.vue, Gerenciamento de receitas e categorias, Sempre

NotFoundView.vue, Rota 404 padrão, Sempre
```

## ✅ Aplicáveis pelo conteúdo do projeto

```
UploadView.vue, Upload de novas receitas com imagens, Conteúdo do projeto

RecipeDetailView.vue, Página de detalhe para exibir avaliação comentários curtir/descurtir, Conteúdo do projeto

EditRecipeView.vue, Usuário pode editar receitas que publicou, Conteúdo do projeto

MyRecipesView.vue, Conteúdo publicado pelo próprio usuário, Conteúdo do projeto

profile/MyProfileView.vue e profile/PublicProfileView.vue, Necessário por causa de "seguir/deixar de seguir usuários", Conteúdo do projeto

favorites/MyFavoritesView.vue, Favoritar receitas e criar listas personalizadas, Conteúdo do projeto

SearchView.vue, Buscar receitas com base em ingredientes disponíveis, Conteúdo do projeto

admin/AdminReportsView.vue, "Moderação de conteúdos" está explícito, Conteúdo do projeto
```

## ❌ Não aparece como necessidade explícita

```
NotificationsView.vue, Não mencionado explicitamente no escopo - "seguir usuários" geralmente sugere notificações mas não foi citado - vale confirmar, Não confirmado
```

## Resumo rápido de telas específicas do domínio

```
RecipeDetailView.vue
EditRecipeView.vue
MyRecipesView.vue
admin/AdminRecipesView.vue
favorites/MyFavoritesView.vue
```
