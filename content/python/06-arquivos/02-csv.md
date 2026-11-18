# Ler e escrever CSV

Some durações de dois registros. Antes de rodar, preveja se `minutos` chega à leitura como número ou texto. Retome [arquivos de texto](#/python/arquivos/caminhos-e-texto) e [dicionários](#/python/registros/dicionarios).

O cabeçalho do CSV nomeia as colunas. O delimitador usado aqui é a vírgula, que também pode fazer parte do conteúdo de um campo delimitado por aspas. `DictReader` transforma cada registro em dicionário. Converta `linha["minutos"]` com `int` antes de somar. Abra CSV com `encoding="utf-8", newline=""` para que a biblioteca trate as quebras de linha, inclusive dentro de campos entre aspas.

A preparação do caderno cria as entradas de cada exercício. No terminal, localize-as na pasta do exercício do kit. Depois de reler a tabela filtrada, pense em como guardar números sem convertê-los a cada leitura e siga para [JSON](#/python/arquivos/json).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/arquivos/csv.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/arquivos/csv-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/arquivos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Leia `sessoes.csv` com cabeçalho `id,minutos` e registros de 3 e 7 minutos. Mostre o tipo de cada campo minutos antes da conversão e o total 10.

**Bash**

```bash
cd aulas/csv/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/csv/e1
py exemplo.py
```

```python
from pathlib import Path
from csv import DictReader

with Path("sessoes.csv").open(encoding="utf-8", newline="") as arquivo:
    total = 0
    for linha in DictReader(arquivo):
        print(type(linha["minutos"]).__name__)
        total += int(linha["minutos"])
print(total)
```

Saída esperada

```text
str
str
10
```

O cabeçalho fornece as chaves. A conversão explícita permite a soma numérica.

## E2 · Altere ou depure

Compare a leitura de `01,"fruta, suco"` com a divisão por vírgula. Quantos pedaços o `split` produz para o registro?

**Bash**

```bash
cd aulas/csv/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/csv/e2
py variacao.py
```

```python
from pathlib import Path
from csv import DictReader

caminho = Path("pedidos.csv")
with caminho.open(encoding="utf-8", newline="") as arquivo:
    pedido = next(DictReader(arquivo))
    print(pedido["observacao"])

linha = caminho.read_text(encoding="utf-8").splitlines()[1]
print(len(linha.split(",")))
```

Saída esperada

```text
fruta, suco
3
```

A vírgula interna faz parte da observação. O split corta nela também e produz três pedaços para duas colunas.

## E3 · Resolva

Filtre `sessoes.csv` por minutos ≥ 5, grave `selecionadas.csv` com cabeçalho `id,minutos` e releia. Mostre pares com ID como texto e minutos como inteiro. Sem linhas selecionadas, preserve o cabeçalho.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/csv/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/csv/e3
py exercicio.py
```

```python
from pathlib import Path
from csv import DictReader, DictWriter

origem = Path("sessoes.csv")
destino = Path("selecionadas.csv")
# Escreva o cabeçalho, filtre a origem e releia o destino.
```

Saída esperada

```text
('02', 7)
('03', 5)
```

<details>
<summary>Ver uma pista</summary>

Chame `writeheader()` antes do laço de seleção.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path
from csv import DictReader, DictWriter

destino = Path("selecionadas.csv")
with Path("sessoes.csv").open(encoding="utf-8", newline="") as entrada:
    with destino.open("w", encoding="utf-8", newline="") as saida:
        escritor = DictWriter(saida, fieldnames=["id", "minutos"])
        escritor.writeheader()
        for linha in DictReader(entrada):
            if int(linha["minutos"]) >= 5:
                escritor.writerow(linha)

with destino.open(encoding="utf-8", newline="") as saida:
    for linha in DictReader(saida):
        print((linha["id"], int(linha["minutos"])))
```

Saída esperada

```text
('02', 7)
('03', 5)
```

Escreva o cabeçalho antes do filtro. Converta a duração novamente ao reler. O ID mantém o zero à esquerda. Sem selecionados, o último laço não imprime linhas.

No ZIP, a solução está em `aulas/csv/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/arquivos/json)

## Fontes

- [Leitores e escritores de CSV](https://docs.python.org/3.14/library/csv.html#module-contents)
