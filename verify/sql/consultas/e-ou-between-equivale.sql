-- verifica: a aula e-ou (BETWEEN é o mesmo que >= e <=, em todas as linhas)
-- banco: escola
-- saida:
-- iguais
-- 10
SELECT count(*) AS iguais FROM alunos
WHERE (nota BETWEEN 7 AND 8) = (nota >= 7 AND nota <= 8);
