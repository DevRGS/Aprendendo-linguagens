# Ler arquivos: cat, less, head e tail

`cat arquivo` imprime o conteúdo inteiro. É útil para arquivos pequenos; um arquivo grande pode ocupar muitas telas. `less arquivo` permite navegar sem imprimir tudo de uma vez: Espaço avança, `b` volta, `/palavra` procura e `q` sai. `less` pode não estar instalado em ambientes mínimos.

`head -n 2 arquivo` mostra as primeiras duas linhas; `tail -n 2 arquivo`, as últimas duas. `tail -f arquivo` acompanha novas linhas até você interromper com `Ctrl+C`. Não significa que o arquivo tem somente aquelas linhas: você pediu um recorte.

No exemplo, `printf` recebe três textos e repete o formato para cada um. O redirecionamento `>` salva essas linhas em `agenda.txt`. Como ele substitui o arquivo, aqui usamos um arquivo criado no laboratório.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'estudar' 'praticar' 'revisar' > agenda.txt
head -n 1 agenda.txt
tail -n 1 agenda.txt
```

Saída esperada:

```text
estudar
revisar
```

## Sua vez

Leia o arquivo inteiro com `cat`. Se tiver `less`, abra a agenda, procure `praticar` com `/praticar` e saia com `q`.

<details>
<summary>Ver uma solução comentada</summary>

```bash
cat agenda.txt
```

As três linhas são `estudar`, `praticar` e `revisar`. No `less`, a busca e a saída são teclas digitadas dentro do paginador, não comandos novos do Bash.

</details>

## Fontes

- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
- [Debian — manual do less](https://manpages.debian.org/trixie/less/less.1.en.html)
