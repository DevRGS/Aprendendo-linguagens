-- verifica: f13 e a aula apelidos (AS)
-- banco: escola
-- saida:
-- aluno | idade_ano_que_vem
-- Ana | 18
-- Bruno | 17
-- Carla | 19
SELECT nome AS aluno, idade + 1 AS idade_ano_que_vem FROM alunos LIMIT 3;
