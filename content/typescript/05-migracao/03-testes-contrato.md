# Exercitar o contrato e um corpo malformado

Um teste de integração faz requisições reais à aplicação com banco temporário. Em solucao/test/api.test.mjs, a opção raw serve para transmitir bytes que não formam JSON. A opção body serializa um valor JavaScript e testa outra categoria de erro.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Use o terminal na pasta **inicial** para a linha de base ou **solucao** para a versão migrada. Para implementar sua própria versão, siga o roteiro de migração do README do ZIP.

## 1. Demonstração

```bash
npm test
```

No teste de JSON e campos inválidos, raw com uma chave de abertura resulta em 400 e um título numérico também resulta em 400. O primeiro falha no parser; o segundo chega à validação.

## 2. Investigue uma variação

Examine o caso raw texto com Content-Type text/plain. Por que o status é diferente?

<details>
<summary>Conferir a variação</summary>

O middleware de tipo de mídia devolve 415 antes do parser JSON.

</details>

## 3. Resolva em outro caso

Acrescente no teste HTTP um caso com JSON truncado depois de titulo e outro com JSON válido contendo um array. Observe o código da aplicação em cada resposta.

<details>
<summary>Conferir a solução e o resultado</summary>

Use raw igual a '{"titulo":' no primeiro e body igual a [] no segundo. Com sessão e CSRF válidos, espere status 400 em ambos, com erro.codigo JSON no primeiro e VALIDACAO no segundo.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://nodejs.org/docs/latest-v22.x/api/test.html)
