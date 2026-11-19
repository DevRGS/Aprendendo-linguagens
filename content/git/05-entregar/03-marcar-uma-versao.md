# Marcar uma versão

Uma tag dá um nome estável a uma versão entregue. Uma tag anotada também registra autor da marca, data e mensagem. O envio pode nomear apenas a marca destinada à publicação.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 19) && cd "$aula"
```

main já contém o guia corrigido e a reversão publicada. Confira o conteúdo antes de marcar.

## E1 · Preveja e experimente

```bash
git show HEAD:README.md
git tag -a v1.0 -m 'Guia revisado'
git push origin v1.0
git ls-remote --tags origin
```

**Confira.** O remoto anuncia refs/tags/v1.0. Em uma tag anotada também pode aparecer a linha terminada em ^{} indicando o objeto referenciado.

## E2 · Investigue uma variação

Compare o hash do commit marcado com o de main.

**Solução comentada.** `git rev-parse 'v1.0^{commit}'` e `git rev-parse main` imprimem o mesmo commit no cenário atual.

## E3 · Aplique em outra situação

Crie um commit depois da entrega e confirme que a tag identifica a versão original.

**Solução comentada.** Use `echo 'Próxima edição.' >> README.md` e `git commit -am 'Inicia edição seguinte'`. Em `git show v1.0:README.md` a nova linha está ausente.

[Preparação e fontes oficiais](#/git/referencia)
