# Usuários e permissões de arquivos

`whoami` mostra o usuário efetivo; `id` mostra IDs e grupos. Os valores dependem da máquina. `ls -l` apresenta o tipo e as permissões, proprietário e grupo, além de outros campos.

Em `-rw-r-----`, o primeiro caractere indica arquivo regular. Os nove seguintes são três grupos: **dono**, **grupo** e **outros**. Em cada trio, `r` é leitura, `w` escrita e `x` execução; `-` indica ausência daquele bit.

Para **diretórios**, `r` permite listar nomes; `x` permite atravessar/acessar entradas; `w`, junto com as permissões necessárias de acesso, permite criar/remover entradas. Remover um arquivo depende das permissões do diretório pai, não apenas da escrita no arquivo. ACLs e outros mecanismos podem acrescentar regras.

`chmod u+x script.sh` acrescenta execução para o dono. `chmod 600 arquivo` define leitura e escrita só para o dono: `r=4`, `w=2`, `x=1`, somados em cada categoria. `644` significa dono `rw`, grupo `r`, outros `r`.

> [!WARNING]
> `chmod 777` abre todas as permissões básicas para todos e não é uma solução geral para erros de acesso. Faça ajustes apenas nos seus arquivos de laboratório. No WSL, prefira a pasta pessoal Linux; em `/mnt/c`, as regras podem depender da montagem e do Windows.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'anotação pessoal' > privado.txt
chmod 600 privado.txt
stat -c '%a' privado.txt
chmod u+x privado.txt
stat -c '%a' privado.txt
```

Saída esperada:

```text
600
700
```

## Sua vez

Retire a execução do dono de `privado.txt` e confira o modo numérico.

<details>
<summary>Ver uma solução comentada</summary>

```bash
chmod u-x privado.txt
stat -c '%a' privado.txt
```

O modo volta a `600`. Tornar um texto executável não o transforma automaticamente em um programa válido.

</details>

## Fontes

- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
- [Microsoft — configurar o ambiente WSL](https://learn.microsoft.com/pt-br/windows/wsl/setup/environment)
