# Caminhos: pwd, ls e cd

O shell mantém um **diretório atual**. `pwd` mostra seu caminho. `ls` lista os nomes desse diretório; `ls pasta` lista outra pasta sem entrar nela. `cd pasta` muda a pasta atual.

Um caminho **absoluto** começa com `/`, como `/home/ana`. Um caminho **relativo** parte do diretório atual, como `estudos/aulas`. `/` é a raiz da árvore; não é a mesma coisa que o usuário administrador chamado root.

| Escrita | Significado |
|---|---|
| `.` | Diretório atual |
| `..` | Diretório pai |
| `~` no início e sem aspas | Pasta pessoal, expandida pelo Bash |
| `cd` sem argumento | Vai à pasta pessoal |
| `cd -` | Volta ao diretório anterior, se houver |

Nomes iniciados por ponto são ocultados pela listagem padrão. `ls -a` inclui todos, inclusive `.` e `..`; `ls -A` omite esses dois nomes especiais. `ls -l` apresenta detalhes, e `ls -lh` usa tamanhos legíveis. Ordem, cores e formato podem variar por configuração; não use uma captura de tela como única forma de identificar arquivos.

> [!TIP]
> Um espaço faz parte do nome quando está entre aspas: `cd "minhas aulas"`. `cd minhas aulas` envia dois argumentos e não representa essa pasta.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir aulas
touch aulas/nota.txt aulas/.rascunho
cd aulas
printf '%s\n' 'Arquivos, incluindo ocultos:'
ls -A
cd ..
printf '%s\n' 'Voltei à pasta pai.'
```

Saída esperada:

```text
Arquivos, incluindo ocultos:
.rascunho
nota.txt
Voltei à pasta pai.
```

## Sua vez

Na pasta de laboratório, entre em `aulas`, consulte `pwd` e volte com `cd ..`. Compare `ls` e `ls -a` dentro de `aulas`.

<details>
<summary>Ver uma solução comentada</summary>

`ls` omite `.rascunho`; `ls -a` mostra `.rascunho`, `nota.txt`, `.` e `..`. `pwd` varia conforme o caminho criado para o laboratório.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
- [Ubuntu — primeiros passos na linha de comando](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/)
