# Filtrar grupos depois da agregação

WHERE decide quais linhas entram no agrupamento. HAVING aplica uma condição sobre o resultado de cada grupo. Para exigir pelo menos duas leituras, conte as linhas por aluno e compare a contagem em HAVING.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
SELECT aluno_id,count(*) AS qtd FROM caderno.leituras
GROUP BY aluno_id HAVING count(*) >= 2 ORDER BY aluno_id;
```

Apenas o aluno 1 aparece com 2 leituras.

## 2. Investigue uma variação

Mude o limite para pelo menos uma leitura. Quem aparece?

<details>
<summary>Conferir a variação</summary>

Os alunos 1 e 2 aparecem, com 2 e 1. Caio continua ausente porque a origem é a tabela de leituras.

</details>

## 3. Resolva em outro caso

Antes de agrupar, considere só leituras feitas. Mostre alunos com pelo menos uma e a contagem.

<details>
<summary>Conferir a solução e o resultado</summary>

Adicione WHERE feita antes de GROUP BY e use HAVING count(*) >= 1. Os alunos 1 e 2 aparecem com uma leitura feita cada.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/tutorial-agg.html)
