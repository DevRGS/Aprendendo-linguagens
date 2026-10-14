-- verifica: sql.introducao.q18 (DELETE apaga linhas: das 10, sobram 9)
-- banco: escola
-- saida:
-- restantes
-- 9
DELETE FROM alunos WHERE id = 1;
SELECT COUNT(*) AS restantes FROM alunos;
