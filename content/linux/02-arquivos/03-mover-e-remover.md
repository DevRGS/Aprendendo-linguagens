# Mover e remover com cuidado

`mv origem destino` move ou renomeia. Dentro da mesma pasta, `mv rascunho.txt final.txt` troca o nome. Se o destino é uma pasta existente, move para dentro dela. O destino pode ser sobrescrito; `mv -i` pergunta antes disso.

`rm arquivo` remove a entrada do arquivo. **Não passa pela lixeira do ambiente gráfico.** `rm -i arquivo` pede confirmação. Confira a pasta com `pwd` e o alvo com `ls` antes de remover.

`rmdir pasta` remove somente diretórios vazios. Se houver algo dentro, falha sem apagar os arquivos. `rm -r pasta` remove recursivamente e merece mais cuidado; não é necessário nesta prática. Evite acrescentar `-f` apenas para esconder mensagens.

> [!CAUTION]
> Nesta aula, remova somente os arquivos que você acabou de criar. Aspas protegem espaços, mas não tornam um alvo errado seguro. `--` encerra a leitura de opções para tratar um nome iniciado por `-` como arquivo.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir entrega
printf '%s\n' 'Primeira versão' > rascunho.txt
mv rascunho.txt entrega/final.txt
cat entrega/final.txt
rm -- entrega/final.txt
rmdir entrega
printf '%s\n' 'Diretório vazio removido.'
```

Saída esperada:

```text
Primeira versão
Diretório vazio removido.
```

## Sua vez

Crie um arquivo `apagar.txt` no laboratório e remova-o com confirmação. Depois confira a listagem.

<details>
<summary>Ver uma solução comentada</summary>

```bash
touch apagar.txt
rm -i -- apagar.txt
ls
```

Confirme apenas se o nome mostrado for `apagar.txt`. A resposta solicitada pode variar com o idioma.

</details>

## Fontes

- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
