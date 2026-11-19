# Reverter um commit publicado

A instrução mais recente do guia aponta para um arquivo ausente e já foi publicada. Uma reversão registra uma nova mudança que compensa o efeito do commit anterior. Os demais colaboradores conseguem acompanhar a correção pelo histórico.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 17) && cd "$aula"
```

Consulte o guia para confirmar o problema antes de revertê-lo.

## E1 · Preveja e experimente

```bash
git show -1 --oneline
git revert --no-edit HEAD
cat README.md
git log -2 --oneline
```

**Confira.** O guia volta a conter apenas Abra o guia. A reversão e o commit problemático continuam no histórico.

## E2 · Investigue uma variação

Compare a versão atual com a anterior à introdução do erro.

**Solução comentada.** `git diff HEAD~2 HEAD -- README.md` termina sem patch. Os conteúdos coincidem nessas duas fotografias.

## E3 · Aplique em outra situação

Envie a correção ao laboratório e verifique-a na cópia do colega.

**Solução comentada.** `git push origin main`, `git -C ../colega fetch origin` e `git -C ../colega show origin/main:README.md` mostram a versão corrigida.

[Preparação e fontes oficiais](#/git/referencia)
