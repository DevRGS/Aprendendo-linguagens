# Combinando condições

## AND, OR e NOT

- `AND`: as **duas** condições precisam ser verdadeiras.
- `OR`: basta **uma** delas.
- `NOT`: inverte a condição.

```sql
SELECT nome, cidade, nota FROM alunos
WHERE cidade = 'Recife' AND nota >= 8.5;
```

| nome | cidade | nota |
|---|---|---|
| Ana | Recife | 9.5 |
| Gabriela | Recife | 8.5 |

`WHERE NOT cidade = 'Natal'` lista todos os alunos, menos os de Natal.

## Cuidado com AND e OR juntos

Sem parênteses, o `AND` é avaliado **antes** do `OR`, como a multiplicação antes da soma:

```sql
-- A ideia: alunos de Recife ou de Salvador que têm 18 anos
SELECT nome FROM alunos
WHERE cidade = 'Recife' OR cidade = 'Salvador' AND idade = 18;
```

O banco lê essa condição como `cidade = 'Recife' OR (cidade = 'Salvador' AND idade = 18)` e traz **todos** os alunos de Recife, de qualquer idade:

| nome |
|---|
| Ana |
| Carla |
| Fábio |
| Gabriela |
| Isadora |

Com parênteses, a condição fica como se queria:

```sql
SELECT nome FROM alunos
WHERE (cidade = 'Recife' OR cidade = 'Salvador') AND idade = 18;
```

| nome |
|---|
| Carla |
| Fábio |
| Isadora |

> [!TIP]
> Na dúvida, coloque parênteses. Eles nunca atrapalham e deixam a intenção clara para quem lê.

## IN: um valor de uma lista

```sql
SELECT nome, cidade FROM alunos WHERE cidade IN ('Natal', 'Fortaleza');
```

| nome | cidade |
|---|---|
| Bruno | Natal |
| Diego | Fortaleza |
| Elisa | Natal |
| Heitor | Fortaleza |
| João | Natal |

`IN ('Natal', 'Fortaleza')` equivale a `cidade = 'Natal' OR cidade = 'Fortaleza'`.

## BETWEEN: uma faixa de valores

```sql
SELECT nome, nota FROM alunos WHERE nota BETWEEN 7 AND 8;
```

| nome | nota |
|---|---|
| Carla | 8 |
| Diego | 7.5 |
| João | 7 |

`BETWEEN` **inclui as pontas**: as notas 7 e 8 entram. É o mesmo que `nota >= 7 AND nota <= 8`.

Também existem `NOT IN` e `NOT BETWEEN`, que fazem o contrário.
