# Buscar linhas com grep

`grep padrão arquivo` imprime linhas que combinam com o padrão. Por padrão, diferencia maiúsculas e usa expressões regulares básicas. Para procurar texto **literal**, `grep -F` evita que caracteres como `.` tenham significado especial.

| Opção | Efeito |
|---|---|
| `-n` | Mostra o número da linha |
| `-i` | Ignora diferenças entre maiúsculas e minúsculas |
| `-v` | Seleciona as linhas que não combinam |
| `-F` | Interpreta como texto fixo |
| `-E` | Usa expressões regulares estendidas |

Em expressões regulares, `^` marca o início e `$` o fim da linha. Por exemplo, `grep '^erro' arquivo` busca linhas começando com `erro`. Não confunda regex com curingas de nomes: `*.txt` e uma expressão regular têm regras diferentes.

`grep` retorna status 0 quando encontra uma linha, 1 quando não encontra e geralmente 2 quando ocorre erro. Nenhum resultado não é, por si só, uma falha do programa. Você usará status no próximo módulo.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'INFO início' 'ERRO disco' 'erro rede' > eventos.txt
grep -in 'erro' eventos.txt
printf '%s\n' 'a.b' 'axb' > pontos.txt
grep -F 'a.b' pontos.txt
```

Saída esperada:

```text
2:ERRO disco
3:erro rede
a.b
```

## Sua vez

Mostre só as linhas que não contêm `erro`, ignorando maiúsculas.

<details>
<summary>Ver uma solução comentada</summary>

```bash
grep -iv 'erro' eventos.txt
```

A saída é `INFO início`. `-i` altera a comparação e `-v` inverte a seleção.

</details>

## Fontes

- [GNU Grep — manual](https://www.gnu.org/software/grep/manual/grep.html)
