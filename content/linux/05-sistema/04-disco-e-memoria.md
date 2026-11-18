# Consultar disco e memória

`df -h .` mostra espaço do sistema de arquivos que contém a pasta atual; `du -sh pasta` estima espaço de disco usado pela árvore indicada. São perguntas diferentes: o disco inteiro pode estar cheio mesmo que a pasta consultada seja pequena.

`-h` usa unidades legíveis. Em ferramentas GNU, há diferenças entre unidades baseadas em 1024 e opções como `--si`, baseadas em 1000. Não conclua que dois valores estão errados apenas por usarem unidades diferentes.

`free -h` resume memória do sistema. Em Linux, cache usa memória que pode ser recuperada; o campo **available** é uma estimativa mais útil do que olhar apenas **free** para saber o que ainda pode ser usado sem swap. Valores mudam continuamente. No WSL 2, os recursos vistos pelo Linux pertencem ao ambiente virtualizado, não são simplesmente uma fotografia completa do Windows.

## Consultar é diferente de alterar

Execute `df -h .`, `du -sh .` e `free -h` no seu terminal e interprete os títulos das colunas. Nenhum deles apaga arquivos. As quantidades dependem da máquina e não precisam coincidir com as de outra pessoa.

O exemplo abaixo confirma que as consultas do laboratório terminaram, sem comparar números dinâmicos. `/dev/null` descarta a saída comum; não é um arquivo de notas.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'conteúdo de teste' > pequeno.txt
df -h . > /dev/null
du -sh . > /dev/null
printf '%s\n' 'Consultas de disco concluídas.'
```

Saída esperada:

```text
Consultas de disco concluídas.
```

## Sua vez

Veja quanto espaço a pasta atual ocupa com `du -sh .`. Em seguida compare com o sistema de arquivos em `df -h .`. Se `free` estiver disponível, localize a coluna `available`.

<details>
<summary>Ver uma solução comentada</summary>

`du` responde sobre os arquivos da pasta; `df` responde sobre o sistema de arquivos. Os valores não são fixos e não precisam ser iguais.

</details>

## Fontes

- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
- [Debian — manuais procps](https://manpages.debian.org/trixie/procps/index.html)
