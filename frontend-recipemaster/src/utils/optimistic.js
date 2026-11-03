// Atualização otimista em três tempos:
// apply()   muda a tela na hora e devolve a função que desfaz exatamente essa mudança;
// request() dispara a chamada à API e devolve a promessa;
// confirm() adota o que o servidor respondeu.
// No erro só desfazemos: o toast já foi mostrado pelo interceptor do axios.
export async function runOptimistic({ apply, request, confirm }) {
  const undo = apply()
  try {
    const response = await request()
    confirm(response.data)
  } catch {
    undo()
  }
}
