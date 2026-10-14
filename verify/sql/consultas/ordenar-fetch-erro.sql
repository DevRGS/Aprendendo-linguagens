-- verifica: a nota da aula ordenar (o SQLite não aceita FETCH FIRST)
-- banco: loja
-- espera: erro
SELECT nome FROM produtos ORDER BY preco FETCH FIRST 3 ROWS ONLY;
