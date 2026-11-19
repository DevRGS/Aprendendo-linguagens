# Clonar o remoto de estudo

Um remoto pode ser um diretório local. O laboratório usa central.git como ponto compartilhado e os diretórios aluna e colega como cópias com arquivos editáveis. Cada clone conserva seu próprio índice e histórico local.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 13) && cd "$aula"
```

Partindo de aluna, crie uma terceira cópia de leitura no mesmo laboratório.

## E1 · Preveja e experimente

```bash
git clone ../central.git ../leitura
git -C ../leitura remote -v
git -C ../leitura show HEAD:README.md
```

**Confira.** O clone identifica a origem pelo apelido origin e recupera o guia com Abra o guia.

## E2 · Investigue uma variação

Faça uma edição no clone de leitura e confira se o clone da aluna muda.

**Solução comentada.** Use `echo 'Somente leitura local.' >> ../leitura/README.md` e `git status --short`. A pasta da aluna continua limpa. Em `git -C ../leitura status --short` aparece a edição.

## E3 · Aplique em outra situação

Identifique a referência publicada sem inspecionar arquivos internos de central.git.

**Solução comentada.** Rode `git ls-remote origin refs/heads/main`. A linha termina em refs/heads/main e começa com o hash anunciado pelo remoto.

[Preparação e fontes oficiais](#/git/referencia)
