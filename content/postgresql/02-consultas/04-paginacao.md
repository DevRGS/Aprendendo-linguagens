# Ordenar resultados e desempatar a página

LIMIT recorta uma quantidade de linhas depois da ordenação. OFFSET pula uma quantidade inicial. Quando dois registros têm a mesma duração, use uma segunda chave única para definir a posição entre eles. Considere aqui um conjunto fixo durante as leituras.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
SELECT id,tema,minutos FROM caderno.leituras
ORDER BY minutos DESC,id ASC LIMIT 2 OFFSET 0;
```

A primeira página contém id 2 (20 minutos) e id 1 (10). A chave id crescente desempata as leituras de 10 minutos.

## 2. Investigue uma variação

Leia a segunda página com OFFSET 2.

<details>
<summary>Conferir a variação</summary>

Resta o id 3, também com duração de 10 minutos.

</details>

## 3. Resolva em outro caso

Mostre uma leitura por vez, começando pela de menor duração. Reconstrua a sequência dos ids.

<details>
<summary>Conferir a solução e o resultado</summary>

ORDER BY minutos ASC,id ASC LIMIT 1, repetindo com OFFSET 0, 1 e 2, produz 1, 3, 2. Escreva OFFSET no fim da consulta.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/queries-limit.html)
