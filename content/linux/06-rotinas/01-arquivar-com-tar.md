# Agrupar e extrair arquivos com tar

`tar` reúne arquivos em um **arquivo de arquivo**, também chamado archive. Agrupar e comprimir são operações diferentes: `tar -cf pacote.tar pasta` agrupa sem pedir compressão; `tar -czf pacote.tar.gz pasta` também usa gzip.

| Opção | Função |
|---|---|
| `-c` | Criar archive |
| `-t` | Listar conteúdo |
| `-x` | Extrair |
| `-z` | Usar gzip |
| `-f arquivo` | Indicar o nome do archive |
| `-C pasta` | Mudar a pasta usada pela operação |

Em `tar -czf pacote.tar.gz notas`, o argumento depois de `-f` é o archive, e `notas` é a origem. Coloque a saída fora da pasta de origem. O arquivo `.tar.gz` não é um `.zip`.

Antes de extrair, liste com `tar -tzf pacote.tar.gz`. Para praticar, extraia o pacote que você mesmo criou em uma pasta vazia com `-C`. Arquivos extraídos podem substituir nomes existentes; não extraia material desconhecido diretamente sobre seus documentos.

## Experimente no seu terminal

No **Bash do Linux/Ubuntu**, prepare uma pasta nova para esta aula. As duas linhas abaixo guardam o caminho em `LAB` e entram nessa pasta; não precisam dos arquivos de nenhuma outra aula.

```bash
LAB=$(mktemp -d "$HOME/terminal-linux.XXXXXX")
cd "$LAB"
```

Execute:

```bash
mkdir notas destino
printf '%s\n' 'Revisar Bash' > notas/plano.txt
tar -czf pacote.tar.gz notas
tar -tzf pacote.tar.gz
tar -xzf pacote.tar.gz -C destino
cat destino/notas/plano.txt
```

Saída esperada:

```text
notas/
notas/plano.txt
Revisar Bash
```

## Sua vez

Liste o conteúdo do pacote novamente, sem extrair. Qual opção distingue listar de extrair?

<details>
<summary>Ver uma solução comentada</summary>

```bash
tar -tzf pacote.tar.gz
```

`-t` lista; `-x` extrai. Ambas usam `-f` para indicar o archive.

</details>

## Fontes

- [GNU tar — manual](https://www.gnu.org/software/tar/manual/tar.html)
