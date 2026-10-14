-- verifica: sql.consultas.q33 ('' IS NULL é falso; NULL IS NULL é verdadeiro)
-- banco: vazio
-- saida:
-- vazio_e_null | null_e_null
-- 0 | 1
SELECT '' IS NULL AS vazio_e_null, NULL IS NULL AS null_e_null;
