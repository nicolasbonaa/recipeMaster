# Curls da Parte A

Use `BASE_URL=http://localhost:3000`, `TOKEN_A`, `TOKEN_B` e `RECIPE_ID` conforme o ambiente de teste.

## Curtidas

```powershell
curl.exe -X POST "$env:BASE_URL/api/recipes/$env:RECIPE_ID/toggle-like" -H "Authorization: Bearer $env:TOKEN_B"
curl.exe -X POST "$env:BASE_URL/api/recipes/$env:RECIPE_ID/toggle-like" -H "Authorization: Bearer $env:TOKEN_B"
curl.exe -X GET "$env:BASE_URL/api/recipes/$env:RECIPE_ID/like-status"
curl.exe -X GET "$env:BASE_URL/api/recipes/$env:RECIPE_ID/like-status" -H "Authorization: Bearer $env:TOKEN_B"
curl.exe -X GET "$env:BASE_URL/api/recipes/$env:RECIPE_ID" -H "Authorization: Bearer $env:TOKEN_B"
curl.exe -X GET "$env:BASE_URL/api/liked-recipes" -H "Authorization: Bearer $env:TOKEN_B"
```

## Comentários

```powershell
curl.exe -X POST "$env:BASE_URL/api/recipes/$env:RECIPE_ID/comments" -H "Authorization: Bearer $env:TOKEN_B" -H "Content-Type: application/json" -d '{"content":"  comentário aparado  "}'
curl.exe -X GET "$env:BASE_URL/api/recipes/$env:RECIPE_ID/comments"
```

## Casos de erro

```powershell
curl.exe -X POST "$env:BASE_URL/api/recipes/$env:RECIPE_ID/toggle-like"
curl.exe -X POST "$env:BASE_URL/api/recipes/999999/toggle-like" -H "Authorization: Bearer $env:TOKEN_B"
curl.exe -X POST "$env:BASE_URL/api/recipes/$env:RECIPE_ID/comments" -H "Authorization: Bearer $env:TOKEN_B" -H "Content-Type: application/json" -d '{"content":"   "}'
curl.exe -X POST "$env:BASE_URL/api/recipes/999999/comments" -H "Authorization: Bearer $env:TOKEN_B" -H "Content-Type: application/json" -d '{"content":"teste"}'
```
