# Confirmar duas escritas como unidade

Uma transação agrupa as mudanças para que fiquem visíveis juntas quando confirmadas. Execute a demonstração em caderno recém-carregado. Esta prática confirma as mudanças de propósito. Use o script do kit depois para recuperar a carga original.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
UPDATE caderno.leituras SET feita=true WHERE id=2;
INSERT INTO caderno.leituras(aluno_id,tema,minutos) VALUES (3,'Revisão',15);
COMMIT;
SELECT count(*) FILTER (WHERE feita), count(*) FROM caderno.leituras;
```

Após a primeira execução na carga limpa, o resultado é 3 leituras feitas e 4 no total. As duas mudanças persistem.

## 2. Investigue uma variação

Conecte outro psql na mesma base e confira a contagem depois do commit.

<details>
<summary>Conferir a variação</summary>

SELECT count(*) FROM caderno.leituras; nessa segunda sessão mostra 4. Reponha os dados com o script reiniciar.sql antes de repetir a demonstração.

</details>

## 3. Resolva em outro caso

Com dois clientes e a carga reiniciada, pause a primeira sessão antes do commit. Consulte a contagem na segunda e repita depois do commit.

<details>
<summary>Conferir a solução e o resultado</summary>

No isolamento padrão, um SELECT comum da segunda sessão vê 3 antes e 4 após o COMMIT da primeira. Ao final rode o script de reinício.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/tutorial-transactions.html)
