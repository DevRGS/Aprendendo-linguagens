-- verifica: sql.consultas.q29 (com OR, toda nota passa: os 10 alunos)
-- banco: escola
-- saida:
-- alunos
-- 10
SELECT COUNT(*) AS alunos FROM alunos WHERE nota >= 7 OR nota <= 8;
