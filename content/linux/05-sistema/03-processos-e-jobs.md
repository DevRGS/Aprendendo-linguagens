# Processos, jobs e interrupção

Um **processo** tem um identificador numérico (PID). `ps` mostra um retrato dos processos; por exemplo, `ps -p PID` consulta um específico. `top` acompanha processos e uso de recursos; `q` sai. As listas e os números variam conforme a máquina.

O Bash também organiza **jobs da sessão**, que podem reunir vários processos de um pipeline. `jobs` lista esses trabalhos; `%1` é um identificador de job, não necessariamente PID 1.

- `comando &` inicia um trabalho em segundo plano e libera o prompt.
- `Ctrl+C` normalmente envia SIGINT ao grupo de processos em primeiro plano.
- `Ctrl+Z` normalmente suspende o trabalho em primeiro plano.
- `bg` retoma um job suspenso em segundo plano; `fg` traz um job para o primeiro plano.
- `kill PID` envia SIGTERM por padrão, solicitando encerramento. O processo pode tratar esse sinal. SIGKILL (`-9`) não pode ser tratado e não deve ser a primeira tentativa.

O experimento cria **o próprio** processo `sleep`, guarda seu PID com `$!` e só encerra esse processo. `wait` espera por ele e devolve seu status; o `||` trata o resultado de encerramento esperado. Não use um PID copiado de outra máquina.

> [!NOTE]
> `fg`, `bg` e as teclas de suspensão fazem sentido no Bash interativo com controle de jobs. Não espere a mesma experiência dentro de um script sem terminal.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
sleep 30 &
pid=$!
kill -TERM "$pid"
wait "$pid" 2>/dev/null || :
printf '%s\n' 'Meu processo de treino terminou.'
```

Saída esperada:

```text
Meu processo de treino terminou.
```

## Sua vez

No Bash interativo, rode `sleep 30`, pressione Ctrl+Z, use `jobs` para localizar o job, retome com `fg` e interrompa com Ctrl+C. Observe o prompt voltar.

<details>
<summary>Ver uma solução comentada</summary>

Use os jobs que aparecem na sua sessão. Se houver mais de um, `fg %N` seleciona o número mostrado em `jobs`. O comando `jobs` não é uma lista de todos os processos do computador.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [Debian — manuais procps](https://manpages.debian.org/trixie/procps/index.html)
