# Atividade 13 — Curls da Parte A

Bateria executada com o script `backend-recipemaster/scripts/teste-aula-13.ps1` (wrapper nesta pasta: `curl-atividade13.ps1`).
A conta A (`anacosta`) e a conta B (`brunolima`) são passadas por token; a receita 1 é de B e a coleção 1 é a primeira criada pela conta A no próprio script.

```powershell
npm run teste-aula-13 -- -TokenA "<token A>" -TokenB "<token B>" -RecipeId 1 -CollectionId 1
```

| # | Teste | Status recebido | Print |
| --- | --- | --- | --- |
| 1 | Criar sem token | 401 | `curl-teste1.jpg` |
| 2 | Título curto (`ab`) | 400 | `curl-teste2.jpg` |
| 3 | Título só com espaços | 400 | `curl-teste3.jpg` |
| 4 | `isPublic: "sim"` | 400 | `curl-teste4.jpg` |
| 5 | Criar privada (sem `isPublic`) | 201 (`isPublic: false`) | `curl-teste5.jpg` |
| 6 | Criar pública | 201 (`isPublic: true`) | `curl-teste6.jpg` |
| 7 | Listar minhas coleções (mais nova primeiro) | 200 | `curl-teste7.jpg` |
| 8 | Adicionar receita | 201 (`added: true`, contador 1) | `curl-teste8.jpg` |
| 9 | Repetir adição | 200 (`added: false`, contador 1) | `curl-teste9.jpg` |
| 10 | Adicionar receita inexistente | 404 | `curl-teste10.jpg` |
| 11 | Adicionar com `"abc"` | 400 | `curl-teste11.jpg` |
| 12 | Status das coleções da receita | 200 (`hasRecipe`) | `curl-teste12.jpg` |
| 13 | "Coleção pública sem token" | **403** — a coleção 1 criada pelo script é a privada | `curl-teste13.jpg` |
| 14 | Coleção privada vista pela conta B | 403 | `curl-teste14.jpg` |
| 15 | Remover receita | 200 (contador desce) | `curl-teste15.jpg` |
| 16 | Remover novamente | 404 | `curl-teste16.jpg` |
| 17 | Coleção 99999 | 404 | `curl-teste17.jpg` |
| 18 | Coleção `abc` | 400 | `curl-teste18.jpg` |
| 19 | Busca sem termo | 200 (listas vazias) | `curl-teste19.jpg` |
| 20 | Busca com uma letra | 200 (listas vazias) | `curl-teste20.jpg` |
| 21 | Busca `%%` | 200 (listas vazias) | `curl-teste21.jpg` |
| 22 | Busca `bolo` | 200 (receitas com autor) | `curl-teste22.jpg` |
| 23 | Busca `?q=ab&q=cd` | 200 (listas vazias, sem 500) | `curl-teste23.jpg` |
| 24 | Regressão `GET /feed` | 200 | `curl-teste24.jpg` |
| 25 | Regressão `GET /users/abc/followers` | 400 | `curl-teste25.jpg` |

Os testes foram mantidos exatamente como estão no script; o teste 13 foi enviado com o resultado que deu (403), sem ajuste.
