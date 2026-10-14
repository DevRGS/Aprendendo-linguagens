-- verifica: sql.consultas.q32 (LIMIT 3 OFFSET 3 pula 3 e pega os 3 seguintes)
-- banco: loja
-- saida:
-- nome | preco
-- Estojo | 24.9
-- Carregador | 49.9
-- Garrafa térmica | 59.9
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3 OFFSET 3;
