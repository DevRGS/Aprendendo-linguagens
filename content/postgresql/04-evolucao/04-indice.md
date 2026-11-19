# Experimentar um índice na mesma consulta

Compare a mesma leitura antes e depois do índice, mantendo dados e predicado. A amostra concentra milhares de linhas em outro aluno para tornar o filtro seletivo. ANALYZE tabela atualiza estatísticas; EXPLAIN ANALYZE consulta mede uma execução. Use BEGIN e desfaça ao terminar.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
INSERT INTO caderno.leituras(aluno_id,tema,minutos) SELECT 3,'Carga',5 FROM generate_series(1,5000);
ANALYZE caderno.leituras;
EXPLAIN (ANALYZE,BUFFERS) SELECT tema FROM caderno.leituras WHERE aluno_id=1;
CREATE INDEX leituras_por_aluno ON caderno.leituras(aluno_id);
ANALYZE caderno.leituras;
EXPLAIN (ANALYZE,BUFFERS) SELECT tema FROM caderno.leituras WHERE aluno_id=1;
ROLLBACK;
```

Os dois planos retornam as duas leituras de Ana. Compare nó, buffers e actual rows. O PostgreSQL pode optar por varredura sequencial, bitmap ou índice conforme os custos.

## 2. Investigue uma variação

Repita com 5 linhas extras em vez de 5000. Justifique uma possível varredura sequencial.

<details>
<summary>Conferir a variação</summary>

Em tabela curta, ler as poucas páginas diretamente pode custar menos que ir do índice à tabela. Aceite o plano real observado e anote a cardinalidade.

</details>

## 3. Resolva em outro caso

Repita com 5000 linhas e filtro aluno_id=3 nos dois planos. Compare a seletividade com o filtro de Ana.

<details>
<summary>Conferir a solução e o resultado</summary>

O predicado para Caio retorna 5000 linhas de 5003. Ele seleciona quase a tabela toda, diminuindo a vantagem esperada de visitar o índice. Registre a decisão medida.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/indexes-examine.html)
