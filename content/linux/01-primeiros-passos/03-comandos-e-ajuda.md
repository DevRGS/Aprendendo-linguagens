# Comandos, opções e ajuda

Uma chamada costuma ter **comando**, **opções** e **argumentos**. Em `ls -a /tmp`, `ls` lista arquivos, `-a` inclui nomes ocultos e `/tmp` é o diretório consultado. Espaços separam partes; `ls -a` e `ls-a` são coisas diferentes. Os nomes podem distinguir maiúsculas: `ls` não é `LS`.

Opções curtas geralmente começam com `-`; opções longas, com `--`. Muitas ferramentas GNU aceitam `ls --all` como equivalente a `ls -a`, mas isso não é uma regra universal. `--` pode encerrar as opções, como em `ls -- -rascunho`, ao consultar um nome iniciado por hífen.

## Descobrir antes de decorar

- `type cd` informa como o Bash resolve `cd`: ele é um comando interno do shell. A mensagem depende do idioma/configuração.
- `help cd` mostra ajuda de um comando interno do Bash.
- `ls --help` mostra opções de uma ferramenta GNU. Nem todo programa aceita `--help`.
- `man ls` abre o manual, se o programa `man` estiver instalado. Use as setas para rolar e `q` para sair. A ausência de `man` não impede o curso: há links para os manuais nas aulas.

`help cd` é uma escolha melhor que supor que `cd --help` funciona em qualquer shell. O comando interno muda o diretório do próprio shell; um processo separado não poderia mudar a pasta da sessão que o iniciou.

## Experimente no seu terminal

Execute:

```bash
type -t cd
printf '%s\n' 'Uma opção muda como o comando trabalha.'
```

Saída esperada:

```text
builtin
Uma opção muda como o comando trabalha.
```

## Sua vez

Consulte `help cd` e `ls --help`. Localize o que faz a opção `-a`. Se tiver `man`, abra `man ls` e saia com `q`.

<details>
<summary>Ver uma solução comentada</summary>

`-a`/`--all` inclui nomes iniciados por ponto, além de `.` e `..`. A saída da ajuda varia conforme versão e idioma.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
