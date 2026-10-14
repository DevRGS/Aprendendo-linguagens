-- verifica: sql.consultas.q30 (no SQLite, '%A' dá o mesmo resultado, por isso a lacuna aceita maiúscula)
-- banco: loja
-- saida:
-- nome
-- Mochila
-- Garrafa térmica
SELECT nome FROM produtos WHERE nome LIKE '%A';
