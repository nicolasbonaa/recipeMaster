import  { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Públicas
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },

  // Feed e busca
  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue') },
  { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },

  // Receitas
  { path: '/receitas/upload', name: 'upload-recipe', component: () => import('../views/UploadView.vue') },
  { path: '/receitas/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue') },
  { path: '/receitas/:id/editar', name: 'edit-recipe', component: () => import('../views/EditRecipeView.vue') },
  { path: '/minhas-receitas', name: 'my-recipes', component: () => import('../views/MyRecipesView.vue') },

  // Favoritos
  { path: '/favoritos', name: 'my-favorites', component: () => import('../views/favorites/MyFavoritesView.vue') },

  // Perfil
  { path: '/perfil', name: 'my-profile', component: () => import('../views/profile/MyProfileView.vue') },
  { path: '/perfil/:id', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },

  // Administração
  { path: '/admin', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue') },
  { path: '/admin/usuarios', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue') },
  { path: '/admin/receitas', name: 'admin-recipes', component: () => import('../views/admin/AdminRecipesView.vue') },
  { path: '/admin/denuncias', name: 'admin-reports', component: () => import('../views/admin/AdminReportsView.vue') },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router