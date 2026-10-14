-- verifica: a explicação do sql.consultas.d12 (um texto vazio é um valor: <> '' o deixa de fora, IS NOT NULL não)
-- banco: dados-ocultos:escola
-- saida:
-- nao_nulos | diferentes_de_vazio
-- 9 | 8
SELECT (SELECT COUNT(*) FROM alunos WHERE email IS NOT NULL) AS nao_nulos,
       (SELECT COUNT(*) FROM alunos WHERE email <> '') AS diferentes_de_vazio;
