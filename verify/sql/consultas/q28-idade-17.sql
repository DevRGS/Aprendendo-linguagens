-- verifica: sql.consultas.q28 (a consulta montada roda e traz os alunos com 17 anos)
-- banco: escola
-- saida:
-- nome | idade
-- Ana | 17
-- Diego | 17
-- Gabriela | 17
-- João | 17
SELECT nome, idade
FROM alunos
WHERE idade = 17;
