import  { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  // Públicas
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },

  // Feed e busca
  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue'), meta: { requiresAuth: true } },
  { path: '/search', name: 'search', component: () => import('../views/SearchView.vue'), meta: { requiresAuth: true } },

  // Receitas
  { path: '/receitas/upload', name: 'upload-recipe', component: () => import('../views/UploadView.vue'), meta: { requiresAuth: true } },
  { path: '/receitas/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue'), meta: { requiresAuth: true } },
  { path: '/receitas/:id/editar', name: 'edit-recipe', component: () => import('../views/EditRecipeView.vue'), meta: { requiresAuth: true } },
  { path: '/minhas-receitas', name: 'my-recipes', component: () => import('../views/MyRecipesView.vue'), meta: { requiresAuth: true } },

  // Favoritos
  { path: '/favoritos', name: 'my-favorites', component: () => import('../views/favorites/MyFavoritesView.vue'), meta: { requiresAuth: true } },

  // Perfil
  { path: '/perfil', name: 'my-profile', component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/perfil/:id', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },

  // Administração
  { path: '/admin', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/admin/usuarios', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue'), meta: { requiresAuth: true } },
  { path: '/admin/receitas', name: 'admin-recipes', component: () => import('../views/admin/AdminRecipesView.vue'), meta: { requiresAuth: true } },
  { path: '/admin/denuncias', name: 'admin-reports', component: () => import('../views/admin/AdminReportsView.vue'), meta: { requiresAuth: true } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'feed' }
  }
})

export default router