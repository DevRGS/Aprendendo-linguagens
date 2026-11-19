# Validar as propriedades de um objeto

Teste os contêineres e os campos em etapas. O teste typeof de null produz object e arrays também são objetos. O operador in permite detectar a presença de uma chave; verificar o tipo da propriedade é um passo separado.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
function temTitulo(v: unknown): v is { titulo: string } {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
    && 'titulo' in v && typeof v.titulo === 'string';
}
console.log(temTitulo({ titulo: 'Ler' }), temTitulo({ titulo: 2 }));
```

A saída é true false. Esta checagem básica ainda permite títulos vazios e chaves extras.

## 2. Investigue uma variação

Passe null e um array vazio pela função.

<details>
<summary>Conferir a variação</summary>

temTitulo(null) e temTitulo([]) devolvem false sem lançar exceção.

</details>

## 3. Resolva em outro caso

Acrescente um requisito de texto não vazio depois de aparar as extremidades.

<details>
<summary>Conferir a solução e o resultado</summary>

No fim da expressão adicione && v.titulo.trim().length > 0. Com {titulo:' '} o resultado passa a false.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
