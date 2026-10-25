# Avaliação N2 — Arquitetura do RecipeMaster

Esta pasta contém a entrega da avaliação de Projeto e Arquitetura de Software
solicitada no enunciado da N2 (29/10/2026).

## Domínio de aplicação

O RecipeMaster é uma plataforma social de receitas culinárias. Usuários podem
criar uma conta, autenticar-se, publicar receitas com imagens, consultar o
feed, buscar conteúdo, curtir receitas, comentar e acompanhar outros
cozinheiros. O sistema também mantém perfis públicos e recursos de
administração/moderação. O domínio central é a publicação e a descoberta de
receitas, com interações sociais que aumentam a relevância e a circulação do
conteúdo.

## Entregas

1. [Arquitetura DDD](./01-arquitetura-ddd.md) — organização proposta por
   domínios, bounded contexts, camadas e responsabilidades.
2. [Arquitetura de comunicação C4](./02-comunicacao-c4.md) — camada de
   mensageria, justificativas de negócio, decisões técnicas e diagramas C4.
3. [Análise SOLID](./03-analise-solid.md) — metodologia reproduzível, seis
   achados fundamentados no código atual e sugestões de refatoração.
4. [Relatório consolidado](./relatorio-n2.md) — versão contínua para leitura e
   exportação em PDF.
5. [Relatório em PDF](./relatorio-n2.pdf) — arquivo pronto para publicação na
   atividade do Teams.

Os diagramas editáveis estão em:

- [C4-contexto.mmd](./C4-contexto.mmd)
- [C4-containers.mmd](./C4-containers.mmd)
- [C4-componentes-mensageria.mmd](./C4-componentes-mensageria.mmd)

## Escopo e premissas

- A análise foi feita sobre `backend-recipemaster` no estado encontrado no
  repositório.
- A avaliação pede propostas de refatoração; por isso, a arquitetura DDD e a
  mensageria são especificações e não introduzem dependências no backend atual.
- A proposta usa RabbitMQ como broker, MySQL como banco já existente e o padrão
  Outbox para evitar perda de eventos. A tecnologia pode ser substituída por
  outro broker que preserve as garantias descritas.
