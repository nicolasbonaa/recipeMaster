# Atividade 10 - Respostas

## 1. Por que a regra de uma curtida por pessoa deve estar no banco?

O índice único composto por `user_id` e `recipe_id` garante a regra mesmo se duas requisições chegarem ao mesmo tempo ou se alguém tentar inserir dados diretamente no banco. Uma validação apenas no código pode sofrer condição de corrida e permitir duplicidade.

## 2. Contador guardado, contador calculado e transação

O contador guardado fica na receita e permite leituras rápidas; o contador calculado consulta as linhas de curtidas ou comentários e é mais resistente a divergências, mas custa mais. O contador guardado pode ficar incorreto se a linha e o contador forem atualizados separadamente. A transação confirma as duas alterações juntas ou desfaz ambas em caso de erro.

## 3. O que acontece sem `{ transaction: t }`?

O comando que esquecer `{ transaction: t }` será executado fora da transação. Assim, ele pode ser confirmado mesmo que outro comando da transação falhe, deixando a linha e o contador inconsistentes. Toda escrita relacionada precisa receber a mesma transação.

## 4. O que é atualização otimista?

Atualização otimista altera a interface imediatamente, envia a requisição em seguida e confirma o resultado ou desfaz a alteração se a API falhar. Seus três passos são aplicar a mudança local, executar a operação remota e confirmar ou fazer rollback. Ela não é adequada quando a operação exige confirmação prévia, tem alto risco ou não pode ser desfeita com segurança.

## 5. Por que usar `{{ }}` em vez de `v-html`?

A interpolação `{{ }}` escapa o conteúdo e exibe tags como texto. `v-html` interpreta HTML fornecido pelo usuário e pode permitir XSS, por exemplo ao inserir atributos de evento ou scripts maliciosos. Comentários devem sempre ser renderizados com interpolação.

## 6. Por que `.trim()` vem antes de `.notEmpty()`?

`trim()` remove espaços das extremidades antes da validação. Assim, um valor formado apenas por espaços vira uma string vazia e `notEmpty()` consegue rejeitá-lo. Depois do trim, o mesmo valor aparado também é o que será salvo e exibido.
