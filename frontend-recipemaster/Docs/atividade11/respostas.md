# Atividade 11 - Respostas

## 1. Por que uma tabela que liga a mesma tabela duas vezes precisa de apelidos (`as`), e como você "lê em voz alta" `getFollowers` e `getFollowing` sem trocá-las?

Como a tabela `follows` relaciona `users` com `users`, o ORM (Sequelize) não saberia diferenciar qual coluna se refere a quem se ambas usassem o modelo padrão. Os apelidos (`as: 'Follower'` para `followerId` e `as: 'Following'` para `followingId`) dão identidade clara a cada ponta da relação. Para ler em voz alta sem inverter: em `getFollowers(userId)`, queremos os seguidores, ou seja, as pessoas que seguem este usuário — a busca é `where: { followingId: userId }` incluindo o `Follower` ("quem está me seguindo"). Já em `getFollowing(userId)`, queremos quem o usuário segue — a busca é `where: { followerId: userId }` incluindo o `Following` ("quem eu estou seguindo").

## 2. Por que a ordem das colunas num índice composto importa, e por que a tabela tem um segundo índice?

Índices compostos em B-Tree funcionam da esquerda para a direita (regra do prefixo mais à esquerda). O índice composto `(follower_id, following_id)` atende perfeitamente a unicidade do par e acelera buscas que começam por `follower_id` (como "quem o usuário X segue"), mas o banco não consegue utilizá-lo de forma eficiente para buscar apenas por `following_id`. Por isso, é obrigatório criar um segundo índice simples na coluna `following_id`, permitindo que consultas como "quem segue o usuário Y" (`getFollowers`) rodem com busca indexada rápida sem varrer a tabela inteira.

## 3. Por que `followerId === followingId` nunca dava `true` quando o id vinha direto de `req.params`, e onde a conversão deve acontecer?

No Express, todos os valores extraídos de `req.params` chegam como `string` (ex.: `"25"`), enquanto o identificador autenticado vindo do token JWT (`req.user.id`) geralmente é do tipo `number` (ex.: `25`). Na comparação estrita `===`, tipos diferentes (`string === number`) sempre resultam em `false`, o que permitia que o usuário seguisse a si mesmo burlando a validação. A conversão (`Number()` ou `parseInt()`) deve acontecer imediatamente na borda da aplicação, isto é, no controller (`parseUserId`), antes de repassar os dados ao service.

## 4. Em que situação usar `v-model` / `defineModel` em vez do padrão "valor inicial → estado próprio" da Atividade 10?

O padrão "valor inicial → estado próprio" é indicado quando o componente filho precisa gerenciar sua própria interação de forma isolada e o componente pai não precisa reagir nem sincronizar esse valor em tempo real com outros elementos da tela. Já o `v-model` com `defineModel` (Vue 3.4+) é ideal quando o estado do filho precisa refletir diretamente e bidirecionalmente no componente pai — como no perfil público, onde clicar no botão de seguir (`FollowButton`) deve atualizar instantaneamente o número de seguidores exibido no cartão do perfil (`profile.followersCount`), mantendo uma única fonte de verdade compartilhada.

## 5. Por que, com `defineModel`, ler o valor logo depois de atribuí-lo devolve o antigo, e como evitar isso?

O `defineModel` funciona como um açúcar sintático para uma `prop` combinada com emissão de evento (`update:modelValue`). A alteração do valor notifica o componente pai para atualizar a propriedade, mas a reatividade e a sincronização do valor do ref não ocorrem de forma síncrona na mesma linha de execução. Se tentarmos ler `following.value` logo após atribuí-lo, o JavaScript ainda lerá o valor antes da reatividade processar. A forma correta de evitar isso é calcular o novo estado em uma variável local (ex.: `const nowFollowing = !following.value;`) e usá-la tanto para atribuir ao model quanto para a lógica subsequente e chamadas da API.

## 6. Por que o feed filtrado devolve `[]` cedo quando você não segue ninguém?

Quando o usuário ainda não segue nenhuma conta, a consulta inicial à tabela `follows` retorna uma lista vazia de IDs (`followedIds = []`). Se prosseguíssemos com a query principal usando `where: { userId: { [Op.in]: [] } }`, dependendo do dialeto SQL e do ORM isso geraria uma cláusula inválida (`IN ()`), geraria um erro de sintaxe ou forçaria uma consulta desnecessária ao banco de dados. O retorno antecipado de `[]` economiza processamento e I/O de rede no banco e devolve uma resposta imediata e correta para o frontend.
