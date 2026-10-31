# Roteiro de apresentação — Arquitetura do RecipeMaster

## Objetivo

Apresentar, em aproximadamente 10 a 15 minutos, o domínio do RecipeMaster,
as decisões arquiteturais propostas e os principais pontos de melhoria
identificados no código atual.

## Materiais de apoio

- [Arquitetura DDD](./01-arquitetura-ddd.md)
- [Comunicação C4 e mensageria](./02-comunicacao-c4.md)
- [Análise SOLID](./03-analise-solid.md)
- [Diagrama de contexto](./C4-contexto.mmd)
- [Diagrama de contêineres](./C4-containers.mmd)
- [Diagrama de componentes da mensageria](./C4-componentes-mensageria.mmd)

## Sequência sugerida

### 1. Abertura e contexto — 1 minuto

**Mensagem principal:** o RecipeMaster é uma plataforma social de receitas,
não apenas um cadastro de receitas.

**Fala sugerida:**

> O RecipeMaster permite que usuários criem contas, publiquem receitas com
> imagens, descubram conteúdo, curtam, comentem e sigam outros cozinheiros.
> Por isso, a arquitetura precisa atender tanto ao núcleo de publicação e
> descoberta quanto às interações sociais e à moderação.

Apresente o objetivo da análise: organizar o domínio, propor uma comunicação
assíncrona confiável e avaliar o código com base nos princípios SOLID.

### 2. Visão do domínio — 2 minutos

**Material:** seção de domínio e bounded contexts em
[01-arquitetura-ddd.md](./01-arquitetura-ddd.md).

Explique a linguagem ubíqua:

- usuário, autor, receita e publicação;
- feed e descoberta;
- curtida, comentário e perfil.

Em seguida, apresente os cinco bounded contexts:

1. **Identidade e Acesso:** cadastro, autenticação, credenciais e permissões.
2. **Catálogo de Receitas:** publicação, edição, imagens e detalhes da receita.
3. **Comunidade:** perfis, seguimentos, curtidas e comentários.
4. **Descoberta:** busca e feeds, com possibilidade de projeção própria.
5. **Moderação:** denúncias, bloqueios, aprovação e auditoria.

**Fala de transição:**

> A divisão evita que um contexto precise conhecer a estrutura interna dos
> demais. Por exemplo, Comunidade e Catálogo podem referenciar um `userId`
> sem importar o agregado completo de Usuário.

### 3. Camadas e dependências — 1 minuto

Mostre a organização proposta em `shared`, `contexts` e
`composition-root`.

Destaque a regra:

```text
interfaces/http -> application -> domain
infrastructure  -> application/domain
composition-root -> todos os contextos
```

Explique que o domínio não deve depender de Express, Sequelize, bcrypt, JWT,
Multer, filesystem ou RabbitMQ. Esses detalhes entram por portas e
adaptadores, montados no composition root.

### 4. Comunicação orientada a eventos — 3 minutos

**Material:** [02-comunicacao-c4.md](./02-comunicacao-c4.md) e os diagramas
C4.

Comece pela motivação:

> Publicar uma receita pode atualizar o feed, o índice de busca, as
> notificações, a auditoria e a moderação. Essas tarefas não precisam bloquear
> a resposta HTTP, mas também não podem ser perdidas.

Apresente o fluxo:

1. `PublishRecipe` grava a receita e o evento na tabela Outbox na mesma
   transação MySQL.
2. O `OutboxPublisher` lê eventos pendentes e publica
   `recipe.published.v1` no RabbitMQ.
3. Consumidores independentes processam descoberta, notificações e moderação.
4. Cada consumidor confirma a mensagem somente após concluir o processamento.
5. Falhas passam por retry e, depois do limite, seguem para a DLQ.
6. O `eventId` garante idempotência em reentregas.

Use o contrato de evento para mostrar que a mensagem é versionada e contém
somente os dados necessários. Reforce que o frontend continua falando apenas
com a API HTTP e não acessa o broker.

**Pontos técnicos a mencionar:**

- RabbitMQ fornece filas duráveis, acknowledgement, retry e DLQ.
- A Outbox evita o problema de confirmar o banco e falhar antes de publicar o
  evento.
- Métricas importantes incluem idade da Outbox, profundidade das filas,
  retries, latência e mensagens na DLQ.

### 5. Inspeção SOLID do código atual — 3 minutos

**Material:** [03-analise-solid.md](./03-analise-solid.md).

Apresente os seis achados agrupados por impacto:

| Achado | Princípio | Síntese |
| --- | --- | --- |
| S1 | SRP | `recipeService` mistura banco, autorização, DTOs, contadores e arquivos. |
| S2 | SRP | `userService` mistura identidade, perfil, bcrypt e imagens. |
| S3 | DIP | Autenticação depende diretamente de bcrypt, Sequelize e JWT. |
| S4 | DIP | Receita depende diretamente de banco, Models e filesystem. |
| S5 | ISP | O controller importa um serviço amplo com operações que não usa. |
| S6 | OCP | `app.js` registra cada rota manualmente para cada novo módulo. |

Explique a prioridade:

1. S3 e S4 dificultam testes e futuras trocas de infraestrutura.
2. S1 e S2 concentram responsabilidades e aumentam o custo de manutenção.
3. S5 e S6 fazem o acoplamento crescer à medida que o sistema aumenta.

Esclareça que a análise propõe refatorações, mas não altera o backend atual:

> O objetivo desta entrega é diagnosticar e propor uma arquitetura evolutiva,
> preservando o comportamento externo do sistema.

### 6. Conclusão — 1 minuto

**Fala sugerida:**

> A proposta combina três decisões. Primeiro, DDD para separar as regras por
> contexto. Segundo, Outbox e RabbitMQ para executar efeitos secundários de
> forma assíncrona, confiável e observável. Terceiro, portas e adaptadores para
> reduzir o acoplamento apontado na análise SOLID.

Finalize com os benefícios esperados:

- regras de negócio mais isoladas e testáveis;
- menor acoplamento entre identidade, receitas e comunidade;
- publicação resiliente mesmo quando consumidores secundários falham;
- evolução independente de busca, notificações e moderação;
- possibilidade de trocar infraestrutura sem reescrever o domínio.

## Perguntas prováveis

### Por que usar RabbitMQ em vez de fazer tudo na requisição?

Porque busca, notificações, auditoria e moderação são efeitos secundários.
Processá-los de forma assíncrona reduz a latência e permite retry sem perder a
publicação principal.

### A Outbox resolve todos os problemas de consistência?

Não. Ela garante que a receita e o evento sejam registrados juntos no banco.
A entrega aos consumidores continua eventual, por isso são necessários
idempotência, retry, DLQ e observabilidade.

### Por que não transformar cada bounded context em um microserviço?

Bounded contexts são limites de responsabilidade e podem começar como
módulos no mesmo backend. A separação reduz acoplamento sem impor, desde já,
o custo operacional de vários serviços.

### A arquitetura proposta já está implementada?

Não integralmente. DDD, mensageria e refatorações SOLID são propostas
arquiteturais para orientar a evolução do backend atual. Os diagramas e
contratos tornam essa evolução verificável e incremental.
