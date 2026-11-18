# Entrada, saída e mensagens de erro

Um processo costuma receber três canais: **entrada padrão** (stdin, 0), **saída padrão** (stdout, 1) e **erro padrão** (stderr, 2). Texto comum e diagnóstico podem aparecer na mesma janela, mas usam canais diferentes.

| Operador Bash | O que faz |
|---|---|
| `> arquivo` | Cria ou **trunca/substitui** a saída padrão no arquivo |
| `>> arquivo` | Acrescenta a saída padrão ao final |
| `< arquivo` | Lê a entrada padrão do arquivo |
| `2> arquivo` | Redireciona somente o erro padrão |
| `2>&1` | Faz stderr apontar para onde stdout aponta naquele momento |

O shell prepara o redirecionamento **antes** de executar o comando. Por isso `cat notas.txt > notas.txt` pode esvaziar o arquivo antes da leitura: use outro destino. A ordem também importa: `comando > tudo.txt 2>&1` reúne os canais em `tudo.txt`; inverter os redirecionamentos tem outro efeito.

No exemplo, `cat` tenta ler um arquivo inexistente. A mensagem vai para `erros.txt`; depois capturamos seu status imediatamente. A redação exata do erro varia por idioma/sistema, mas o status diferente de zero indica a falha.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
printf '%s\n' 'primeira' > notas.txt
printf '%s\n' 'segunda' >> notas.txt
cat notas.txt
cat inexistente.txt 2> erros.txt
estado=$?
if [ "$estado" -ne 0 ] && [ -s erros.txt ]; then
    printf '%s\n' 'Falha registrada no arquivo de erros.'
fi
```

Saída esperada:

```text
primeira
segunda
Falha registrada no arquivo de erros.
```

## Sua vez

Conte as linhas de `notas.txt` usando entrada redirecionada e sem mostrar o nome do arquivo.

<details>
<summary>Ver uma solução comentada</summary>

```bash
wc -l < notas.txt
```

O resultado é `2`. A entrada vem do arquivo, e não do teclado.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
