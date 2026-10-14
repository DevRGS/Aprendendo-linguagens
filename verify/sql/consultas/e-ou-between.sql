-- verifica: sql.consultas.q10, f07 e a aula e-ou (BETWEEN inclui as pontas)
-- banco: escola
-- saida:
-- nome | nota
-- Carla | 8
-- Diego | 7.5
-- João | 7
SELECT nome, nota FROM alunos WHERE nota BETWEEN 7 AND 8;
