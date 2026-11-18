# Seu primeiro script Bash

Um **script** é um arquivo com comandos. Você pode criá-lo num editor de texto; aqui usamos um here-document para escrever um exemplo completo. `cat > ola.sh <<'EOF'` grava as linhas até o delimitador `EOF`. As aspas no delimitador impedem que o Bash expanda o conteúdo durante a criação do arquivo.

A primeira linha `#!/usr/bin/env bash` é o **shebang**: ao executar o arquivo diretamente, pede ao sistema que encontre Bash pelo ambiente. Para esse modo, o arquivo precisa ter permissão de execução e um caminho como `./ola.sh`; a pasta atual normalmente não está no PATH.

Outra forma é `bash ola.sh`: você escolhe o interpretador explicitamente. Nesse caso, não precisa do bit de execução, mas precisa conseguir ler o arquivo. Usar `sh ola.sh` pode escolher outro shell e não garante os recursos do Bash.

No Windows, crie o arquivo dentro do Ubuntu/WSL ou salve com finais de linha **LF**. Arquivos com CRLF podem produzir erros como interpretador inexistente ou caracteres inesperados. O nome `.sh` é uma convenção; não concede permissões nem escolhe o interpretador por si só.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
cat > ola.sh <<'EOF'
#!/usr/bin/env bash
printf '%s\n' 'Olá do script!'
EOF
bash ola.sh
chmod u+x ola.sh
./ola.sh
```

Saída esperada:

```text
Olá do script!
Olá do script!
```

## Sua vez

Abra `ola.sh` num editor, mude a mensagem, salve e execute novamente com `bash ola.sh`. Por que `./` é necessário na execução direta?

<details>
<summary>Ver uma solução comentada</summary>

`./` indica o arquivo no diretório atual. Sem uma barra, o shell procura pelo nome segundo suas regras de resolução, incluindo o PATH; não presume que seja um arquivo da pasta atual.

</details>

## Fontes

- [GNU Bash — manual de referência](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils — manual das ferramentas](https://www.gnu.org/software/coreutils/manual/html_node/index.html)
