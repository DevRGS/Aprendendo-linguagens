-- verifica: a aula null (IS NOT NULL traz os outros sete)
-- banco: escola
-- saida:
-- total
-- 7
SELECT count(*) AS total FROM alunos WHERE email IS NOT NULL;
