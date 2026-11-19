# Identificar o repositório

Um repositório guarda objetos e referências em uma pasta administrada pelo Git. O diretório de trabalho contém a cópia que você edita. Criar um repositório local já permite registrar histórico sem conexão.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 1) && cd "$aula"
```

A pasta começa vazia. O primeiro comando escolhe o nome da branch inicial. Os comandos de identidade vão gravar somente a configuração deste laboratório.

## E1 · Preveja e experimente

```bash
git init -b main
git config --local user.name "Lia"
git config --local user.email "lia@example.invalid"
git rev-parse --show-toplevel
```

**Confira.** A última linha termina em /aluna. O Git criou .git e ainda não existe commit.

## E2 · Investigue uma variação

Crie uma subpasta com `mkdir textos`, entre com `cd textos` e consulte a raiz novamente.

**Solução comentada.** A raiz segue terminando em /aluna. O Git procura os metadados nos diretórios superiores.

## E3 · Aplique em outra situação

A partir de textos, confira a identidade que ficará nos commits e volte à raiz.

**Solução comentada.** Use `git config --local --get user.name` para obter Lia e `cd ..` para voltar. O nome de autoria pode diferir do nome da sua conta em um serviço.

[Preparação e fontes oficiais](#/git/referencia)
