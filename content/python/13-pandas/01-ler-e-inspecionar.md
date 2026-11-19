# Ler e inspecionar tabelas

Dois IDs vêm escritos como 001 e 002. Preveja o que um leitor fará se interpretar a coluna como números.

Revise [CSV](#/python/arquivos/csv). Use pandas com o kernel do curso ou com as dependências do kit. Cada exercício recebe o arquivo `dados/viagens.csv`. O script resolve o caminho a partir da sua pasta. No caderno a preparação seleciona essa pasta como diretório corrente.

Um `DataFrame` é uma tabela com índices e colunas nomeados. Uma coluna selecionada isoladamente é uma `Series`, com valores, índice e tipo próprios. `pd.read_csv` usa o cabeçalho para nomear as colunas e tenta inferir tipos quando você não os declara. `shape` informa (linhas, colunas), `dtypes` descreve cada coluna e `head(n)` oferece uma amostra das primeiras n linhas.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/pandas/ler-e-inspecionar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/pandas/ler-e-inspecionar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/pandas.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Leia o arquivo com o ID como texto para preservar os zeros. Mostre os IDs e a primeira linha.

**Bash**

```bash
cd aulas/ler-e-inspecionar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/ler-e-inspecionar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from pathlib import Path

base = Path(__file__).resolve().parent if "__file__" in globals() else Path.cwd()

import pandas as pd

caminho = base / "dados" / "viagens.csv"

viagens = pd.read_csv(caminho, dtype={"id": "string"})
print(viagens["id"].tolist())
linha = viagens.head(1).iloc[0]
print([linha["id"], float(linha["km"]), int(linha["minutos"])])
```

Saída esperada

```text
['001', '002']
['001', 2.5, 7]
```

A leitura guarda os rótulos completos como strings. head(1) mantém uma tabela com a primeira linha.

## E2 · Altere ou depure

Retire o argumento dtype e compare o valor e o tipo inferidos.

**Bash**

```bash
cd aulas/ler-e-inspecionar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/ler-e-inspecionar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from pathlib import Path

base = Path(__file__).resolve().parent if "__file__" in globals() else Path.cwd()

import pandas as pd

caminho = base / "dados" / "viagens.csv"

viagens = pd.read_csv(caminho)
print(viagens["id"].tolist())
print(viagens["id"].dtype)
```

Saída esperada

```text
[1, 2]
int64
```

O leitor reconhece inteiros e os zeros de preenchimento se perdem. Se o contrato da coluna pede um identificador, especifique texto.

## E3 · Resolva

Inventarie as linhas, colunas, tipos e unidades do arquivo. O cabeçalho indica quilômetros e minutos. Leia também sem_viagens.csv para verificar o caso de um arquivo só com o cabeçalho.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/ler-e-inspecionar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/ler-e-inspecionar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from pathlib import Path

base = Path(__file__).resolve().parent if "__file__" in globals() else Path.cwd()

import pandas as pd

caminho = base / "dados" / "viagens.csv"
# Defina os tipos e as unidades e então leia o arquivo.
```

Saída esperada

```text
Linhas e colunas: (2, 3)
id string identificador
km float64 km
minutos int64 min
```

<details>
<summary>Ver uma pista</summary>

Percorra dtypes.items() para combinar os nomes e tipos com as unidades.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path

base = Path(__file__).resolve().parent if "__file__" in globals() else Path.cwd()

import pandas as pd

caminho = base / "dados" / "viagens.csv"

def ler(caminho):
    tipos = {"id": "string", "km": "float64", "minutos": "int64"}
    return pd.read_csv(caminho, dtype=tipos)

viagens = ler(caminho)
unidades = {"id": "identificador", "km": "km", "minutos": "min"}
print("Linhas e colunas:", viagens.shape)
for coluna, tipo in viagens.dtypes.items():
    print(coluna, tipo, unidades[coluna])
assert ler(caminho.with_name("sem_viagens.csv")).shape == (0, 3)
```

Saída esperada

```text
Linhas e colunas: (2, 3)
id string identificador
km float64 km
minutos int64 min
```

Os tipos foram declarados e as unidades vêm do contrato. O cabeçalho preserva as colunas mesmo sem observações. A seguir, use rótulos para selecionar dados.

No ZIP, a solução está em `aulas/ler-e-inspecionar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/pandas/selecionar-e-transformar)

## Fontes

- [Leitura de CSV](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)
- [Inspeção de dados tabulares](https://pandas.pydata.org/docs/getting_started/intro_tutorials/02_read_write.html)
