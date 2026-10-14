-- verifica: o aviso da aula where (o SQLite aceita aspas duplas como texto)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Carla
-- Gabriela
SELECT nome FROM alunos WHERE cidade = "Recife";
