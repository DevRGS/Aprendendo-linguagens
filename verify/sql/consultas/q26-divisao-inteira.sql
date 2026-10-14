-- verifica: sql.consultas.q26 (7 / 2 dá 3; 7 / 2.0 dá 3.5)
-- banco: vazio
-- saida:
-- inteiros | com_ponto
-- 3 | 3.5
SELECT 7 / 2 AS inteiros, 7 / 2.0 AS com_ponto;
