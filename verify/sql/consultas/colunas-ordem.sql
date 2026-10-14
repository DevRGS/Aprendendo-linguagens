-- verifica: f01 e a aula colunas (a ordem do SELECT é a ordem do resultado)
-- banco: escola
-- saida:
-- turma | nome
-- 2A | Ana
-- 1B | Bruno
SELECT turma, nome FROM alunos LIMIT 2;
