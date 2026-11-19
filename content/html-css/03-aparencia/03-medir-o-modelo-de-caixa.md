# Medir o modelo de caixa

Uma caixa tem conteúdo, preenchimento, borda e margem. Com o dimensionamento padrão de um div, width determina a largura do conteúdo. Alterar box-sizing torna explícito se o valor já inclui preenchimento e borda.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/11` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

A página inicial contém um div com class="caixa". Remova as regras antigas e compare no diagrama de caixa do inspetor; trabalhe com zoom padrão.

## E1 · Preveja e experimente

```css
.caixa {
  width: 200px;
  padding: 12px;
  border: 2px solid navy;
  margin: 8px;
}
```

**Confira.** A distância entre as bordas externas é 228 px: 200 + 24 de preenchimento + 4 de bordas. A margem fica fora dessa medição.

## E2 · Investigue uma variação

Adicione box-sizing: border-box à regra e confira a largura disponível ao texto.

**Solução comentada.** Agora a caixa entre bordas mede 200 px. O conteúdo ocupa 172 px porque 28 px estão reservados a padding e border.

## E3 · Aplique em outra situação

Projete uma caixa de 240 px entre bordas, com padding de 16 px e borda de 4 px por lado. Preveja o conteúdo.

**Solução comentada.** Com width: 240px e border-box, sobram 200 px. Verifique no diagrama após ajustar as propriedades.

[Preparação e fontes oficiais](#/html-css/referencia)
