# Compilar e executar o primeiro arquivo

No terminal, entre em solucao, confira node --version (22.13 ou posterior da série 22), rode npm ci e npm run check. O lockfile fixa o compilador local. Salve o exemplo inteiro em tipos/laboratorio.ts. Rode npm run build e então node dist/laboratorio.js. O primeiro comando produz JavaScript, o segundo executa o arquivo produzido.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
const mensagem: string = 'Laboratório pronto';
console.log(mensagem);
```

O terminal mostra Laboratório pronto. Abra dist/laboratorio.js e procure a anotação de string. Ela foi apagada durante a emissão.

## 2. Investigue uma variação

Mude somente a mensagem para Primeiro estudo. Qual comando atualiza o arquivo que o Node executa?

<details>
<summary>Conferir a variação</summary>

Salve, execute npm run build e node dist/laboratorio.js. Aparece Primeiro estudo.

</details>

## 3. Resolva em outro caso

Prepare uma cópia limpa do kit em outra pasta e execute a API completa.

<details>
<summary>Conferir a solução e o resultado</summary>

Em solucao execute npm ci, npm run check, npm test e npm start. Em http://127.0.0.1:3000/ aparece a tela de acesso. Ctrl+C encerra o servidor.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/tsconfig/)
