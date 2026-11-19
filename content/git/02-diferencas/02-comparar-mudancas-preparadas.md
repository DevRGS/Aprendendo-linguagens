# Comparar mudanças preparadas

Uma revisão antes do commit responde a duas perguntas. Quais arquivos vão entrar? Que informação muda dentro deles? O nome do arquivo sozinho não revela uma instrução errada.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 6) && cd "$aula"
```

O kit preparou uma linha nova em README.md e deixou notas.txt como rascunho.

## E1 · Preveja e experimente

```bash
git diff --cached --stat
git diff --cached -- README.md
git status --short
```

**Confira.** O primeiro resumo cita um arquivo. O patch mostra +Confira a pasta. O status também revela o rascunho fora do índice.

## E2 · Investigue uma variação

Retire README.md do índice e verifique o arquivo no disco.

**Solução comentada.** Use `git restore --staged README.md` e `cat README.md`. A linha ainda está lá. Agora git diff --cached está vazio.

## E3 · Aplique em outra situação

Escolha apenas o rascunho para o próximo commit e comprove a previsão.

**Solução comentada.** `git add notas.txt` e `git diff --cached --name-only` mostram só notas.txt. README.md modificado permanece fora do índice.

[Preparação e fontes oficiais](#/git/referencia)
