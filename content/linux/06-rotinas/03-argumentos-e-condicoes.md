# Argumentos, leitura e condições

Um script recebe argumentos: em `bash saudar.sh Ana`, `$1` é `Ana`, `$#` é a quantidade de argumentos e `$0` identifica o script. `"$@"` expande todos os argumentos preservando cada um como uma palavra. Coloque variáveis entre aspas para manter nomes com espaços.

`${1:-Visitante}` usa `Visitante` quando o primeiro argumento está ausente ou vazio. É uma escolha para este script, não uma regra universal para todo argumento.

`if comando; then ...; else ...; fi` decide pelo **status** do comando. O comando `[` (também chamado `test`) faz comparações; precisa de espaços: `[ -f "$arquivo" ]` testa um arquivo regular, `[ -d "$pasta" ]` testa diretório e `[ "$a" = "$b" ]` compara texto. O `]` é um argumento que fecha o teste.

Para ler do teclado no Bash, `read -r nome` guarda uma linha e não trata barras invertidas como escapes. `IFS= read -r nome` também preserva espaços nas pontas. O código abaixo usa argumentos; a leitura interativa fica na sua prática para não bloquear a execução automática.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
cat > saudar.sh <<'EOF'
#!/usr/bin/env bash
nome=${1:-Visitante}
if [ "$nome" = Visitante ]; then
    printf '%s\n' 'Informe seu nome na próxima vez.'
else
    printf 'Olá, %s!\n' "$nome"
fi
EOF
bash saudar.sh 'Ana Silva'
bash saudar.sh
```

Saída esperada:

```text
Olá, Ana Silva!
Informe seu nome na próxima vez.
```

## Sua vez

No Bash interativo, leia uma linha com `IFS= read -r nome`, digite seu nome e depois imprima com `printf '%s\n' "$nome"`.

<details>
<summary>Ver uma solução comentada</summary>

`read` aguarda uma linha e Enter; a linha digitada é dado de entrada, não outro comando. As aspas em `"$nome"` preservam o texto como um argumento.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
