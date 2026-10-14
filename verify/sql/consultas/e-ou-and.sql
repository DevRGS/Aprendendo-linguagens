-- verifica: a aula e-ou (AND)
-- banco: escola
-- saida:
-- nome | cidade | nota
-- Ana | Recife | 9.5
-- Gabriela | Recife | 8.5
SELECT nome, cidade, nota FROM alunos
WHERE cidade = 'Recife' AND nota >= 8.5;
