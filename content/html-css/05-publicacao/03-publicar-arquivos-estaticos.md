# Publicar arquivos estáticos

Um site estático pode ser reproduzido ao servir seus arquivos como foram salvos. Neste laboratório você ensaia a publicação sob um subdiretório. Para um endereço público, publique apenas uma cópia de estudo.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/19` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

Use a pasta aulas inteira como raiz do teste. Se tiver Python 3, abra o terminal nessa pasta e execute o comando. No Windows, use py -m http.server 8000 --bind 127.0.0.1 se o iniciador py estiver disponível. Sem Python, abra 19/index.html pelo navegador e use a entrega em pacote.

## E1 · Preveja e experimente

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra http://127.0.0.1:8000/19/ e siga os links. Deixe o terminal aberto durante o teste. Encerre com Ctrl+C.

**Confira.** O catálogo e o detalhe aparecem abaixo de /19/. No painel Rede, ao recarregar, os recursos são buscados sob esse prefixo. Um arquivo ausente produz uma resposta 404.

## E2 · Investigue uma variação

Compare abrir /19/trilhas/web.html diretamente com chegar a ele pelo link da inicial.

**Solução comentada.** O servidor entrega o mesmo documento nos dois percursos. O link de volta deve continuar sob /19/.

## E3 · Aplique em outra situação

Entregue a pasta compactada ou publique em um repositório de estudos no GitHub.

**Solução comentada.** Para Pages, envie o conteúdo da pasta 19 (index.html na raiz), abra Settings → Pages, selecione Deploy from a branch, a branch usada e /(root), e salve. Quando a implantação terminar, abra o endereço exibido e repita a navegação sob o prefixo do projeto. Para entregar sem conta, envie o pacote com a mesma estrutura e o roteiro do servidor.

[Preparação e fontes oficiais](#/html-css/referencia)
