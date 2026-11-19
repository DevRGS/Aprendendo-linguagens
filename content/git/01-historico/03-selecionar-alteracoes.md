# Selecionar alterações

O índice descreve a próxima fotografia do projeto. Escolher um caminho com git add permite preparar uma mudança e deixar outro rascunho no disco.

## Prepare a prática

<a href="content/git/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit em uma pasta sua. Na raiz extraída, abra Bash (Linux, macOS, WSL ou Git Bash no Windows). Confira Git 2.28 ou superior com `git --version`. O comando cria uma pasta descartável e entra no ponto inicial da aula. A identidade usada nos exercícios é configurada apenas no repositório de treino. Para recomeçar, volte à pasta extraída e repita.

```bash
aula=$(bash preparar.sh 3) && cd "$aula"
```

Você recebeu a versão inicial de README.md. Trabalhe em dois arquivos com destinos diferentes.

## E1 · Preveja e experimente

```bash
echo 'Leia primeiro.' >> README.md
echo 'Revisar depois.' > notas.txt
git add README.md
git diff --cached --name-only
```

**Confira.** A lista contém somente README.md. O rascunho segue na pasta.

## E2 · Investigue uma variação

Acrescente outra linha a README.md depois de prepará-lo. Ela já está no índice?

**Solução comentada.** Use `echo 'Segunda linha.' >> README.md` e `git diff`. A nova linha aparece no diff do disco. Para incluí-la, prepare README.md novamente.

## E3 · Aplique em outra situação

Prepare também notas.txt e confira os nomes das duas mudanças.

**Solução comentada.** Execute `git add notas.txt` e `git diff --cached --name-only`. Agora os dois nomes aparecem.

[Preparação e fontes oficiais](#/git/referencia)
