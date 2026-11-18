# Resumir texto: wc, sort, uniq e cut

Ferramentas pequenas podem resolver partes de um problema:

- `wc -l` conta caracteres de nova linha; um arquivo sem quebra no fim pode ter uma linha visual a mais que essa contagem. `wc -w` conta palavras segundo as regras da ferramenta/locale.
- `sort` ordena linhas. A ordem depende do locale; para os exemplos reproduzíveis, usamos `LC_ALL=C` em algumas chamadas. `sort -n` compara números, em vez de apenas texto.
- `uniq` remove **repetições adjacentes**. Para reunir linhas iguais que estavam separadas, normalmente use `sort arquivo | uniq`. `uniq -c` conta ocorrências adjacentes.
- `cut -d ':' -f 1` extrai o primeiro campo separado por `:`. Não é um leitor CSV completo: aspas e separadores dentro dos dados exigem outro tratamento.

O símbolo `|` liga a saída de um comando à entrada do próximo; você estudará isso em detalhes no módulo seguinte. Usar `wc -l < arquivo` lê a entrada do arquivo sem imprimir seu nome junto à contagem.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'azul' 'verde' 'azul' > cores.txt
wc -l < cores.txt
LC_ALL=C sort cores.txt | uniq
printf '%s\n' 'Ana:8' 'Beto:7' | cut -d ':' -f 1
```

Saída esperada:

```text
3
azul
verde
Ana
Beto
```

## Sua vez

Compare `uniq cores.txt` com `sort cores.txt | uniq`. Por que a primeira forma mantém as duas linhas `azul`?

<details>
<summary>Ver uma solução comentada</summary>

A linha `verde` separa as duas ocorrências; `uniq` só compara vizinhas. Ordenar primeiro reúne as iguais, permitindo reduzir a uma linha por cor.

</details>

## Fontes

- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
