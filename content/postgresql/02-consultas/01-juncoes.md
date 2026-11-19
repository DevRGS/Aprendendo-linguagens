# Relacionar alunos e leituras

Uma junção combina linhas comparando as chaves indicadas no ON. Comece pela tabela de alunos e use LEFT JOIN para preservar quem ainda não tem leituras. Ordene explicitamente a saída para poder conferir os resultados.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
SELECT a.nome,l.tema FROM caderno.alunos a
LEFT JOIN caderno.leituras l ON l.aluno_id=a.id
ORDER BY a.id,l.id;
```

O resultado contém Ana/Git, Ana/SQL, Bia/Git e Caio/NULL. A última linha tem uma coluna ausente do lado das leituras.

## 2. Investigue uma variação

Troque LEFT JOIN por INNER JOIN e conte as linhas.

<details>
<summary>Conferir a variação</summary>

Restam três linhas. Caio não tem correspondência e deixa de aparecer.

</details>

## 3. Resolva em outro caso

Liste apenas alunos sem leitura usando esta junção.

<details>
<summary>Conferir a solução e o resultado</summary>

Acrescente WHERE l.id IS NULL antes de ORDER BY. Com a carga inicial o único nome é Caio.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/tutorial-join.html)
