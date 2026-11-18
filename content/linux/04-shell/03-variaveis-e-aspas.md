# Variáveis e aspas no Bash

Uma variável guarda texto: `nome=Ana`. **Não há espaços ao redor de `=`** em uma atribuição simples. Para ler o valor, use `$nome` ou `${nome}`. `nome = Ana` tentaria executar um comando chamado `nome`.

Aspas simples impedem a expansão: `'$nome'` é texto literal. Aspas duplas permitem expandir mantendo o resultado em um argumento: `"$nome"`. Sem aspas, o resultado pode sofrer separação em palavras e expansão de curingas. Por isso, use aspas duplas ao passar variáveis que representam textos ou caminhos.

`$(comando)` substitui o comando por sua saída, removendo quebras de linha finais. É isso que a preparação `LAB=$(mktemp -d ...)` faz. Variáveis comuns ficam no shell atual; `export nome` permite que processos filhos recebam seu valor no ambiente. Um filho não muda a variável do shell pai.

`printf '%s\n' "$nome"` usa um formato fixo e o valor como dado. Evite usar texto variável diretamente como formato, pois sequências `%` poderiam ser interpretadas.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
nome='Ana Silva'
printf '%s\n' '$nome'
printf '<%s>\n' "$nome"
arquivo='minhas notas.txt'
printf '%s\n' 'revisão' > "$arquivo"
cat "$arquivo"
```

Saída esperada:

```text
$nome
<Ana Silva>
revisão
```

## Sua vez

Guarde a palavra `Linux` na variável `assunto` e imprima a frase `Estudo Linux` usando expansão entre aspas duplas.

<details>
<summary>Ver uma solução comentada</summary>

```bash
assunto=Linux
printf '%s\n' "Estudo $assunto"
```

O texto expandido continua em um argumento.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
