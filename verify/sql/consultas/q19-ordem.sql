-- verifica: sql.consultas.q19 (a ordem montada roda)
-- banco: escola
-- saida:
-- nome | nota
-- Ana | 9.5
-- Gabriela | 8.5
SELECT nome, nota
FROM alunos
WHERE turma = '2A'
ORDER BY nota DESC
LIMIT 2;
