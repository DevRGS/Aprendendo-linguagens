# Diretório de trabalho e índice

O mesmo arquivo pode ter três conteúdos. O commit contém uma versão registrada, o índice contém a preparada, e o editor mostra o arquivo no disco. git diff sem opções compara o disco com o índice.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 5) && cd "$aula"
```

Comece com o README.md que contém Abra o guia. Compare três fotografias antes de confirmar qualquer mudança.

## E1 · Preveja e experimente

```bash
echo 'Passo A' >> README.md
git add README.md
echo 'Passo B' >> README.md
git diff -- README.md
git diff --cached -- README.md
```

**Confira.** O primeiro diff marca a adição de Passo B. O segundo marca a adição de Passo A. As linhas sem sinal de adição servem de contexto.

## E2 · Investigue uma variação

Veja a versão preparada inteira sem ler o arquivo no editor.

**Solução comentada.** `git show :README.md` termina em Passo A. O prefixo de dois-pontos pede o conteúdo do índice.

## E3 · Aplique em outra situação

Preveja o conteúdo de um commit criado agora e confira depois.

**Solução comentada.** Execute `git commit -m 'Registra passo A'` e `git show HEAD:README.md`. O conteúdo termina em Passo A. Passo B segue no disco.

[Preparação e fontes oficiais](#/git/referencia)
