# Conectar arquivos e configuração

O kit usa ESM, module NodeNext e a pasta tipos como entrada. Uma importação local em TypeScript usa o caminho .js que existirá no diretório de saída. Um import type é apagado na emissão. Aqui o arquivo tarefas.ts do kit já exporta os contratos.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`.

## 1. Demonstração

```typescript
import type { Entrada } from './tarefas.js';
const dado: Entrada = { titulo: 'Módulos' };
console.log(dado.titulo);
```

Em tipos/laboratorio.ts o exemplo passa no check e imprime Módulos quando executado após o build.

## 2. Investigue uma variação

Abra dist/laboratorio.js e procure o import de Entrada.

<details>
<summary>Conferir a variação</summary>

A referência ao tipo desaparece. O valor dado e o console.log permanecem.

</details>

## 3. Resolva em outro caso

Importe converter como valor, passe { titulo:' Git ' } e mostre o título normalizado.

<details>
<summary>Conferir a solução e o resultado</summary>

Use import { converter } from './tarefas.js'; const r = converter({titulo:' Git '}); if (r.ok) console.log(r.valor.titulo);. A saída é Git.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
