import { onUnmounted, ref, watch } from 'vue'

export function useDebouncedValue(source, delay) {
  const value = ref(source.value)
  let timer
  const stop = watch(source, (nextValue) => {
    clearTimeout(timer)
    timer = setTimeout(() => { value.value = nextValue }, delay)
  })
  onUnmounted(() => {
    clearTimeout(timer)
    stop()
  })
  return value
}
