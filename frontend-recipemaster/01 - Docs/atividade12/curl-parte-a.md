# Atividade 12 — Curls da Parte A

Os comandos abaixo são executados pelo script `backend-recipemaster/scripts/teste-aula-12.ps1`
e pelo wrapper `curl-atividade12.ps1`. O script cria contas temporárias e remove os arquivos
JSON temporários ao terminar.

```powershell
npm run teste-aula-12
```

Casos cobertos:

```text
GET    /api/                                      200
POST   /api/register                              201
POST   /api/login                                 200
POST   /api/recipes                               201
GET    /api/feed?limit=-3                         200 (limite normalizado)
GET    /api/feed?limit=100000                     200 (teto de 50)
GET    /api/feed?page=-2&limit=2                  200 (página normalizada)
GET    /api/following-recipes sem token           401
GET    /api/profile/:username                     200
GET    /api/users/:id/followers                   200
GET    /api/users/:id/following                   200
GET    /api/liked-recipes                         200
GET    /api/recipes/999999/comments               404
GET    /api/my-recipes                            200
```

Resultado real da última execução: **16 verificações aprovadas; 0 falhas**.
