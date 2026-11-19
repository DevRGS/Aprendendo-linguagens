# Abrir e revisar um pull request

Um pull request reúne a justificativa, os commits da proposta e a revisão do diff. A base recebe a mudança e a branch de comparação fornece os commits. A revisão individual desta aula usa a observação “Qual arquivo devo abrir?”.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 16) && cd "$aula"
```

O cenário inicia em docs com um commit proposto. Para a parte online, crie em sua conta um repositório de estudo vazio, sem README, e configure a autenticação do GitHub. Use apenas o material fictício. Para praticar a discussão localmente, siga E1 e E2 sem publicar.

## E1 · Preveja e experimente

```bash
git log --oneline main..docs
git diff main...docs -- README.md
```

Leia a linha Abra o arquivo. Explique por que um leitor novo ficaria em dúvida.

**Confira.** O diff mostra a adição desde a base comum. O comentário pede o nome do arquivo de forma verificável.

Se você tem uma conta, abra agora a proposta no seu repositório vazio. Copie a URL, execute o bloco e cole o endereço quando solicitado.

```bash
read -r -p "URL do seu repositório de estudo vazio: " url
git remote add github "$url"
git push github main
git push github docs
```

No GitHub, abra **Pull requests → New pull request**, escolha base **main** e compare **docs**. Descreva o problema e o teste de leitura, depois crie o pull request. Abra **Files changed**, encontre a linha vaga e registre a observação do leitor. Se houver um colega, peça que ele comente o diff.

## E2 · Investigue uma variação

Na mesma branch, incorpore a observação “Qual arquivo devo abrir?” sem perder a instrução que já estava no guia.

**Solução comentada.** Execute no laboratório:

```bash
printf 'Abra o guia.\nAbra o arquivo README.md.\n' > README.md
git add README.md
git commit -m 'Identifica o arquivo da instrução'
git diff main...docs -- README.md
```

Agora o leitor sabe qual arquivo abrir. Se você abriu a proposta online, envie o novo commit com `git push github docs` e atualize a página do pull request.

## E3 · Aplique em outra situação

Faça o papel de revisor do texto atualizado. Outra pessoa deve conseguir identificar o problema, localizar a correção e testar se a instrução ficou suficiente. Na proposta online, confira o novo commit na mesma discussão e responda à observação. No percurso individual local, entregue a mensagem de revisão junto com o diff.

**Solução comentada.** Uma resposta possível é “O guia agora nomeia README.md. Conferi a linha adicionada e abri esse arquivo na raiz do projeto.” A proposta online reúne o commit inicial e a correção em docs; a comparação `git diff main...docs` mostra o resultado final no percurso local.

[Preparação e fontes oficiais](#/git/referencia)
