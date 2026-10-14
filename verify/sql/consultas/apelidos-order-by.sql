-- verifica: a aula apelidos (apelido no ORDER BY)
-- banco: escola
-- saida:
-- nome | pontos
-- Isadora | 100
-- Ana | 95
-- Elisa | 90
SELECT nome, nota * 10 AS pontos FROM alunos ORDER BY pontos DESC LIMIT 3;
