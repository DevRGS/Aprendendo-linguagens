# Validar entradas e responder erros

O servidor deve validar tudo o que define o contrato. Uma pessoa pode editar o corpo da requisição fora do seu formulário. O projeto aceita somente os nomes de campo previstos, verifica tipos, faz trim no título e limita seu comprimento. O id precisa ser inteiro seguro positivo, não apenas ter um prefixo numérico como "12abc".

Validação não é coerção indiscriminada. O corpo JSON concluida:"false" contém texto, não booleano; a API o rejeita. Converter tudo com Boolean também seria errado: Boolean("false") é true. Para paginação, parâmetros chegam como strings e passam por uma conversão deliberada com limites.

O parser limita o corpo a 16 KiB. JSON quebrado resulta em 400, corpo grande 413 e Content-Type incorreto 415 nas operações com corpo. Essas verificações evitam que o handler trate um formato diferente do que foi combinado.

ApiError distingue erros de contrato de falhas internas. O middleware final converte erros conhecidos para {erro:{codigo, mensagem}} e usa uma mensagem genérica para 500. Não exponha stack, caminho interno, consulta SQL ou credenciais para ajudar o usuário a depurar.

No Express 5, erros lançados ou rejeições retornadas em handlers async seguem para o tratamento. Ainda é preciso garantir que cada caminho responde ou encaminha uma vez; não chame next depois de já mandar uma resposta normal.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Parte de taskBody em src/errors.mjs, aplicada somente quando o campo concluida foi enviado. O objeto também passa por requireObject e pelo conjunto de campos permitidos.

```javascript
if (typeof body.concluida !== 'boolean') {
  throw new ApiError(400, 'VALIDACAO', 'Concluída deve ser true ou false.');
}
```

## Prática guiada

Envie título só com espaços, concluida como texto, um campo usuario_id e um id com letras usando a API manual do README.

<details>
<summary>Conferir resultado e solução</summary>

As entradas fora do contrato recebem 400. Campos extras não são ignorados silenciosamente para escolher dono ou outros atributos. Um pedido válido ainda funciona depois dos erros.

</details>

## Fontes

- [Express — tratamento de erros](https://expressjs.com/en/guide/error-handling/)
- [Express 5 — API](https://expressjs.com/en/5x/api/)
- [MDN — status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

Títulos contendo o caractere NUL (U+0000) são rejeitados com 400 antes de chegar ao SQLite, evitando truncamento ou erro interno. Essa validação vale tanto na criação quanto na edição.
