import { defineStore } from 'pinia'
import { login as loginRequest } from '../services/authService'

const TOKEN_KEY = 'recipeMaster_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await loginRequest(credentials)
        const token = response.data?.token || response.token

        if (!token) {
          throw new Error('A API não retornou um token de acesso.')
        }

        this.token = token
        localStorage.setItem(TOKEN_KEY, token)
        return token
      } catch (error) {
        this.error = error.message || 'Não foi possível entrar.'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.error = null
      localStorage.removeItem(TOKEN_KEY)
    },
  },
})

export { TOKEN_KEY }
