# Audite as viagens antes de preparar

Uma equipe quer prever a duração de uma viagem antes de ela partir. Cada linha é uma viagem fictícia. O contrato da entrada prevê ID textual, data ISO, código de estação, distância planejada em km, paradas como contagem, duração real em minutos e faturamento em minutos após a chegada. O segundo CSV relaciona códigos e nomes de estações. Comece com os arquivos sintéticos da atividade. Preserve-os. Revise [duplicatas e qualidade](#/python/exploracao/qualidade-dos-dados).

Compare duplicata exata com conflito de ID. Retire apenas a cópia idêntica. Se houver dados divergentes com mesmo ID, os critérios do projeto exigem interromper para esclarecimento. Rejeite distâncias negativas e alvos ausentes ou inválidos. Ausência de distância pode ser tratada depois. Zero paradas é válido. Guarde o ID em todas as decisões e use uma junção à esquerda para encontrar estações sem cadastro.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projeto/auditar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projeto/auditar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projeto.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Leia os dois CSVs e conte observações antes de limpar.

**Bash**

```bash
cd aulas/auditar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/auditar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import pandas as pd
viagens = pd.read_csv("dados/viagens.csv", dtype={"id":"string"})
estacoes = pd.read_csv("dados/estacoes.csv", dtype="string")
print(viagens.shape)
print(estacoes["estacao"].tolist())
print(viagens["id"].iloc[0])
```

Saída esperada

```text
(12, 7)
['A', 'B']
V01
```

O cabeçalho descreve sete colunas. A tabela de estações tem duas chaves e a de viagens tem 12 registros brutos.

## E2 · Altere ou depure

Localize a cópia extra, as distâncias ausentes e os zeros de paradas, sem editar os dados.

**Bash**

```bash
cd aulas/auditar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/auditar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import pandas as pd
brutas = pd.read_csv("dados/viagens.csv")
print(brutas.loc[brutas.duplicated(), "id"].tolist())
print(brutas.loc[brutas["km_planejados"].isna(), "id"].tolist())
print(brutas.loc[brutas["paradas_planejadas"].eq(0), "id"].tolist())
```

Saída esperada

```text
['V04']
['V03', 'V08']
['V01', 'V08']
```

Zero é uma observação. Ausente é uma lacuna. V08 mostra que uma linha pode ter os dois em colunas diferentes.

## E3 · Resolva

Produza auditoria.json com contagem antes e depois, motivos, unidades e IDs. Faça uma junção que preserve viagens e identifique a estação ausente.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/auditar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/auditar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import pandas as pd
brutas = pd.read_csv("dados/viagens.csv")
estacoes = pd.read_csv("dados/estacoes.csv")
# Preserve brutas. Registre os motivos de cada exclusão e faça a junção.
```

Saída esperada

```text
12 10
{'V04': 1}
{'V11': ['km_planejados negativo']}
['V03', 'V08'] ['V08']
```

<details>
<summary>Ver uma pista</summary>

Audite primeiro as cópias idênticas. Depois procure IDs repetidos nos registros únicos e valide o domínio.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from auditoria_viagens import salvar_json
salvar_json(Path("auditoria.json"), auditoria)
assert set(validas["id"]) == {f"V{i:02}" for i in range(1, 11)}
print(auditoria["linhas_brutas"], auditoria["linhas_validas"])
print(auditoria["duplicatas_excedentes"])
print(auditoria["rejeitadas"])
print(auditoria["km_ausentes_validas"], auditoria["viagens_sem_cadastro"])
```

Saída esperada

```text
12 10
{'V04': 1}
{'V11': ['km_planejados negativo']}
['V03', 'V08'] ['V08']
```

V11 falha pelo domínio, V04 aparece uma vez na saída e V08 permanece mesmo com estação desconhecida. V07 tem valor alto porém válido. Um conflito de ID deve produzir erro em vez de apagar uma versão. A solução inclui as regras no arquivo auditoria_viagens.py.

No ZIP, a solução está em `aulas/auditar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projeto/preparar)

## Fontes

- [Importar tabelas](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html)
- [Juntar tabelas](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html)
