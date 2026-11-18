# Express: rotas, parâmetros e middleware

Express organiza o trabalho repetitivo de HTTP. `app.get` associa método/caminho a um handler; `req.params` contém parâmetros do caminho, `req.query` contém parâmetros da consulta e `req.body` vem do parser apropriado. Nenhum deles se torna confiável apenas por ter sido recebido.

**Middleware** é uma função da cadeia. Ela pode responder, modificar o contexto controladamente ou chamar next para continuar. A ordem importa: o parser deve vir antes de ler o corpo; a autenticação, antes das rotas protegidas; o tratador de erro fica depois das rotas.

`express.json({ limit: '16kb' })` interpreta JSON com um limite de tamanho. O Content-Type deve corresponder ao formato. Um corpo inválido precisa de resposta de erro, não deve ser concatenado em SQL nem devolvido numa página HTML.

Rode **npm run etapa:express** e consulte /api/ola/Ana. O exemplo completo de `etapas/02-express.mjs` não tem autenticação/banco. No projeto final, `src/app.mjs` acrescenta a cadeia de origem, parser, rotas, sessão e erros. Express 5 encaminha rejeições de handlers async para o tratamento de erro; callbacks externas ainda precisam ser integradas corretamente ao fluxo.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Exemplo completo, dependente de Express já instalado por npm ci. Salve como express-inicial.mjs na raiz do projeto e execute node express-inicial.mjs, com outros servidores parados.

```javascript
import express from 'express';
const app = express();
app.use(express.json({ limit: '16kb' }));
app.get('/api/ola/:nome', (req, res) => {
  res.json({ mensagem: `Olá, ${req.params.nome}!` });
});
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.listen(3000, '127.0.0.1');
```

## Prática guiada

Troque Ana por Bia na URL. Depois procure no projeto final onde express.json e o middleware de erro são registrados.

<details>
<summary>Conferir resultado e solução</summary>

O parâmetro muda a mensagem sem criar uma rota por pessoa. No projeto final, parser e erros são registrados em app.mjs; o tratador de erro possui quatro parâmetros.

</details>

## Fontes

- [Express 5 — API](https://expressjs.com/en/5x/api/)
- [Express — tratamento de erros](https://expressjs.com/en/guide/error-handling/)
