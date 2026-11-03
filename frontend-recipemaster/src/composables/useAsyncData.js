import { ref } from 'vue'

export function useAsyncData(loader) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref('')
  let lastCallId = 0

  async function execute() {
    const callId = ++lastCallId
    loading.value = true
    error.value = ''
    try {
      const result = await loader()
      if (callId === lastCallId) data.value = result
      return result
    } catch (requestError) {
      if (callId === lastCallId) error.value = requestError.message || 'Não foi possível carregar os dados.'
      throw requestError
    } finally {
      if (callId === lastCallId) loading.value = false
    }
  }

  return { data, loading, error, execute }
}
