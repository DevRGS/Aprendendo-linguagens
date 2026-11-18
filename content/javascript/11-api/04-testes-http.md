# Testar a API com HTTP e banco temporário

Um teste de integração abre o mesmo aplicativo que o aluno executa, mas usa **porta livre e banco temporário**. Ele faz pedidos HTTP reais e observa status, cabeçalhos, corpo e persistência. Não basta verificar que uma função mockada foi chamada.

A fábrica createApplication recebe caminho do banco, origem e relógio; não abre uma porta automaticamente. O teste cria o servidor em porta 0, descobre a porta escolhida e injeta a origem exata. O relógio controlado permite testar expiração de 8 h sem esperar oito horas reais.

O arquivo test/api.test.mjs do pacote confere cadastro/login, CRUD completo, paginação, SQL com aspas, isolamento de contas, CSRF, origem, logout, dados inválidos e reinicialização. Bancos de teste não são o arquivo de suas tarefas. finally encerra conexão/listener e remove apenas o diretório temporário criado pelo próprio teste.

Execute **npm test** na pasta do projeto. Leia a saída completa se houver falha. Um teste esperado 404 não significa que a suíte falhou: ele passa justamente quando a API recusa o acesso errado.

Uma dependência ou deploy pode ter comportamento diferente do laboratório. Os testes reduzem regressões no contrato escolhido; não comprovam sozinhos segurança operacional, configuração do proxy ou compatibilidade de qualquer servidor externo.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Ideia central usada nos testes: assert é node:assert/strict e origin é a URL do servidor de teste já iniciado. O arquivo completo test/api.test.mjs contém preparação/encerramento; este trecho não inicia o servidor.

```javascript
const response = await fetch(`${origin}/api/saude`);
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), { ok: true });
```

## Prática guiada

Execute os testes e localize a verificação que tenta alterar uma tarefa da outra conta. Leia qual status ela exige e por quê.

<details>
<summary>Conferir resultado e solução</summary>

O caso exige 404, preservando o filtro de proprietário. Não troque por 200 para fazer uma falha sumir: investigue a consulta e a sessão usadas no pedido.

</details>

## Fontes

- [Node — testes](https://nodejs.org/api/test.html)
- [Node — HTTP](https://nodejs.org/api/http.html)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
