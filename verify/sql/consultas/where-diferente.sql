-- verifica: sql.consultas.q05 e a tabela da aula where (<> e != significam diferente)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Diego
-- Gabriela
-- João
SELECT nome FROM alunos WHERE turma <> '1B' AND turma != '3A';
