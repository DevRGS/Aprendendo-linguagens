-- verifica: a aula like (NOT LIKE fica com os que não combinam)
-- banco: loja
-- saida:
-- nome
-- Caneta azul
-- Garrafa térmica
-- Lápis
SELECT nome FROM produtos WHERE nome NOT LIKE '%o%';
