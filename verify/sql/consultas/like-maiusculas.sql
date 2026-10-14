-- verifica: a nota da aula like (sem acento não diferencia; com acento, diferencia)
-- banco: vazio
-- saida:
-- sem_acento | acentuada
-- 1 | 0
SELECT 'Caderno' LIKE 'ca%' AS sem_acento, 'Ábaco' LIKE 'á%' AS acentuada;
