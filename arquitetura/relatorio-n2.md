# Avaliação N2 — Projeto e Arquitetura de Software

## RecipeMaster

**Domínio:** plataforma social de receitas culinárias para publicação,
descoberta e interação entre cozinheiros. Usuários criam perfis, publicam
receitas com imagens, consultam feeds, curtem e comentam conteúdo e podem
acompanhar outros usuários; a administração apoia moderação.

Este relatório consolida:

1. [Arquitetura DDD](./01-arquitetura-ddd.md);
2. [Camada de comunicação e modelo C4](./02-comunicacao-c4.md);
3. [Inspeção SOLID](./03-analise-solid.md).

Consulte os documentos vinculados para a descrição completa, diagramas,
contratos de evento, evidências com linhas do código e propostas de
refatoração.

## Conclusão

A separação por bounded contexts reduz o acoplamento entre identidade,
catálogo, comunidade, descoberta e moderação. A Outbox com RabbitMQ acrescenta
comunicação assíncrona confiável sem tornar o frontend dependente do broker. A
inspeção identificou seis oportunidades concretas de melhoria nos princípios
SRP, OCP, ISP e DIP, com mudanças propostas que preservam o comportamento
externo e isolam detalhes de infraestrutura.
