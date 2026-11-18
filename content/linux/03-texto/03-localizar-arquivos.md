# Localizar arquivos com find

`find ponto-de-partida testes` percorre uma árvore de diretórios. `find . -type f` encontra arquivos regulares a partir do diretório atual; `-type d` seleciona diretórios.

`-name '*.txt'` compara o nome final do caminho. O padrão fica entre aspas para o Bash não expandi-lo antes do `find`. `-iname` faz uma comparação sem distinguir maiúsculas. As condições consecutivas normalmente são combinadas com **E**: `-type f -name '*.txt'` exige as duas.

Use uma pasta de estudo como ponto de partida. Começar por `/` pode percorrer muito mais conteúdo e produzir erros de acesso. A ordem em que os caminhos são encontrados não é uma ordem garantida; o exemplo usa `sort` para apresentar uma saída estável.

> [!NOTE]
> Espaços nos nomes continuam fazendo parte do caminho. Em automações com nomes arbitrários, separar nomes só por linhas pode ser inadequado; `find -print0` e ferramentas que entendem o separador nulo resolvem esse caso. Aqui trabalhamos com os nomes controlados do laboratório.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir -p notas antigas
touch notas/a.txt antigas/b.txt notas/foto.png
find . -type f -name '*.txt' | sort
```

Saída esperada:

```text
./antigas/b.txt
./notas/a.txt
```

## Sua vez

Liste somente os diretórios abaixo do laboratório, incluindo o próprio `.`.

<details>
<summary>Ver uma solução comentada</summary>

```bash
find . -type d | sort
```

A saída será `.`, `./antigas` e `./notas`, nessa ordem depois de `sort`.

</details>

## Fontes

- [GNU Findutils — manual](https://www.gnu.org/software/findutils/manual/html_mono/find.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
