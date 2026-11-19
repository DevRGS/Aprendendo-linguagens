# Interpretar o plano de uma consulta

EXPLAIN mostra como o planejador pretende executar uma consulta. ANALYZE dentro de EXPLAIN pede que ela seja executada e inclui as linhas observadas. Leia o nome da operação, a condição e as estimativas antes de olhar o tempo. Custos não são milissegundos.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT tema FROM caderno.leituras WHERE aluno_id=1;
```

Na carga inicial a consulta retorna duas linhas ao executor do plano. Procure actual rows e o filtro ou condição do índice. O nó escolhido e os tempos dependem do ambiente.

## 2. Investigue uma variação

Repita a consulta só com EXPLAIN, sem ANALYZE, e compare os campos.

<details>
<summary>Conferir a variação</summary>

A versão simples mostra estimativas. Os dados de execução como actual time e actual rows deixam de aparecer.

</details>

## 3. Resolva em outro caso

Confira que a cardinalidade observada corresponde ao conjunto real para aluno_id=3.

<details>
<summary>Conferir a solução e o resultado</summary>

Execute o plano para o aluno 3 em carga limpa e SELECT count(*) com o mesmo filtro. A contagem é zero e o nó que produz a saída retorna zero linhas.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/sql-explain.html)
