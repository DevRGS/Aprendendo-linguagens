# Repetição e um projeto de revisão

`for item in lista; do ...; done` executa o corpo uma vez para cada item. O nome da variável vai sem `$` na declaração; dentro do corpo, `"$item"` lê o valor.

Em `for arquivo in *.txt`, o Bash expande os nomes antes de começar o laço. Um nome com espaços continua sendo um item quando veio da expansão de nomes; manter `"$arquivo"` entre aspas no corpo impede novas separações. Se não houver correspondência, o padrão pode ficar literal; o exemplo testa `[ -f "$arquivo" ]` e usa `continue` para pular esse caso.

Evite percorrer arquivos com `for arquivo in $(ls)`: a substituição pode quebrar nomes por espaços e linhas. Para este laboratório, o glob e as aspas resolvem o problema.

## Projeto: resumo das notas

Crie duas notas, percorra os `.txt`, copie cada uma para uma pasta de reserva e imprima o nome acompanhado do número de linhas. Cada chamada de `printf` usa formato fixo; a contagem vem de `wc -l`. Como a pasta nasceu vazia, o resultado não depende de arquivos de outras aulas.

Esse projeto combina caminhos, aspas, cópia, redirecionamento, variáveis, condição e repetição. É uma base para automação; antes de adaptar para arquivos reais, reveja os caminhos e efeitos de cada comando.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir reserva
printf '%s\n' 'ler' 'praticar' > 'minhas notas.txt'
printf '%s\n' 'revisar' > resumo.txt
for arquivo in *.txt; do
    [ -f "$arquivo" ] || continue
    cp -- "$arquivo" reserva/
    linhas=$(wc -l < "$arquivo")
    printf '%s: %s\n' "$arquivo" "$linhas"
done
```

Saída esperada:

```text
minhas notas.txt: 2
resumo.txt: 1
```

## Sua vez

Depois da execução, leia as duas cópias com `cat "reserva/minhas notas.txt" reserva/resumo.txt`. Explique por que `"$arquivo"` precisa de aspas.

<details>
<summary>Ver uma solução comentada</summary>

As cópias contêm `ler`, `praticar` e `revisar`. Sem aspas, o valor `minhas notas.txt` poderia ser separado em argumentos; o programa deixaria de receber o caminho pretendido.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
