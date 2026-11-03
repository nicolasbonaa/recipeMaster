import { ref } from 'vue'
import { useAuth } from './useAuth.js'
import { useRoute, useRouter } from 'vue-router'

export function useAuthenticatedAction(action) {
  const { isAuthenticated } = useAuth()
  const route = useRoute()
  const router = useRouter()
  const isBusy = ref(false)

  async function execute() {
    if (!isAuthenticated.value) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    if (isBusy.value) return
    isBusy.value = true
    try {
      return await action()
    } finally {
      isBusy.value = false
    }
  }

  return { isBusy, execute }
}
