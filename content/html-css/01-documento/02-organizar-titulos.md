# Organizar títulos

O nível de um título informa como uma seção se relaciona com as demais. Você pode verificar a hierarquia lendo apenas os títulos, como faria uma pessoa que navega pela estrutura do documento.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/02` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

Substitua o corpo de index.html pelo sumário abaixo e leia-o de cima para baixo.

## E1 · Preveja e experimente

```html
<h1>Catálogo</h1>
<h2>Desenvolvimento</h2>
<h3>Páginas web</h3>
<p>Primeiro documento navegável.</p>
<h2>Dados</h2>
<p>Consultas e tabelas.</p>
```

**Confira.** Desenvolvimento e Dados são seções irmãs. Páginas web é um tópico dentro de Desenvolvimento.

## E2 · Investigue uma variação

Transforme Páginas web em uma seção do mesmo nível que Dados.

**Solução comentada.** Troque as marcas de abertura e fechamento h3 por h2. Confira as três seções irmãs na árvore de acessibilidade.

## E3 · Aplique em outra situação

Acrescente Estatística como um tópico de Dados, mantendo Catálogo como título principal.

**Solução comentada.** Logo após o parágrafo de Dados, acrescente `<h3>Estatística</h3><p>Medidas do grupo.</p>`. Na hierarquia, h3 está abaixo do h2 Dados.

[Preparação e fontes oficiais](#/html-css/referencia)
