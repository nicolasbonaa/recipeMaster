import { computed, ref } from 'vue'
import { PAGE_SIZE } from '../config/constants.js'

export function usePaginatedList(loader, pageSize = PAGE_SIZE) {
  const items = ref([])
  const page = ref(1)
  const loading = ref(false)
  const error = ref('')
  const hasMore = ref(true)

  async function loadPage(reset = false) {
    if (loading.value || (!hasMore.value && !reset)) return
    if (reset) {
      page.value = 1
      items.value = []
      hasMore.value = true
    }
    loading.value = true
    error.value = ''
    try {
      const response = await loader(page.value, pageSize)
      const nextItems = response.data || []
      items.value.push(...nextItems)
      hasMore.value = nextItems.length === pageSize
      page.value += 1
      return nextItems
    } catch (requestError) {
      error.value = requestError.message || 'Não foi possível carregar a lista.'
      throw requestError
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, hasMore: computed(() => hasMore.value), loadPage }
}
