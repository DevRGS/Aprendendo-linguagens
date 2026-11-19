# Buscar referências

O colega já registrou e enviou uma linha nova. Antes de integrar, você pode trazer os objetos e atualizar a referência local que acompanha main no remoto.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 14) && cd "$aula"
```

Sua cópia continua no commit antigo. Observe o conteúdo antes e depois de buscar.

## E1 · Preveja e experimente

```bash
cat README.md
git fetch origin
git log --oneline main..origin/main
cat README.md
```

**Confira.** O log revela Esclarece a extensão. As duas leituras do arquivo são iguais porque a branch local continua no mesmo ponto.

## E2 · Investigue uma variação

Compare o arquivo atual com o proposto pelo colega.

**Solução comentada.** `git diff main origin/main -- README.md` mostra o acréscimo Confira a extensão.

## E3 · Aplique em outra situação

Integre somente se for possível avançar diretamente e confira o texto.

**Solução comentada.** `git merge --ff-only origin/main` seguido de `cat README.md` passa a exibir a nova orientação.

[Preparação e fontes oficiais](#/git/referencia)
