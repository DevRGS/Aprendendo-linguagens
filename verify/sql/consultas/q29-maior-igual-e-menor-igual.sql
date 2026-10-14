-- verifica: sql.consultas.q29 (>= 7 AND <= 8 dá o mesmo que o BETWEEN)
-- banco: escola
-- saida:
-- nome
-- Carla
-- Diego
-- João
SELECT nome FROM alunos WHERE nota >= 7 AND nota <= 8;
