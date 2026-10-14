-- verifica: f11 e a aula ordenar (OFFSET pula linhas)
-- banco: loja
-- saida:
-- nome | preco
-- Estojo | 24.9
-- Carregador | 49.9
-- Garrafa térmica | 59.9
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3 OFFSET 3;
