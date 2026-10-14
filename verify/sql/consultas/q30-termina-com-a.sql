-- verifica: sql.consultas.q30 ('%a': Mochila e Garrafa térmica)
-- banco: loja
-- saida:
-- nome
-- Mochila
-- Garrafa térmica
SELECT nome FROM produtos WHERE nome LIKE '%a';
