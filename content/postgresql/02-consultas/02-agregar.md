# Contar leituras de cada aluno

Agrupe as linhas de uma junção pelo aluno para calcular um resultado por pessoa. COUNT sobre a chave da leitura ignora nulos; COUNT(*) também conta a linha preservada pela junção externa. Essa diferença aparece com alunos sem leituras.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
SELECT a.nome,count(l.id) AS quantidade FROM caderno.alunos a
LEFT JOIN caderno.leituras l ON l.aluno_id=a.id
GROUP BY a.id,a.nome ORDER BY a.id;
```

O relatório mostra Ana 2, Bia 1 e Caio 0.

## 2. Investigue uma variação

Substitua count(l.id) por count(*). Que linha muda?

<details>
<summary>Conferir a variação</summary>

Caio passa de 0 para 1 porque sua linha preservada continua no grupo.

</details>

## 3. Resolva em outro caso

Calcule a soma de minutos de cada aluno, exibindo zero para quem ainda não estudou.

<details>
<summary>Conferir a solução e o resultado</summary>

Use coalesce(sum(l.minutos),0) em lugar da contagem. Os resultados são 30, 10 e 0.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/functions-aggregate.html)
