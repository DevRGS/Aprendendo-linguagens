# Nomes com espaços e curingas

O Bash interpreta certos caracteres **antes** de chamar o programa. Sem aspas, `*.txt` é expandido para os nomes correspondentes. `*` combina zero ou mais caracteres, `?` combina um caractere e `[ab]` combina um dos caracteres listados.

Por padrão no Bash, um curinga como `*` não inclui nomes que começam com ponto. Se nenhum arquivo combina, o padrão costuma continuar literal; opções do shell podem mudar isso. Não assuma que `*.txt` sempre encontra algo.

Aspas simples mantêm o texto literal: `'*.txt'` chega ao comando como um asterisco e a extensão. Aspas duplas protegem espaços e curingas, mas ainda permitem expansões de variáveis. Esta diferença será explorada no módulo de shell.

Para um nome com espaços, mantenha o caminho inteiro em um argumento: `cp "minhas notas.txt" "copia das notas.txt"`. Para passar um padrão ao `find`, use aspas (`find . -name '*.txt'`), pois quem deve interpretar o padrão é o `find`.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
touch 'minhas notas.txt' resumo.txt imagem.png .segredo.txt
printf '<%s>\n' *.txt
printf '<%s>\n' '*.txt'
```

Saída esperada:

```text
<minhas notas.txt>
<resumo.txt>
<*.txt>
```

## Sua vez

Copie `minhas notas.txt` para `copia das notas.txt` usando aspas. Use `ls -A` para ver também `.segredo.txt`.

<details>
<summary>Ver uma solução comentada</summary>

```bash
cp "minhas notas.txt" "copia das notas.txt"
ls -A
```

As aspas agrupam cada nome. O arquivo original é vazio porque foi criado por `touch`.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
- [GNU Findutils — manual](https://www.gnu.org/software/findutils/manual/html_mono/find.html)
