export function formatCount(value = 0) {
  return new Intl.NumberFormat('pt-BR').format(Number(value) || 0)
}

export function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}
