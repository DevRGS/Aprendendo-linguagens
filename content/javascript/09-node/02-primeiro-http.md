# Seu primeiro servidor HTTP

Uma API conversa por **requisição** e **resposta**. O cliente escolhe método, URL, cabeçalhos e eventualmente corpo; o servidor devolve status, cabeçalhos e eventualmente corpo. Um pedido não é uma chamada direta à função interna de outro computador.

No exemplo, GET /api/saude recebe JSON com status 200. Outra combinação recebe 404. `Content-Type: application/json` descreve o corpo. `res.end` termina a resposta: esquecer de responder pode deixar o cliente esperando.

O caminho de uma URL não é automaticamente um arquivo do disco. Seu código decide como responder; esta etapa não serve pastas. Isso ajuda a entender por que um backend deve expor somente os recursos escolhidos.

## Executar a etapa pequena

Com o servidor final parado, rode **npm run etapa:http** na pasta do projeto e abra http://127.0.0.1:3000/api/saude. O arquivo completo está em `etapas/01-http.mjs`. Pare com Ctrl+C antes de executar outra etapa na mesma porta. O guard de execução no arquivo permite que testes importem a fábrica sem abrir um listener inesperado.

Um servidor precisa de tratamento adicional para limites, erros e recursos. Este primeiro exemplo é propositalmente pequeno; ele não lê corpo de cadastro, não conecta ao banco e não oferece o CRUD final.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Versão mínima completa: salve como primeiro.mjs na sua pasta de estudo e execute node primeiro.mjs. Ela reproduz o comportamento da etapa 01 sem o guard de importação.

```javascript
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET' && req.url === '/api/saude') {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
  }
});
server.listen(3000, '127.0.0.1');
```

## Prática guiada

Abra /api/saude e /nao-existe. Veja status e corpo no painel Network do navegador. Compare o corpo JSON com a página visual do projeto final.

<details>
<summary>Conferir resultado e solução</summary>

A saúde responde 200 e {"ok":true}; o caminho não definido responde 404. JSON é o formato de dados, não uma página que o servidor seja obrigado a renderizar.

</details>

## Fontes

- [Node — HTTP](https://nodejs.org/api/http.html)
- [MDN — métodos HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
