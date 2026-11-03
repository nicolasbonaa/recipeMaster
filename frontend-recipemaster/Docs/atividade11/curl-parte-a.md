# Curls da Parte A — Atividade 11

Os comandos abaixo são os requests executados pelo script
[teste-aula-11.ps1](../../../backend-recipemaster/scripts/teste-aula-11.ps1).
O script cria contas temporárias A, B, C e D, obtém os tokens via login e
executa os requests reais sem deixar tokens fixos na documentação.

## Preparação

```powershell
curl.exe -X POST "$BASE/register" -H "Content-Type: application/json" --data-binary "@register.json"
curl.exe -X POST "$BASE/login" -H "Content-Type: application/json" --data-binary "@login.json"
curl.exe -X POST "$BASE/recipes" -H "Authorization: Bearer <TOKEN_B>" `
  -F "title=Receita do B" -F "description=Receita publicada pela conta B" -F "image=@povao.png"
```

## Teste 1 — erros do toggle-follow

```powershell
curl.exe -X POST "$BASE/users/<B_ID>/toggle-follow"
curl.exe -X POST "$BASE/users/abc/toggle-follow" -H "Authorization: Bearer <TOKEN_A>"
curl.exe -X POST "$BASE/users/<A_ID>/toggle-follow" -H "Authorization: Bearer <TOKEN_A>"
curl.exe -X POST "$BASE/users/999999/toggle-follow" -H "Authorization: Bearer <TOKEN_A>"
```

Esperados: `401`, `400`, `400` e `404`.

## Teste 2 — alternância

```powershell
curl.exe -X POST "$BASE/users/<B_ID>/toggle-follow" -H "Authorization: Bearer <TOKEN_A>"
curl.exe -X POST "$BASE/users/<B_ID>/toggle-follow" -H "Authorization: Bearer <TOKEN_A>"
curl.exe -X POST "$BASE/users/<B_ID>/toggle-follow" -H "Authorization: Bearer <TOKEN_A>"
curl.exe -X POST "$BASE/users/<B_ID>/toggle-follow" -H "Authorization: Bearer <TOKEN_C>"
curl.exe -X POST "$BASE/users/<A_ID>/toggle-follow" -H "Authorization: Bearer <TOKEN_B>"
```

Esperados: `201`, `200`, `201`, `201` e `201`.

## Teste 3 — contadores

```powershell
curl.exe "$BASE/profile/<B_USERNAME>"
curl.exe "$BASE/profile/<A_USERNAME>"
curl.exe "$BASE/profile/<C_USERNAME>"
```

## Teste 4 — status e isFollowing

```powershell
curl.exe "$BASE/users/<B_ID>/follow-status" -H "Authorization: Bearer <TOKEN_A>"
curl.exe "$BASE/profile/<B_USERNAME>" -H "Authorization: Bearer <TOKEN_A>"
curl.exe "$BASE/profile/<B_USERNAME>"
curl.exe "$BASE/profile/<B_USERNAME>" -H "Authorization: Bearer <TOKEN_B>"
```

## Teste 5 — listas públicas

```powershell
curl.exe "$BASE/users/<B_ID>/followers"
curl.exe "$BASE/users/<A_ID>/following"
curl.exe "$BASE/users/999999/followers"
```

Esperados: `200`, `200` e `404`.

## Teste 6 — feed filtrado

```powershell
curl.exe "$BASE/following-recipes"
curl.exe "$BASE/following-recipes" -H "Authorization: Bearer <TOKEN_A>"
curl.exe "$BASE/following-recipes?page=2&limit=1" -H "Authorization: Bearer <TOKEN_A>"
curl.exe "$BASE/following-recipes" -H "Authorization: Bearer <TOKEN_D>"
```

Esperados: `401`, `200`, `200` com `[]` na segunda página e `200` com `[]`
para D.

## Teste 7 — índice único

```sql
INSERT INTO follows (follower_id, following_id)
VALUES (<A_ID>, <B_ID>);
```

A segunda inserção do mesmo par deve ser recusada pelo índice único. O SQL
completo está em [follows-duplicado.sql](./follows-duplicado.sql).

## Teste 8 — regressão

```powershell
curl.exe "$BASE/feed?limit=2" -H "Authorization: Bearer <TOKEN_A>"
```
