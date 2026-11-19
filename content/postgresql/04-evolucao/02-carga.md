# Popular dados fictícios de forma repetível

Uma carga repetível fornece dados conhecidos para consultas e testes. generate_series produz uma sequência de números que um INSERT SELECT pode transformar em linhas. Faça a experiência em transação para manter o conjunto pequeno das outras aulas.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
INSERT INTO caderno.leituras(aluno_id,tema,minutos)
SELECT 3,'Série ' || n,5 FROM generate_series(1,100) AS dados(n);
SELECT count(*) FROM caderno.leituras WHERE aluno_id=3;
ROLLBACK;
```

Caio tem 100 leituras durante a experiência e volta a zero depois. Os ids internos podem ter lacunas depois de desfazer a carga.

## 2. Investigue uma variação

Faça uma carga com 12 linhas e duração crescente de 1 até 12.

<details>
<summary>Conferir a variação</summary>

Use SELECT 3,'Série ' || n,n FROM generate_series(1,12) AS dados(n); no INSERT. O máximo dos minutos do aluno 3 será 12.

</details>

## 3. Resolva em outro caso

Crie 20 registros e confira sem consultar id máximo quantas linhas foram geradas.

<details>
<summary>Conferir a solução e o resultado</summary>

Execute a demo com generate_series(1,20), usando count(*) WHERE aluno_id=3 antes do rollback. O resultado deve ser 20 em carga limpa.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/functions-srf.html)
