# Resumir dados por grupo

Duas estações têm o mesmo tempo médio. Uma delas tem uma viagem sem tempo registrado. Que contagens devem acompanhar as médias?

Use pandas. Os exercícios criam tabelas no código. Se necessário, retome [Resumo de lote](#/python/registros/resumo-de-lote).

`groupby` separa linhas pela chave escolhida. Para uma coluna de medidas, `size` conta todas as linhas do grupo e `count` conta valores presentes. A média usa os valores presentes. Com `agg`, nomeie as medidas que serão apresentadas juntas. Ordenar pela chave facilita comparar as saídas.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/pandas/agregar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/pandas/agregar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/pandas.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Agrupe A:2, A:4 e B:3. Calcule as médias à mão e depois confira.

**Bash**

```bash
cd aulas/agregar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/agregar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import pandas as pd

df = pd.DataFrame({"estacao": ["A", "A", "B"], "minutos": [2, 4, 3]})
print(df.groupby("estacao")["minutos"].mean().to_dict())
```

Saída esperada

```text
{'A': 3.0, 'B': 3.0}
```

O grupo A divide por 2 e o B por 1. As médias iguais escondem denominadores diferentes.

## E2 · Altere ou depure

Inclua um tempo ausente em A. Compare os resultados de size e count.

**Bash**

```bash
cd aulas/agregar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/agregar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import pandas as pd

df = pd.DataFrame({"estacao": ["A", "A", "B", "A"], "minutos": [2, 4, 3, None]})
grupo = df.groupby("estacao")["minutos"]
print(grupo.size().to_dict())
print(grupo.count().to_dict())
```

Saída esperada

```text
{'A': 3, 'B': 1}
{'A': 2, 'B': 1}
```

A linha extra existe, mas está fora do denominador da média.

## E3 · Resolva

Para B, A, B e C com tempos 3, 0, 5 e ausente, mostre linhas, presentes e média, em ordem de estação. Verifique C, sem tempos presentes.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/agregar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/agregar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import pandas as pd

df = pd.DataFrame({"estacao": ["B", "A", "B", "C"], "minutos": [3, 0, 5, None]})
# Agrupe por estacao e faça o resumo de minutos.
```

Saída esperada

```text
A 1 1 0.0
B 2 2 4.0
C 1 0 ausente
```

<details>
<summary>Ver uma pista</summary>

Conte valores presentes na mesma coluna usada para a média.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import pandas as pd

df = pd.DataFrame({"estacao": ["B", "A", "B", "C"], "minutos": [3, 0, 5, None]})
tabela = df.groupby("estacao", sort=True)["minutos"].agg(
    linhas="size", presentes="count", media="mean"
)
for chave, linha in tabela.iterrows():
    media = "ausente" if pd.isna(linha["media"]) else f"{linha['media']:.1f}"
    print(chave, int(linha["linhas"]), int(linha["presentes"]), media)
assert pd.isna(tabela.loc["C", "media"])
```

Saída esperada

```text
A 1 1 0.0
B 2 2 4.0
C 1 0 ausente
```

O zero em A é uma observação. A média de C não é definida, pois o denominador é zero. Em seguida, use a chave de estação para adicionar um nome legível.

No ZIP, a solução está em `aulas/agregar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/pandas/juntar-tabelas)

## Fontes

- [Agrupamento de dados](https://pandas.pydata.org/docs/user_guide/groupby.html)
