# Escolher tipos para duração e estado

Use integer para minutos inteiros, text para nomes e boolean para um estado lógico. A escolha afeta as operações disponíveis e o formato do resultado. A função pg_typeof mostra o tipo que o servidor atribui à expressão.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
SELECT pg_typeof(minutos), pg_typeof(tema), pg_typeof(feita)
FROM caderno.leituras WHERE id=1;
```

A linha informa integer, text e boolean.

## 2. Investigue uma variação

Selecione minutos + 5 e NOT feita para a leitura 1.

<details>
<summary>Conferir a variação</summary>

SELECT minutos+5, NOT feita FROM caderno.leituras WHERE id=1; produz 15 e false (psql normalmente mostra f).

</details>

## 3. Resolva em outro caso

Expresse meia hora em horas com divisão decimal a partir de 30 minutos. Compare com usar apenas inteiros.

<details>
<summary>Conferir a solução e o resultado</summary>

SELECT 30/60, 30/60.0; produz 0 e um valor numérico igual a 0.5. A divisão entre inteiros trunca a parte fracionária.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/datatype.html)
