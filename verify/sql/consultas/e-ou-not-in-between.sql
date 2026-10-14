-- verifica: a aula e-ou (NOT IN e NOT BETWEEN)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Fábio
-- Isadora
SELECT nome FROM alunos
WHERE cidade NOT IN ('Natal', 'Fortaleza') AND nota NOT BETWEEN 7 AND 9;
