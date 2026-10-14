-- verifica: sql.consultas.q08, f06 e a aula e-ou (sem parênteses, o AND vale antes)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Carla
-- Fábio
-- Gabriela
-- Isadora
SELECT nome FROM alunos
WHERE cidade = 'Recife' OR cidade = 'Salvador' AND idade = 18;
