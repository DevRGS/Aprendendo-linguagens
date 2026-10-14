-- verifica: a aula null (as primeiras linhas de nome e email)
-- banco: escola
-- saida:
-- nome | email
-- Ana | ana@escola.br
-- Bruno | NULL
-- Carla | carla@escola.br
SELECT nome, email FROM alunos LIMIT 3;
