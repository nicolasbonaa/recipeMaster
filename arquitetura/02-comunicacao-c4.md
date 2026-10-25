# Questão 2 — Camada de comunicação orientada a eventos

## 1. Necessidade de negócio

A publicação de uma receita é o ponto de maior valor para a comunidade, mas
também pode disparar tarefas que não precisam atrasar a resposta HTTP:

- atualizar o feed e o índice de busca;
- notificar seguidores do autor;
- registrar auditoria e encaminhar conteúdo para moderação;
- recalcular métricas e recomendações.

Executar tudo dentro da requisição de publicação aumenta latência e acoplamento.
Se o índice ou o serviço de notificações ficar indisponível, a publicação não
deve ser perdida nem falhar por uma função secundária. Eventos de domínio
permitem processamento assíncrono, retry e evolução independente dos módulos.

## 2. Fluxo proposto

1. `PublishRecipe` valida o agregado e persiste a receita e um registro
   `outbox_events` na mesma transação MySQL.
2. Um publicador lê eventos pendentes da Outbox e publica
   `recipe.published.v1` no RabbitMQ.
3. Consumidores independentes processam o evento:
   `DiscoveryProjection`, `Notification` e `Moderation`.
4. Cada consumidor confirma somente após concluir o processamento. Falhas são
   reprocessadas com backoff e, após o limite, encaminhadas à DLQ.
5. Consumidores usam `eventId` como chave de idempotência.

## 3. Escolhas técnicas

| Decisão | Justificativa |
| --- | --- |
| RabbitMQ | Broker maduro, filas duráveis, acknowledgements, retry e DLQ |
| Eventos JSON versionados | Integração simples entre módulos Node.js e evolução compatível |
| Outbox transacional em MySQL | Evita o dual-write: receita e evento são confirmados juntos |
| `eventId` + tabela de consumo | Reentrega não duplica projeções nem notificações |
| Routing key por evento | Permite novos consumidores sem modificar o produtor |
| DLQ e observabilidade | Falhas persistentes ficam visíveis para operação e correção |

O broker não substitui o banco transacional. A publicação é eventual e os
consumidores devem tolerar eventos fora de ordem, duplicados e reentregues.

## 4. Contrato de evento

```json
{
  "eventId": "uuid",
  "eventType": "recipe.published.v1",
  "occurredAt": "2026-10-29T12:00:00.000Z",
  "aggregate": {
    "type": "Recipe",
    "id": 42
  },
  "payload": {
    "recipeId": 42,
    "authorId": 7,
    "title": "Pão de queijo",
    "image": "recipe-7-uuid.jpg"
  },
  "metadata": {
    "correlationId": "uuid",
    "schemaVersion": 1
  }
}
```

## 5. Limites e segurança

- O evento não contém senha, token ou dados pessoais desnecessários.
- O consumidor valida `eventType`, versão e campos obrigatórios.
- O acesso ao RabbitMQ usa credenciais fora do código e TLS em produção.
- A fila possui limite de tamanho, TTL de mensagens e DLQ monitorada.
- Métricas mínimas: idade da Outbox, taxa de erro, retries, profundidade da
  fila, latência de consumo e mensagens na DLQ.

## 6. Diagramas

Os arquivos `.mmd` desta pasta são a fonte editável dos diagramas C4. Eles
podem ser renderizados com Mermaid/mermaid-cli ou visualizados em editores que
suportem Mermaid.

### C4 nível 1 — contexto

O usuário publica e consulta receitas pela API. A API publica eventos para os
processadores assíncronos, que atualizam descoberta, notificações e moderação.

### C4 nível 2 — contêineres

O sistema é separado em API, MySQL/Outbox, broker e consumidores. O frontend
continua consumindo a API HTTP; não acessa o broker.

### C4 nível 3 — componentes da comunicação

Dentro da API ficam o caso de uso, o repositório transacional e o escritor da
Outbox. O publicador e os consumidores implementam retry, idempotência e DLQ.
