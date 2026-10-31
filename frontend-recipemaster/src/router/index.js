import  { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const routes = [
  // Públicas
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },

  // Feed e busca
  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue'), meta: { requiresAuth: true } },
  { path: '/search', name: 'search', component: () => import('../views/SearchView.vue'), meta: { requiresAuth: true } },
  { path: '/seguindo', name: 'following-feed', component: () => import('../views/FollowingFeedView.vue'), meta: { requiresAuth: true } },

  // Receitas
  { path: '/receitas/upload', name: 'upload-recipe', component: () => import('../views/UploadView.vue'), meta: { requiresAuth: true } },
  { path: '/receitas/:id/editar', name: 'edit-recipe', component: () => import('../views/EditRecipeView.vue'), meta: { requiresAuth: true } },
  { path: '/receitas/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue') },
  { path: '/minhas-receitas', name: 'my-recipes', component: () => import('../views/MyRecipesView.vue'), meta: { requiresAuth: true } },

  // Itens curtidos
  { path: '/favoritos', name: 'my-favorites', component: () => import('../views/favorites/MyFavoritesView.vue'), meta: { requiresAuth: true } },

  // Perfil
  { path: '/perfil', name: 'my-profile', component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/perfil/:id', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },
  // Uma tela, duas rotas: o "tipo" da lista vem da própria rota via props.
  { path: '/perfil/:id/seguidores', name: 'profile-followers', component: () => import('../views/profile/FollowListView.vue'), props: { kind: 'followers' } },
  { path: '/perfil/:id/seguindo', name: 'profile-following', component: () => import('../views/profile/FollowListView.vue'), props: { kind: 'following' } },

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
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'feed' }
  }
})

export default router