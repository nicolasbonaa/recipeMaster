import { onBeforeUnmount, onMounted } from 'vue'

export function useClickOutside(elementRef, handler) {
  function onDocumentClick(event) {
    if (elementRef.value && !elementRef.value.contains(event.target)) handler(event)
  }

  onMounted(() => document.addEventListener('click', onDocumentClick))
  onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
}