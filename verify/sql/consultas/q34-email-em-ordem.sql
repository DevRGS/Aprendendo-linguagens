-- verifica: sql.consultas.q34 (a consulta montada roda: quem tem e-mail, em ordem de e-mail)
-- banco: escola
-- saida:
-- nome | email
-- Ana | ana@escola.br
-- Carla | carla@escola.br
-- Diego | diego@escola.br
-- Fábio | fabio@escola.br
-- Gabriela | gabi@escola.br
-- Isadora | isa@escola.br
-- João | joao@escola.br
SELECT nome, email
FROM alunos
WHERE email IS NOT NULL
ORDER BY email;
