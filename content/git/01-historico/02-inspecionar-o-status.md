# Inspecionar o status

O status compara o diretório de trabalho e o índice com o commit atual. Na forma curta, a primeira coluna descreve o índice e a segunda descreve alterações no diretório de trabalho. Um arquivo desconhecido tem o marcador especial ??.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 2) && cd "$aula"
```

O kit traz README.md já registrado. Confira primeiro o estado limpo com git status.

## E1 · Preveja e experimente

```bash
echo 'Use um editor.' >> README.md
echo 'Rascunho' > notas.txt
git status --short
```

**Confira.** A letra M na segunda coluna identifica README.md modificado no disco. A linha de notas.txt começa com ??.

## E2 · Investigue uma variação

Prepare apenas notas.txt e repita a consulta.

**Solução comentada.** Com `git add notas.txt`, notas.txt passa a ter A na primeira coluna. README.md continua com a mudança fora do índice.

## E3 · Aplique em outra situação

Crie pendente.txt e preveja seus dois primeiros caracteres na listagem.

**Solução comentada.** `echo 'Conferir' > pendente.txt` seguido de `git status --short` mostra ?? para esse novo arquivo.

[Preparação e fontes oficiais](#/git/referencia)
