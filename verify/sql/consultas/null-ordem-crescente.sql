-- verifica: sql.consultas.q22 e a aula null (NULL primeiro na ordem crescente)
-- banco: escola
-- saida:
-- email
-- NULL
-- NULL
-- NULL
-- ana@escola.br
SELECT email FROM alunos ORDER BY email LIMIT 4;
