-- verifica: f11 e a aula ordenar (os 3 mais baratos)
-- banco: loja
-- saida:
-- nome | preco
-- Lápis | 1.2
-- Caneta azul | 2.5
-- Caderno | 18.9
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3;
