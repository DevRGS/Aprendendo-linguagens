# Criar uma branch

Uma branch dá nome a uma linha de desenvolvimento. Inicialmente duas branches podem apontar para o mesmo commit. Ao registrar outra mudança na branch ativa, somente essa referência avança.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 9) && cd "$aula"
```

O kit inicia em main. Escolha uma branch curta para a proposta de um sumário.

## E1 · Preveja e experimente

```bash
git switch -c sumario
echo '1. Introdução' > sumario.txt
git add sumario.txt
git commit -m 'Inicia o sumário'
git log --oneline --decorate -2
```

**Confira.** HEAD e sumario estão no commit novo. main continua no anterior.

## E2 · Investigue uma variação

Inspecione a lista de arquivos de main sem sair de sumario.

**Solução comentada.** Use `git ls-tree --name-only main`. A lista contém README.md e ainda não tem sumario.txt.

## E3 · Aplique em outra situação

Crie uma segunda proposta a partir da versão inicial e confira a base.

**Solução comentada.** `git switch -c revisao main` cria revisao em main. `git diff main HEAD` fica vazio.

[Preparação e fontes oficiais](#/git/referencia)
