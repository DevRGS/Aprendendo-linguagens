-- verifica: sql.introducao.q07 (listar as colunas na ordem da tabela dá o mesmo que *)
-- banco: escola
-- saida:
-- diferencas
-- 0
SELECT count(*) AS diferencas FROM (
  SELECT * FROM alunos
  EXCEPT
  SELECT id, nome, idade, cidade, turma, nota, email FROM alunos
);
