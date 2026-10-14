-- verifica: a aula apelidos (o SQLite também aceita aspas simples num apelido com espaço)
-- banco: escola
-- saida:
-- Nome do aluno
-- Ana
SELECT nome AS 'Nome do aluno' FROM alunos LIMIT 1;
