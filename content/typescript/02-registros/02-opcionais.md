# Distinguir ausência e valor falso

No PATCH de uma tarefa, o cliente pode enviar só o campo que deseja mudar. O marcador ? sinaliza que a propriedade pode estar ausente. Com checagem estrita, a leitura desse campo também pode resultar em undefined. Use ?? para um padrão que preserve false.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
type Mudanca = { concluida?: boolean };
function proximo(atual: boolean, dados: Mudanca) {
  return dados.concluida ?? atual;
}
console.log(proximo(true, {}), proximo(true, { concluida: false }));
```

A saída é true false. A ausência preserva o estado antigo e false reabre a tarefa.

## 2. Investigue uma variação

Substitua ?? por || e repita os dois casos. Qual atualização falha?

<details>
<summary>Conferir a variação</summary>

O segundo resultado vira true. O operador || usa o padrão também quando o operando à esquerda é false.

</details>

## 3. Resolva em outro caso

Modele titulo opcional e escreva uma função que use o título antigo quando chegar {}.

<details>
<summary>Conferir a solução e o resultado</summary>

type Patch = { titulo?: string }; function aplicar(antes: string, p: Patch) { return p.titulo ?? antes; } Com 'Ler' e {} retorna Ler.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/objects.html)
