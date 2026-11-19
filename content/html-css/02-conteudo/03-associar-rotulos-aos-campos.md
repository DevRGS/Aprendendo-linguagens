# Associar rótulos aos campos

Um campo precisa de nome acessível. A associação entre label e input pode ser feita fazendo for coincidir com um id único. Um texto que aparece e desaparece dentro do campo como sugestão não substitui essa associação.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/07` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

No corpo, escreva um formulário simples para praticar identificação. Esta demonstração não salva dados.

## E1 · Preveja e experimente

```html
<h1>Busca de estudos</h1>
<form>
  <label for="tema">Tema de estudo</label>
  <input id="tema" name="tema" placeholder="Ex.: lógica">
</form>
```

**Confira.** Clique em Tema de estudo. O foco entra no campo. Ao digitar, o rótulo continua visível. No inspetor de acessibilidade, o nome é Tema de estudo.

## E2 · Investigue uma variação

Mude o id do input para assunto sem alterar for. Confira o clique no rótulo e repare a associação.

**Solução comentada.** Com os valores diferentes, o clique no texto deixa de levar o foco ao input. Use for="assunto".

## E3 · Aplique em outra situação

Acrescente um segundo campo com nome acessível distinto.

**Solução comentada.** Use `<label for="autor">Autor</label><input id="autor" name="autor">`. Teste os dois rótulos por clique e examine os nomes.

[Preparação e fontes oficiais](#/html-css/referencia)
