# Pipelines e cópia da saída com tee

O pipe `|` conecta a **saída padrão** do comando à esquerda à **entrada padrão** do comando à direita. O segundo programa recebe os dados como entrada; o pipe não vira um argumento ou nome de arquivo.

`sort cores.txt | uniq` permite combinar ordenação e remoção de repetições. Isso não modifica `cores.txt`. Para guardar o resultado, redirecione para **outro** arquivo ou use `tee`.

`tee arquivo` lê a entrada, grava no arquivo e também imprime na saída padrão. Por padrão sobrescreve o arquivo; `tee -a` acrescenta. Ele é útil para ver e guardar o mesmo resultado.

> [!IMPORTANT]
> Um pipe comum não encaminha stderr. Para reunir erros e saída, é necessário redirecionar explicitamente, como `comando 2>&1 | outro`. Além disso, sem `pipefail`, o status de um pipeline vem do último comando. O sucesso do último não prova que todos os anteriores funcionaram.

Não grave sobre o mesmo arquivo que uma etapa ainda está lendo: `sort cores.txt > cores.txt` pode destruir a entrada.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'azul' 'verde' 'azul' > cores.txt
LC_ALL=C sort cores.txt | uniq | tee resumo.txt
printf '%s\n' 'Linhas do resumo:'
wc -l < resumo.txt
```

Saída esperada:

```text
azul
verde
Linhas do resumo:
2
```

## Sua vez

Use `tee -a resumo.txt` para acrescentar `amarelo` e confira o arquivo com `cat`.

<details>
<summary>Ver uma solução comentada</summary>

```bash
printf '%s\n' 'amarelo' | tee -a resumo.txt
cat resumo.txt
```

`tee` imprime `amarelo` e o acrescenta ao fim; `cat` mostra as três cores.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
