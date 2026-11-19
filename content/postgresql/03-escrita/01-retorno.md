# Inserir e receber os valores gerados

O banco pode escolher id e valores padrão no INSERT. RETURNING devolve a linha que aquela escrita criou, evitando adivinhar a identidade a partir de uma contagem global. Experimente dentro de BEGIN e desfaça ao final.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
INSERT INTO caderno.leituras(aluno_id,tema,minutos) VALUES (3,'CSS',5)
RETURNING id,tema,feita;
ROLLBACK;
```

A linha retornada tem um id gerado, CSS e false. Sequências podem avançar mesmo com rollback, portanto o número exato varia.

## 2. Investigue uma variação

Retorne também a duração. Precisa fazer um segundo SELECT?

<details>
<summary>Conferir a variação</summary>

Acrescente minutos à lista RETURNING. O mesmo comando devolve 5.

</details>

## 3. Resolva em outro caso

Insira duas leituras numa única instrução e identifique as duas sem supor ids consecutivos.

<details>
<summary>Conferir a solução e o resultado</summary>

Dentro de BEGIN use INSERT INTO caderno.leituras(aluno_id,tema,minutos) VALUES (3,'A',5),(3,'B',8) RETURNING id,tema; e desfaça. O par id/tema identifica cada linha.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/dml-returning.html)
