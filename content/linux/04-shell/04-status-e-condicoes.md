# Status de saída, && e ||

Um comando termina com um **status de saída**: `0` costuma significar sucesso; valores diferentes de zero indicam outros resultados. O significado exato pertence à ferramenta. Em `grep`, por exemplo, `1` significa que nenhuma linha combinou.

`$?` guarda o status do comando/pipeline mais recente. Capture imediatamente: até um `printf` seguinte muda esse valor. `false` retorna 1 e `true` retorna 0; são úteis para observar as regras.

- `A && B`: executa B somente se A tiver status 0.
- `A || B`: executa B somente se A tiver status diferente de zero.
- `A; B`: executa B depois de A, independentemente do sucesso de A.

`&&` e `||` formam listas avaliadas da esquerda para a direita. **`A && B || C` não equivale sempre a um if/else:** se A funciona mas B falha, C também roda. Para decisões com alternativas claras, prefira `if`, que será apresentado no último módulo.

No exemplo, `grep` não encontra `SQL`, então o status é 1. `||` permite apresentar uma mensagem própria para esse resultado conhecido.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'Linux' > temas.txt
grep -F 'SQL' temas.txt
estado=$?
printf 'Status: %s\n' "$estado"
grep -qF 'Linux' temas.txt && printf '%s\n' 'Tema encontrado.'
grep -qF 'Java' temas.txt || printf '%s\n' 'Java não aparece.'
```

Saída esperada:

```text
Status: 1
Tema encontrado.
Java não aparece.
```

## Sua vez

Preveja e rode `false && printf 'não\n'` e `false || printf 'alternativa\n'`.

<details>
<summary>Ver uma solução comentada</summary>

A primeira lista não imprime nada, pois `false` falha. A segunda imprime `alternativa`. Esses comandos não alteram arquivos.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Grep — manual](https://www.gnu.org/software/grep/manual/grep.html)
