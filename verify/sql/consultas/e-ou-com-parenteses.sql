-- verifica: a aula e-ou (com parênteses)
-- banco: escola
-- saida:
-- nome
-- Carla
-- Fábio
-- Isadora
SELECT nome FROM alunos
WHERE (cidade = 'Recife' OR cidade = 'Salvador') AND idade = 18;
