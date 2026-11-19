# Passar valores separados da consulta

No node-postgres escreva o SQL com marcadores $1, $2 e envie os valores como array. O texto da consulta fica estável mesmo se o tema contiver um apóstrofo. Experimente como arquivo consultar.mjs dentro de solucao após npm ci, .env configurado e caderno carregado.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Use PostgreSQL 17, a carga do esquema caderno e Node 22.13+ da série 22. Configure o arquivo .env na pasta solucao conforme o README do ZIP.

## 1. Demonstração

```javascript
import pg from 'pg';
process.loadEnvFile('.env');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  const r = await pool.query('SELECT count(*)::int AS total FROM caderno.leituras WHERE aluno_id=$1 AND tema=$2', [1, 'Git']);
  console.log(r.rows[0].total);
} finally { await pool.end(); }
```

Execute node consultar.mjs no terminal. O resultado é 1. O cast ::int faz o driver devolver a contagem como número para esta carga pequena.

## 2. Investigue uma variação

Troque o segundo valor do array pelo texto Guia d'Ana mantendo a consulta. Qual é o resultado?

<details>
<summary>Conferir a variação</summary>

Escreva o valor entre aspas duplas em JavaScript. O resultado é 0, pois a carga não tem esse tema; o apóstrofo continua parte do valor.

</details>

## 3. Resolva em outro caso

Consulte os temas com duração mínima como parâmetro, devolvendo ordem estável por id.

<details>
<summary>Conferir a solução e o resultado</summary>

Use pool.query('SELECT tema FROM caderno.leituras WHERE minutos >= $1 ORDER BY id', [20]) e mostre r.rows. Só SQL aparece na carga inicial.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://node-postgres.com/features/queries)
