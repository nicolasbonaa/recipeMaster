# Questão 3 — Inspeção SOLID

## 1. Metodologia

1. Foi delimitado o backend em `backend-recipemaster`, excluindo dependências e
   arquivos gerados.
2. Foram listados os módulos de rota, controllers, services, models,
   middlewares e configurações.
3. Cada módulo foi lido procurando: mais de uma razão de mudança; dependência
   direta de detalhes; contratos implícitos entre funções; clientes forçados a
   importar operações que não usam; e pontos que exigem edição de código
   existente para adicionar uma variação.
4. Para cada achado foram registrados arquivo, linhas, evidência, princípio
   afetado, impacto e uma refatoração possível.
5. A inspeção é reproduzível lendo os arquivos citados no commit/estado do
   repositório e repetindo a busca por `sequelize`, `fs`, `bcrypt`, `require`,
   `multer` e `module.exports`.

Os princípios foram aplicados à abordagem funcional: módulo/bloco equivale à
classe, função equivale ao método e dependência concreta equivale a uma
dependência de infraestrutura. Uma ocorrência pode representar mais de um
princípio; o enunciado permite repetições.

## 2. Achados

### S1 — `recipeService` tem responsabilidades demais (SRP)

**Evidência:** [recipeService.js](../backend-recipemaster/modules/recipe/recipeService.js:1)
importa Sequelize, quatro Models e filesystem. No mesmo módulo, as funções
criam consultas, controlam transações, aplicam autorização do proprietário,
montam DTOs, incrementam contadores e removem arquivos (linhas 11–82).

**Por que viola:** mudanças no banco, na regra de autorização, no formato de
resposta ou no armazenamento de imagens exigem alterar o mesmo módulo.

**Refatoração:** separar `PublishRecipe/EditRecipe/DeleteRecipe` (aplicação),
`RecipeRepository` e `UserCounterRepository` (portas/adaptadores), uma política
`RecipeOwnership` (domínio) e `ImageStorage` (porta). O controller recebe
somente DTOs do caso de uso.

### S2 — `userService` mistura identidade, perfil e arquivos (SRP)

**Evidência:** [userService.js](../backend-recipemaster/modules/user/userService.js:1)
faz hash com bcrypt, consulta e cria usuários, monta perfil público, atualiza
perfil e remove imagens via `fs` (linhas 26–116).

**Por que viola:** segurança de credenciais, leitura de perfil, persistência e
armazenamento são razões de mudança diferentes.

**Refatoração:** separar `RegisterUser`/`PasswordHasher`, `UserRepository`,
`ProfileService` e `ProfileImageStorage`; manter `profileData` como mapper
dedicado ou DTO do contexto de identidade.

### S3 — autenticação depende de detalhes concretos (DIP)

**Evidência:** [authService.js](../backend-recipemaster/modules/auth/authService.js:1)
importa diretamente `bcrypt`, o Model Sequelize e `generateToken` de JWT.

**Por que viola:** o caso de login depende do ORM, da biblioteca de hash e do
formato JWT, em vez de depender de abstrações. Testes precisam de banco e
bibliotecas reais.

**Refatoração:** definir `UserCredentialReader`, `PasswordVerifier` e
`TokenIssuer` como portas; injetar adaptadores
`SequelizeUserCredentialReader`, `BcryptPasswordVerifier` e
`JwtTokenIssuer` no composition root.

### S4 — `recipeService` depende diretamente da infraestrutura (DIP)

**Evidência:** [recipeService.js](../backend-recipemaster/modules/recipe/recipeService.js:1)
importa `config/database`, Models Sequelize e `fs/promises` para implementar o
caso de uso.

**Por que viola:** uma regra de publicação/remoção fica acoplada a MySQL,
Sequelize e disco local; trocar banco, storage ou testar uma regra isolada
requer modificar a regra.

**Refatoração:** o serviço de aplicação deve receber `recipeRepository`,
`interactionRepository`, `imageStorage` e `transactionRunner`. Os adaptadores
atuais implementam essas portas.

### S5 — clientes ficam acoplados a um módulo de serviço amplo (ISP)

**Evidência:** [recipeController.js](../backend-recipemaster/modules/recipe/recipeController.js:1)
importa o namespace inteiro de `recipeService`, que exporta sete operações
diferentes em [recipeService.js](../backend-recipemaster/modules/recipe/recipeService.js:82).

**Por que viola:** o controller de HTTP conhece o conjunto de consultas,
mutação e exclusão do módulo, embora cada endpoint use apenas uma parte. Em
uma arquitetura funcional, esse namespace é uma interface ampla imposta ao
cliente.

**Refatoração:** expor portas pequenas por caso de uso
(`PublishRecipe`, `RecipeQueries`, `ManageRecipe`) ou injetar funções/objetos
com apenas a operação requerida por cada controller.

### S6 — composição de rotas exige alteração para cada novo módulo (OCP)

**Evidência:** [app.js](../backend-recipemaster/app.js:7) importa cada conjunto
de rotas individualmente e as registra manualmente nas linhas 26–32. A adição
de um bounded context exige editar o módulo central, além de criar o próprio
módulo.

**Por que viola:** a composição não é fechada para extensão; o núcleo HTTP
acumula conhecimento de todas as funcionalidades.

**Refatoração:** cada contexto exporta um adaptador com prefixo/metadados e o
composition root carrega uma lista explícita de módulos (ou um registro
centralizado de adapters). A inicialização continua explícita e tipada, mas o
`app` não precisa conhecer handlers internos.

## 3. Observação sobre Liskov

Não foi marcado um sétimo achado de LSP como violação confirmada. O código usa
funções e objetos Sequelize sem hierarquia de subtipos explícita; inventar uma
substituição quebrada seria menos reproduzível do que os seis achados acima.
Na refatoração proposta, o LSP deve ser verificado nos contratos das portas:
qualquer `RecipeRepository` substituto precisa preservar `not found`, atomicidade
e semântica de atualização esperadas pelos casos de uso.

## 4. Priorização

1. **Alta:** S3 e S4, pois dificultam testes e migração de infraestrutura.
2. **Alta:** S1 e S2, pois mudanças pequenas atravessam serviços com muitas
   responsabilidades.
3. **Média:** S5 e S6, pois o acoplamento cresce conforme novos contextos são
   adicionados.

As sugestões são intencionalmente arquiteturais; não foram implementadas no
backend porque o enunciado solicita a análise e a proposta, não a refatoração
do projeto web.
