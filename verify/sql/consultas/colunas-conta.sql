-- verifica: sql.consultas.q02 e a aula colunas (conta no SELECT; o nome da coluna é a conta)
-- banco: escola
-- saida:
-- nome | idade | idade + 1
-- Ana | 17 | 18
-- Bruno | 16 | 17
-- Carla | 18 | 19
SELECT nome, idade, idade + 1 FROM alunos LIMIT 3;
