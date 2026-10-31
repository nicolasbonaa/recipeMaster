-- Atividade 11 - Teste 7: o banco recusa uma linha repetida em follows.
-- Rode no seu cliente de banco (Workbench/DBeaver/HeidiSQL) e tire o print (follows.jpg).
USE recipemaster;

-- 1) Estrutura e índices da tabela
SHOW CREATE TABLE follows;
SHOW INDEX FROM follows;

-- 2) Linhas atuais
SELECT * FROM follows ORDER BY id;

-- 3) Tenta repetir um par que já existe (pega o primeiro par da tabela).
--    Esperado: Error 1062 Duplicate entry '...' for key 'follows.idx_unique_follower_following'
INSERT INTO follows (follower_id, following_id, created_at, updated_at)
SELECT follower_id, following_id, NOW(), NOW() FROM follows ORDER BY id LIMIT 1;
