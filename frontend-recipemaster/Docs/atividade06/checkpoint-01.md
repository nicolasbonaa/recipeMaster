# Atividade 06 - Checkpoint 01

## Revisao de consistencia do back-end

Analisei lado a lado os modulos `user` e `search` existentes.

- **Rotas com logica de negocio:** o modulo `user` declara verbo, caminho, middlewares e controller. A rota de busca tambem declara apenas o caminho e o controller, mas ainda nao possui `authenticate` e `asyncHandler`; como o servico de busca e sincrono e esta em formato de stub, nao ha uma chamada async nesta rota.
- **Controller consultando Model diretamente:** nao. Os controllers de usuario chamam `UserService`, e o controller de busca chama `searchService`.
- **Service referenciando `req` ou `res`:** nao. Os services recebem apenas dados e identificadores, mantendo a separacao da camada HTTP.
- **Uso de `success()` / `error()`:** os controllers usam `success()` para respostas de sucesso. O tratamento de erros fica centralizado no `errorHandler`, acionado pelo `asyncHandler`; nao ha resposta de erro duplicada nos controllers.
- **Rotas async envolvidas por `asyncHandler`:** sim nas rotas de usuario. A rota de busca nao chama funcao async atualmente, mas precisa ser revisada quando a busca real for implementada.
- **Validacao de entrada:** o registro e a atualizacao de perfil usam `express-validator` em `userValidator.js`. A busca usa apenas o valor de `q` como filtro do stub e ainda nao tem validador dedicado.
- **Constantes:** `config/constants.js` concentra os limites de validacao. O limite `BIO_MAX` e consumido pelo `profileUpdateValidator`, no modulo de usuario.
- **Limite da bio:** e usado uma vez no validador de atualizacao de perfil, exatamente no lugar da validacao de entrada.

## Conclusao

O modulo de usuario preserva o padrao Route -> Controller -> Service -> Model. Nenhum codigo novo foi adicionado ao back-end nesta atividade. A observacao sobre a busca fica registrada como pendencia para a aula em que a busca real for implementada, sem criar links ou funcionalidades que ainda nao existem.