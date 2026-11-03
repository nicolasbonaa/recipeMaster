# Atividade 12 — Respostas

1. `useAsyncData` recebe uma função porque precisa executar a chamada no momento controlado pelo composable, inclusive novamente quando a rota muda. Passar `minhaChamada()` executaria a requisição antes de o composable assumir o controle.
2. Uma corrida acontece quando uma resposta antiga chega depois de uma nova e sobrescreve a tela. O `lastCallId` identifica a chamada mais recente e só permite que ela atualize `data`, `error` e `loading`.
3. Falhas de ações sociais são avisadas pelo toast; falhas de leitura ficam no estado de erro da tela; falhas de formulário ficam junto ao formulário. Toast para toda leitura seria ruim porque tiraria o contexto do erro e geraria notificações intrusivas.
4. A lista de toasts fica fora de `useToast`, formando um singleton compartilhado por interceptor e componente visual. Para esse estado efêmero, isso evita criar uma store Pinia global com ações e persistência desnecessárias.
5. `limit=-3` não é um limite válido; `Number.parseInt('abc')` produz `NaN`, e `NaN >= 1` é falso, permitindo cair no padrão. O teto impede consultas excessivamente grandes e protege banco e rede.
6. A atualização otimista permaneceu dentro dos botões porque o miolo combina estado e rollback específicos de cada entidade. A regra dos três evita extrair uma abstração antes de haver três casos realmente equivalentes.
7. Sem transação, o registro pode ser criado e o contador falhar, deixando dados inconsistentes. A transação garante commit conjunto ou rollback conjunto.
