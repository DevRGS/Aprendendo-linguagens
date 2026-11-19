# Migrar criação e leitura da tarefa

Na cópia trabalho descrita no README do kit, parta dos handlers originais. Modele o repositório, escreva a conversão de unknown e conecte criarTarefa e lerTarefa às rotas. Mantenha o parser JSON, o middleware de sessão, o CSRF nas escritas e a projeção dos campos públicos.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Use o terminal na pasta **inicial** para a linha de base ou **solucao** para a versão migrada. Para implementar sua própria versão, siga o roteiro de migração do README do ZIP.

## 1. Demonstração

```bash
npm run check
npm run build
npm test
```

Na solução, a compilação estrita e os testes passam. Em tipos/rotas.ts e tipos/tarefas.ts, o título segue para o repositório apenas no ramo ok; a leitura filtra pelo id da sessão e pelo id da tarefa.

## 2. Investigue uma variação

Na interface iniciada por npm start, crie uma tarefa com espaços no começo e no fim e releia depois do login.

<details>
<summary>Conferir a variação</summary>

O valor exibido é o título aparado. Veja o retorno da aba Rede para confirmar POST 201 com titulo normalizado.

</details>

## 3. Resolva em outro caso

Implemente a criação e a leitura em trabalho. Envie um body com titulo numérico e confira que o total de tarefas não sobe.

<details>
<summary>Conferir a solução e o resultado</summary>

O handler interpreta o resultado de converter, lança ApiError de validação no ramo de falha e não chama createTask. No teste HTTP, compare o total antes e depois de receber 400.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://nodejs.org/docs/latest-v22.x/api/test.html)
