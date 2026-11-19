# Comprovar o rollback após uma falha

O primeiro comando pode ter funcionado na sessão, mas ainda depende do compromisso da transação inteira. Recarregue caderno com o script. Introduza uma referência inválida na segunda escrita e volte à carga anterior com ROLLBACK. Execute em psql interativo.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
UPDATE caderno.leituras SET minutos=99 WHERE id=1;
INSERT INTO caderno.leituras(aluno_id,tema,minutos) VALUES (999,'Falha',5);
ROLLBACK;
SELECT minutos FROM caderno.leituras WHERE id=1;
```

O INSERT falha com 23503 e a leitura 1 volta a exibir 10 minutos. A linha inválida também não foi gravada.

## 2. Investigue uma variação

Antes do INSERT inválido, leia minutos na própria sessão. O que você vê?

<details>
<summary>Conferir a variação</summary>

Após o UPDATE, a transação lê sua própria alteração e vê 99. Depois de ROLLBACK ela volta a 10.

</details>

## 3. Resolva em outro caso

Reproduza a mesma propriedade para autenticação no projeto: uma troca de sessão falha ao gravar a segunda linha. O que verificar?

<details>
<summary>Conferir a solução e o resultado</summary>

Rode npm test em solucao. O teste de atomicidade tenta rotacionar a sessão para usuário -1, confere 23503 e verifica que a sessão original ainda pertence a Ana.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/sql-rollback.html)
