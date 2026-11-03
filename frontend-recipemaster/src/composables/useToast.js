import { ref } from 'vue'
import { TOAST } from '../config/constants.js'

const toasts = ref([])
let nextId = 1

function removeToast(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function addToast(message, type = 'error', duration = TOAST.DURATION) {
  const id = nextId++
  toasts.value.push({ id, message, type })
  window.setTimeout(() => removeToast(id), duration)
}

export function useToast() {
  return { toasts, addToast, removeToast }
}
