# Alternar entre versões

Com a pasta limpa, trocar de branch atualiza os arquivos rastreados para a versão escolhida. Assim você experimenta a proposta docs e volta ao material original.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 10) && cd "$aula"
```

main possui README.md. A branch docs acrescenta editor.txt.

## E1 · Preveja e experimente

```bash
git switch docs
cat editor.txt
git switch main
git ls-files
```

**Confira.** Na primeira branch o arquivo diz Use um editor. Em main a lista contém apenas README.md.

## E2 · Investigue uma variação

Leia editor.txt enquanto continua em main.

**Solução comentada.** `git show docs:editor.txt` exibe o texto. `git branch --show-current` continua mostrando main.

## E3 · Aplique em outra situação

Registre seu diagnóstico em um arquivo novo só na branch docs e comprove a diferença.

**Solução comentada.** `git switch docs`, `echo 'Editor conferido.' > teste.txt`, `git add teste.txt` e `git commit -m 'Registra conferência do editor'`. `git diff --name-only main docs` lista editor.txt e teste.txt.

[Preparação e fontes oficiais](#/git/referencia)
