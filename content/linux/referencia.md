# Referência rápida de Terminal Linux

Esta trilha usa **GNU/Linux com Bash**: Linux nativo ou Ubuntu no WSL. Os comandos abaixo são para o terminal Linux, salvo a seção de preparação do Windows. As opções de ferramentas BSD/macOS e a sintaxe do PowerShell podem ser diferentes.

## Preparar Ubuntu no Windows

O caminho moderno exige Windows 11 ou Windows 10 versão 2004/build 19041 ou posterior. Confira com `winver`. No **PowerShell como administrador**:

```powershell
wsl --install -d Ubuntu
```

Reinicie, abra Ubuntu pelo menu Iniciar e crie usuário e senha Linux. A senha não aparece ao digitar. No **PowerShell**, confira ou reabra:

```powershell
wsl --list --verbose
wsl -d Ubuntu
```

Dentro do **Ubuntu/Bash**, use `cd ~` e `pwd` para começar na pasta pessoal Linux. `exit` encerra a sessão. Quem já tem Linux não precisa de WSL; quem já tem Ubuntu no WSL não precisa reinstalar.

Instalação parada em 0,0% pode usar a alternativa oficial `wsl --install --web-download -d Ubuntu`, no PowerShell como administrador. Problemas de virtualização dependem do Windows e do hardware: consulte o guia Microsoft. Veja o [passo a passo completo da instalação](#/linux/primeiros-passos/instalacao-wsl).

## Consultar ajuda

| Comando/tecla | Uso |
|---|---|
| `type cd` | Descobrir como o shell resolve um comando |
| `help cd` | Ajuda de um comando interno do Bash |
| `ls --help` | Ajuda resumida de uma ferramenta GNU |
| `man ls` | Manual, quando instalado; `q` sai do paginador |
| Tab | Tentar completar um nome |
| ↑ / Ctrl+R | Recuperar / pesquisar histórico |
| Ctrl+C | Interromper o trabalho em primeiro plano, normalmente com SIGINT |

Não copie o `$` do prompt. Revise comandos recuperados e não escreva senhas/tokens em linhas que podem ir para o histórico.

## Navegação e arquivos

| Comando | Efeito |
|---|---|
| `pwd` | Mostrar a pasta atual |
| `ls -lah` | Listar detalhes, ocultos e tamanhos legíveis |
| `cd pasta` / `cd ..` | Entrar na pasta / subir um nível |
| `cd` / `cd ~` | Ir à pasta pessoal |
| `cd -` | Voltar ao diretório anterior, quando disponível |
| `mkdir -p projeto/notas` | Criar a árvore de pastas ausente |
| `touch nota.txt` | Criar se não existe; se existe, atualizar horários |
| `cp origem destino` | Copiar arquivo, mantendo a origem |
| `cp -R pasta reserva` | Copiar árvore de diretórios |
| `mv origem destino` | Mover ou renomear |
| `rm -i -- arquivo` | Pedir confirmação antes de remover o alvo |
| `rmdir pasta` | Remover diretório vazio |

`ls -a` inclui `.` e `..`; `ls -A` os omite. Um caminho absoluto começa por `/`; um relativo parte da pasta atual. Use aspas em nomes com espaços: `cat "minhas notas.txt"`.

> [!CAUTION]
> `rm` não passa pela lixeira. `cp`, `mv`, `>` e `tee` podem sobrescrever destinos. Confira os caminhos e pratique só nos arquivos que você criou. `--` encerra as opções nas ferramentas que o aceitam.

Para começar um laboratório independente, no Bash:

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
pwd
```

Cada execução cria uma pasta nova dentro da sua pasta pessoal. Os arquivos continuam no disco até você removê-los; as aulas não fazem limpeza automática.

## Leitura, busca e resumo

| Comando | Efeito |
|---|---|
| `cat arquivo` | Imprimir o arquivo inteiro |
| `less arquivo` | Navegar pelo conteúdo; `/texto` busca e `q` sai |
| `head -n 5 arquivo` | Primeiras cinco linhas |
| `tail -n 5 arquivo` | Últimas cinco linhas |
| `tail -f arquivo` | Acompanhar novas linhas até Ctrl+C |
| `grep -n 'texto' arquivo` | Mostrar linhas correspondentes e números |
| `grep -i 'texto' arquivo` | Ignorar caixa na busca |
| `grep -F 'a.b' arquivo` | Buscar texto literal |
| `grep -v 'texto' arquivo` | Selecionar linhas sem correspondência |
| `find . -type f -name '*.txt'` | Buscar arquivos regulares por nome |
| `find . -type d` | Buscar diretórios |
| `wc -l < arquivo` | Contar quebras de linha sem mostrar nome do arquivo |
| `sort -n numeros.txt` | Ordenar numericamente |
| `sort arquivo \| uniq` | Reunir e reduzir linhas iguais |
| `cut -d ':' -f 1 arquivo` | Primeiro campo delimitado por dois-pontos |

`uniq` só reduz repetições adjacentes. `grep` e curingas de nomes não têm a mesma sintaxe: `^`/`$` ancoram regex, enquanto `*`/`?` expandem nomes no Bash. Use aspas em `find -name '*.txt'` para que o próprio find interprete o padrão. A ordem de `sort` depende do locale; `LC_ALL=C sort arquivo` fixa uma comparação reproduzível.

## Shell: canais e combinação

| Forma | Efeito |
|---|---|
| `comando > arquivo` | Substituir stdout no arquivo |
| `comando >> arquivo` | Acrescentar stdout ao arquivo |
| `comando < arquivo` | Ler stdin do arquivo |
| `comando 2> erros.txt` | Redirecionar stderr |
| `comando > tudo.txt 2>&1` | Reunir stdout e stderr no arquivo |
| `A \| B` | Ligar stdout de A a stdin de B |
| `A \| tee arquivo` | Mostrar e guardar a saída |
| `A \| tee -a arquivo` | Mostrar e acrescentar ao arquivo |
| `A && B` | Executar B se A teve status 0 |
| `A \|\| B` | Executar B se A teve status não zero |

O pipe comum não inclui stderr. Sem `pipefail`, o status do pipeline é o do último comando. `A && B || C` pode executar C se B falhar, mesmo que A tenha funcionado.

O shell abre o redirecionamento antes de executar o programa: **não use a mesma entrada como destino**, como em `cat notas.txt > notas.txt`.

| Variável/expansão | Significado |
|---|---|
| `nome=Ana` | Atribuição, sem espaços ao redor de `=` |
| `"$nome"` | Valor em um argumento |
| `'$nome'` | Texto literal, sem expandir |
| `$(comando)` | Saída padrão do comando, sem quebras finais |
| `$?` | Status mais recente; guarde imediatamente |
| `$!` | PID associado ao último trabalho em segundo plano |
| `export nome` | Passar a variável no ambiente dos processos filhos |

## Permissões e recursos

| Comando | Uso |
|---|---|
| `whoami` / `id` | Usuário efetivo / IDs e grupos |
| `ls -l` | Tipo, permissões, dono e grupo, entre outros campos |
| `chmod u+x script.sh` | Acrescentar execução ao dono |
| `chmod 600 privado.txt` | Ler/escrever só para o dono nos bits básicos |
| `ps -p PID` | Retrato de um processo específico |
| `top` | Acompanhar processos; `q` sai |
| `jobs` / `fg` / `bg` | Trabalhos da sessão / primeiro plano / segundo plano |
| `kill -TERM PID` | Solicitar término; use só o PID do treino que você iniciou |
| `df -h .` | Espaço do sistema de arquivos da pasta atual |
| `du -sh .` | Uso de disco da árvore atual |
| `free -h` | Memória; observe também a estimativa `available` |

Permissões: `r=4`, `w=2`, `x=1`, em três grupos (dono/grupo/outros). Em diretórios, `x` permite atravessar/acessar entradas. `chmod 777` não é uma correção geral. `sudo` depende de autorização e não é necessário nos laboratórios.

## Tar e scripts

```bash
tar -czf pacote.tar.gz notas
tar -tzf pacote.tar.gz
mkdir destino
tar -xzf pacote.tar.gz -C destino
```

As três operações são criar (`-c`), listar (`-t`) e extrair (`-x`); `-z` pede gzip, e `-f` indica o archive. O exemplo pressupõe uma pasta `notas` já criada e `destino` ainda inexistente. Liste antes de extrair em uma pasta vazia.

```bash
#!/usr/bin/env bash
nome=${1:-Visitante}
printf 'Olá, %s!\n' "$nome"
```

Salve como `saudar.sh` com finais LF e execute `bash saudar.sh "Ana Silva"`. Para executar diretamente: `chmod u+x saudar.sh` e `./saudar.sh`.

- `$1`: primeiro argumento; `$#`: quantidade; `$0`: identificação do script; `"$@"`: todos os argumentos, preservados separadamente.
- `IFS= read -r nome`: ler uma linha preservando barras e espaços nas pontas.
- `if [ -f "$arquivo" ]; then ...; else ...; fi`: decidir se há arquivo regular.
- `for arquivo in *.txt; do ...; done`: iterar pelos nomes. Use `"$arquivo"` no corpo e trate ausência de correspondência, como no [projeto de revisão](#/linux/rotinas/repeticao-e-projeto).

## Fontes e créditos

Conteúdo original em português, com exemplos próprios. Fontes consultadas em 16/11/2026; os links permitem consultar detalhes e mudanças posteriores.

- [Microsoft Learn — instalar o WSL](https://learn.microsoft.com/pt-br/windows/wsl/install), [configurar o ambiente](https://learn.microsoft.com/pt-br/windows/wsl/setup/environment), [comandos básicos](https://learn.microsoft.com/pt-br/windows/wsl/basic-commands) e [solução de problemas](https://learn.microsoft.com/pt-br/windows/wsl/troubleshooting).
- [Canonical/Ubuntu — The Linux command line for beginners](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/).
- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html).
- [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/html_node/index.html), [GNU Grep](https://www.gnu.org/software/grep/manual/grep.html), [GNU Findutils](https://www.gnu.org/software/findutils/manual/html_mono/find.html) e [GNU tar](https://www.gnu.org/software/tar/manual/tar.html).
- [Debian Manpages — less](https://manpages.debian.org/trixie/less/less.1.en.html) e [procps](https://manpages.debian.org/trixie/procps/index.html).
- [Sudo — manual oficial](https://www.sudo.ws/docs/man/sudo.man/).
