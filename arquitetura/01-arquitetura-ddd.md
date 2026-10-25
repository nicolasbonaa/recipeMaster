# Questão 1 — Arquitetura orientada a DDD

## 1. Domínio e linguagem ubíqua

O domínio é uma comunidade de receitas. Os termos usados no código e nas
interfaces devem ser consistentes:

| Termo | Significado no domínio |
| --- | --- |
| Usuário | Pessoa autenticada que utiliza a plataforma |
| Autor | Usuário proprietário de uma receita |
| Receita | Publicação culinária com título, descrição e imagem |
| Feed | Lista paginada de receitas visíveis ao usuário |
| Curtida | Relação entre usuário e receita |
| Comentário | Texto associado a uma receita e a um autor |
| Perfil | Dados públicos e contadores de um usuário |
| Publicação | Caso de uso que cria uma receita |

## 2. Bounded contexts

### Identidade e Acesso

Responsável por cadastro, autenticação, credenciais, token, bloqueio e
permissões administrativas. Não deve conhecer a estrutura interna de receitas.

### Comunidade

Responsável por perfil público, seguir/deixar de seguir, curtidas e comentários.
Mantém as interações sociais e suas regras, referenciando identidades por
`userId` em vez de importar o agregado inteiro de Usuário.

### Catálogo de Receitas

Responsável pelo agregado `Recipe`, publicação, edição, remoção, imagem,
contagem de visualizações e consulta do feed. O autor é uma referência para o
contexto de Identidade.

### Descoberta

Responsável por busca, feed geral e, futuramente, feed baseado em
seguimentos/relevância. Pode manter uma projeção própria para evitar consultas
transversais nos agregados transacionais.

### Moderação

Responsável por denúncias, bloqueios, aprovação e auditoria. É um contexto
separado, mesmo que inicialmente tenha apenas operações administrativas.

## 3. Organização proposta

```text
src/
├── shared/
│   ├── domain/
│   │   ├── Entity.js
│   │   ├── DomainError.js
│   │   └── DomainEvent.js
│   └── infrastructure/
│       ├── database/
│       ├── events/
│       └── http/
├── contexts/
│   ├── identity-access/
│   │   ├── domain/
│   │   │   ├── entities/User.js
│   │   │   ├── value-objects/Email.js
│   │   │   └── ports/UserRepository.js
│   │   ├── application/
│   │   │   └── use-cases/{RegisterUser,LoginUser}.js
│   │   ├── infrastructure/
│   │   │   ├── persistence/SequelizeUserRepository.js
│   │   │   └── security/{BcryptPasswordHasher,JwtTokenService}.js
│   │   └── interfaces/http/
│   ├── recipe-catalog/
│   │   ├── domain/
│   │   │   ├── entities/Recipe.js
│   │   │   ├── services/RecipeOwnership.js
│   │   │   └── events/RecipePublished.js
│   │   ├── application/
│   │   │   └── use-cases/{PublishRecipe,EditRecipe,DeleteRecipe}.js
│   │   ├── infrastructure/
│   │   │   ├── persistence/SequelizeRecipeRepository.js
│   │   │   └── storage/LocalImageStorage.js
│   │   └── interfaces/http/
│   ├── community/
│   │   ├── domain/{Like,Comment,Follow}.js
│   │   ├── application/use-cases/
│   │   ├── infrastructure/persistence/
│   │   └── interfaces/http/
│   ├── discovery/
│   │   ├── application/use-cases/{SearchRecipes,GetFeed}.js
│   │   ├── infrastructure/read-models/
│   │   └── interfaces/http/
│   └── moderation/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── interfaces/http/
└── composition-root/
    └── app.js
```

## 4. Regras de dependência

As dependências apontam para dentro:

```text
interfaces/http -> application -> domain
infrastructure  -> application/domain (implementa portas)
composition-root -> todos os contextos (monta as dependências)
domain           -> shared/domain
```

O domínio não importa Express, Sequelize, bcrypt, JWT, Multer, filesystem ou
RabbitMQ. Repositórios, armazenamento de imagens, hash de senha, tokens e
publicação de eventos são portas definidas no domínio/aplicação e adaptadores
implementados na infraestrutura.

## 5. Mapeamento do sistema atual para DDD

| Código atual | Destino proposto | Observação |
| --- | --- | --- |
| `modules/user` e `modules/auth` | `identity-access` | Separar credencial de perfil |
| `modules/recipe` | `recipe-catalog` | Extrair regras do agregado |
| `modules/like` e `modules/comment` | `community` | Interações sociais |
| `modules/search` | `discovery` | Read model e consultas |
| `config/database.js` e Models Sequelize | `infrastructure/persistence` | Adaptadores de persistência |
| `middlewares/*Multer.js` | `infrastructure/storage` | Adaptador de arquivos |
| `config/jwt.js` | `identity-access/infrastructure/security` | Implementação de porta |
| `routes` e controllers | `interfaces/http` | Adaptadores de entrada |

## 6. Agregados e casos de uso prioritários

- `User`: identidade, email, username e estado de bloqueio.
- `Recipe`: título, descrição, imagem, autor e contadores; invariantes de
  proprietário e conteúdo obrigatório.
- `Comment`: autor, receita e conteúdo validado.
- `Like`: relação única entre usuário e receita.

Casos de uso iniciais: `RegisterUser`, `LoginUser`, `PublishRecipe`,
`EditRecipe`, `DeleteRecipe`, `GetRecipeDetails`, `ToggleLike`,
`CreateComment` e `SearchRecipes`. Cada caso de uso recebe portas por
injeção, coordena uma transação quando necessário e retorna um DTO, não uma
instância Sequelize.
