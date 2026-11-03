# Atividade 14 — Curls da Parte A

Bateria criada para esta atividade em `backend-recipemaster/scripts/teste-aula-14.ps1` (atalho nesta pasta: `curl-atividade14.ps1`).
O script cria três contas novas (A, B e C) e as receitas de que precisa, então não depende de ids fixos. A API precisa estar rodando.

```powershell
cd backend-recipemaster
npm run teste-aula-14
```

Na execução dos prints: A=1, B=2, C=3, receita de B=1, receita de A=2.

| # | Teste | Status recebido |
| --- | --- | --- |
| 1 | 1.1 Listar notificações sem token (401) | 401 |
| 2 | 1.2 unread-count sem token (401) | 401 |
| 3 | 1.3 Marcar como lida sem token (401) | 401 |
| 4 | 1.4 Denunciar sem token (401) | 401 |
| 5 | 2.1 A curte a receita de B (201) | 201 |
| 6 | 2.2 B tem 1 não lida (unreadCount 1) | 200 |
| 7 | 2.3 Lista de B: aviso com Actor (sem password/email/isAdmin) e a receita | 200 |
| 8 | 2.4 A curte a própria receita (201) | 201 |
| 9 | 2.5 A continua com 0 não lidas | 200 |
| 10 | 2.6 A descurte a receita de B (200) | 200 |
| 11 | 2.7 Descurtir apagou o aviso (unreadCount 0) | 200 |
| 12 | 2.8 A curte de novo (201) | 201 |
| 13 | 2.9 Só um aviso de curtida (unreadCount 1) | 200 |
| 14 | 3.1 C comenta na receita de B (201) | 201 |
| 15 | 3.2 B ganhou um aviso (unreadCount 2) | 200 |
| 16 | 3.3 B comenta na própria receita (201) | 201 |
| 17 | 3.4 B não ganhou aviso (unreadCount 2) | 200 |
| 18 | 4.1 A segue B (201) | 201 |
| 19 | 4.2 Lista de B: aviso follow com recipeId nulo | 200 |
| 20 | 4.3 A deixa de seguir B (200) | 200 |
| 21 | 4.4 Deixar de seguir apagou o aviso (unreadCount 2) | 200 |
| 22 | 4.5 A segue B de novo (201) | 201 |
| 23 | 4.6 Só um aviso de follow (unreadCount 3) | 200 |
| 24 | 5.1 Lista de B: a mais nova primeiro | 200 |
| 25 | 5.2 ?limit=1&page=2 (só a segunda) | 200 |
| 26 | 5.3 Página além do fim (lista vazia) | 200 |
| 27 | 5.4 ?page=abc&limit=-5 (padrões) | 200 |
| 28 | 5.5 B segue C (201) | 201 |
| 29 | 5.6 C vê só as dela (um follow de B) | 200 |
| 30 | 6.1 C marca a notificação 5 de B (403) | 403 |
| 31 | 6.2 Notificação inexistente (404) | 404 |
| 32 | 6.3 Id abc (400) | 400 |
| 33 | 6.4 B marca a 5 (200, unreadCount 2) | 200 |
| 34 | 6.5 B repete (200, mesmo unreadCount) | 200 |
| 35 | 6.6 unread-count reflete (2) | 200 |
| 36 | 6.7 A lista reflete (isRead true na mais nova) | 200 |
| 37 | 7.1 C denuncia a receita de B (201) | 201 |
| 38 | 7.2 C denuncia de novo (409) | 409 |
| 39 | 7.3 A denuncia a mesma receita (201) | 201 |
| 40 | 7.4 Sem reason (400) | 400 |
| 41 | 7.5 reason fora da lista (400) | 400 |
| 42 | 7.6 Rótulo em vez da chave (400) | 400 |
| 43 | 7.7 Id abc (400) | 400 |
| 44 | 7.8 Receita 99999 (404) | 404 |
| 45 | 7.9 O dono denunciando (400) | 400 |
| 46 | 7.10 O dono não ganhou notificação (unreadCount 2) | 200 |
| 47 | 9.1 B exclui a receita curtida, comentada e denunciada (200) | 200 |
| 48 | 9.2 Lista de B: só sobra o aviso de follow | 200 |
| 49 | 10. Logout com corpo "null" (400 COM Access-Control-Allow-Origin) | 400 |
| 50 | 10.2 Logout sem corpo (200) | 200 |
| 51 | 11.1 Curtir (201) | 201 |
| 52 | 11.2 Descurtir (200) | 200 |
| 53 | 11.3 Comentar (201) | 201 |
| 54 | 11.4 Upload (201) e edição (200) | 200 |
| 55 | 11.5 Seguidores de A | 200 |
| 56 | 11.6 Quem A segue | 200 |
| 57 | 11.7 Minhas coleções | 200 |
| 58 | 11.8 Busca | 200 |
| 59 | 11.9 Feed | 200 |
| 60 | 11.10 Feed Seguindo | 200 |
| 61 | 11.11 GET /users/abc/followers (400) | 400 |

O teste 8 da Etapa 5 (no banco: linha repetida em `reports` e motivo fora do `ENUM`) está em `banco-notificacoes.jpg`.
A parte de banco do teste 9 (sem linhas da receita e sem notificações órfãs) aparece nos testes de controle (`controle-reports.jpg`, `controle-orfa.jpg`).

Todos os testes foram mantidos como estão no script e responderam o status esperado nesta execução.
