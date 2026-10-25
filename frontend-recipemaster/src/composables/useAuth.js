import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth.js'

export function useAuth() {
    const authStore = useAuthStore()
    const { isAuthenticated, loading, error } = storeToRefs(authStore)

    return {
        authStore,
        isAuthenticated,
        loading,
        error,
        login: authStore.login,
        logout: authStore.logout
    }
}