# Criar e copiar: mkdir, touch e cp

`mkdir` cria diretórios. `mkdir -p projeto/notas` cria também as pastas intermediárias que faltam. `touch arquivo` cria um arquivo vazio se ele não existe; **se já existe, atualiza seus horários**, sem apagar o conteúdo.

`cp origem destino` copia um arquivo. Se o destino é um diretório existente, o nome da origem é mantido dentro dele. Se o destino é um arquivo existente, ele pode ser sobrescrito. A opção `-i` pergunta antes de sobrescrever; leia a pergunta antes de responder. Para copiar um diretório e seu conteúdo, use `cp -R`.

Não confunda copiar com mover: depois de uma cópia bem-sucedida, a origem continua existindo. O exemplo usa `printf` e `>` para criar texto; `>` grava a saída em um arquivo e substitui o conteúdo anterior, se houver.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir -p projeto/notas
printf '%s\n' 'Revisar comandos' > projeto/notas/plano.txt
cp projeto/notas/plano.txt copia.txt
touch copia.txt
cat copia.txt
```

Saída esperada:

```text
Revisar comandos
```

## Sua vez

Copie toda a pasta `projeto` para uma nova pasta `reserva` e leia o plano que está na cópia.

<details>
<summary>Ver uma solução comentada</summary>

```bash
cp -R projeto reserva
cat reserva/notas/plano.txt
```

`-R` percorre o diretório; o plano original continua em `projeto/notas/plano.txt`.

</details>

## Fontes

- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
