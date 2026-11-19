# Conferir o resultado

Entregar uma correção exige comprovar o conteúdo, a relação com o histórico e a disponibilidade da versão no remoto. Uma mensagem dizendo corrigido é apenas uma pista.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 18) && cd "$aula"
```

O kit já criou e publicou a reversão. Refaça a conferência a partir das referências.

## E1 · Preveja e experimente

```bash
git fetch origin
git diff --exit-code HEAD origin/main -- README.md
git show origin/main:README.md
git status --short
```

**Confira.** O diff termina com código zero e sem patch. A versão remota conhecida contém Abra o guia. O status inicial está limpo.

## E2 · Investigue uma variação

Faça uma mudança local e descubra por que o diff entre commits continua vazio.

**Solução comentada.** Use `echo 'Rascunho' >> README.md` e repita `git diff HEAD origin/main -- README.md`. As duas pontas continuam iguais. `git diff -- README.md` exibe a alteração no disco.

## E3 · Aplique em outra situação

Faça uma consulta que compare o arquivo de trabalho com a ponta remota conhecida.

**Solução comentada.** `git diff origin/main -- README.md` destaca Rascunho. Agora você tem evidências separadas para o disco e para a versão publicada.

[Preparação e fontes oficiais](#/git/referencia)
