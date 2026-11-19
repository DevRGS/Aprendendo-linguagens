# Entregar e reproduzir a migração

Use uma extração nova, registre versões e reproduza instalação, compilação e testes. Uma entrega verificável explicita o diretório de trabalho, os comandos, a URL, os dados de entrada e a evidência de autorização. Use o README do ZIP como ponto de comparação.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Use o terminal na pasta **inicial** para a linha de base ou **solucao** para a versão migrada. Para implementar sua própria versão, siga o roteiro de migração do README do ZIP.

## 1. Demonstração

```bash
node --version
npm ci
npm run check
npm run build
npm test
npm start
```

Em solucao a API inicia no endereço de loopback na porta 3000 por padrão. Cadastre duas contas fictícias e crie uma tarefa com a primeira. Os testes verificam que a segunda não consegue ler essa tarefa. Encerre com Ctrl+C.

## 2. Investigue uma variação

Reproduza o projeto em outra pasta mantendo o lockfile. Registre as versões de Node e compilador.

<details>
<summary>Conferir a variação</summary>

Em solucao use node --version e npx --no-install tsc --version depois de npm ci. O kit fixa o compilador em 5.9.3.

</details>

## 3. Resolva em outro caso

Entregue seu diretório trabalho com um teste novo, o roteiro e uma tabela antes/depois. Outra pessoa deve poder repetir a criação e o bloqueio entre contas.

<details>
<summary>Conferir a solução e o resultado</summary>

Critérios de aceite: check estrito e testes passam em cópia nova; POST válido dá 201 e Location, GET próprio dá 200, GET de outro usuário dá 404 e corpo malformado dá 400. Para a variação veja o README do projeto.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://nodejs.org/docs/latest-v22.x/api/test.html)
