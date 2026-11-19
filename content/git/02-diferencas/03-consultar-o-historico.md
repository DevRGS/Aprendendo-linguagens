# Consultar o histórico

O histórico liga cada commit a seus pais. Consultas com limite de quantidade e filtro por caminho ajudam a descobrir quando uma instrução entrou no guia e como era a versão anterior.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 7) && cd "$aula"
```

O laboratório possui dois commits em main. O último acrescentou uma orientação no README.

## E1 · Preveja e experimente

```bash
git log -2 --oneline -- README.md
git show HEAD~1:README.md
git show HEAD:README.md
```

**Confira.** As duas mensagens aparecem em ordem da mais nova para a mais antiga. Apenas a última versão do arquivo traz Confira a pasta.

## E2 · Investigue uma variação

Compare as duas fotografias sem extrair nenhuma delas por cima do arquivo.

**Solução comentada.** Use `git diff HEAD~1 HEAD -- README.md`. A linha da orientação aparece com +.

## E3 · Aplique em outra situação

Descubra a mensagem completa do commit anterior e identifique seu papel.

**Solução comentada.** `git log -1 --format=%s HEAD~1` retorna Cria a primeira instrução. Ele introduziu o documento antes da orientação adicional.

[Preparação e fontes oficiais](#/git/referencia)
