# Ligar duas páginas

O navegador resolve um caminho relativo a partir do endereço do documento que contém o link. Ao entrar em uma subpasta, a referência para voltar à página inicial muda.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/03` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

O kit fornece index.html e trilhas/web.html. Modifique a página inicial e confira o link de retorno já existente no detalhe.

## E1 · Preveja e experimente

```html
<h1>Catálogo</h1>
<a href="trilhas/web.html">Abrir trilha web</a>
```

**Confira.** Enter sobre o link abre a página Trilha web. O link Voltar ao catálogo usa ../index.html e retorna.

## E2 · Investigue uma variação

Na página de detalhe, explique por que href="index.html" levaria a outro lugar.

**Solução comentada.** Sem ../, o navegador procuraria trilhas/index.html. A pasta não contém esse arquivo. Mantenha o caminho de retorno ../index.html.

## E3 · Aplique em outra situação

Duplique web.html como dados.html na mesma subpasta, altere title e h1 para Dados e ligue o catálogo ao novo detalhe.

**Solução comentada.** Acrescente `<a href="trilhas/dados.html">Abrir trilha de dados</a>`. Verifique os dois destinos e os dois retornos.

[Preparação e fontes oficiais](#/html-css/referencia)
