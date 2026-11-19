# Auditar a qualidade dos dados

Você recebeu uma tabela de viagens. Em uma linha, a distância é zero. Em outra, está vazia. O que cada caso significa para quem analisa?

Use pandas e retome [Chaves e junções](#/python/pandas/juntar-tabelas). As tabelas são declaradas no código.

Esquema é a descrição de campos, tipos e unidades. Aqui `id` é texto, `km` é distância e deve ser não negativa quando presente. `isna()` detecta ausência. Zero é um número dentro do domínio. `duplicated()` marca ocorrências excedentes de uma linha idêntica. Se a mesma chave identifica duas linhas diferentes, há um conflito que precisa de apuração.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/exploracao/qualidade-dos-dados.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/exploracao/qualidade-dos-dados-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/exploracao.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Examine as linhas a:0, b:ausente, a:0. Liste IDs com ausência, com zero e de ocorrências repetidas.

**Bash**

```bash
cd aulas/qualidade-dos-dados/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/qualidade-dos-dados/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import pandas as pd

df = pd.DataFrame({"id": ["a", "b", "a"], "km": [0, None, 0]})
print("Ausentes:", df.loc[df["km"].isna(), "id"].tolist())
print("Zeros:", df.loc[df["km"].eq(0), "id"].tolist())
print("Duplicatas excedentes:", df.loc[df.duplicated(), "id"].tolist())
```

Saída esperada

```text
Ausentes: ['b']
Zeros: ['a', 'a']
Duplicatas excedentes: ['a']
```

A ausência é uma propriedade da célula. A duplicata descreve a linha excedente.

## E2 · Altere ou depure

Inclua também a:3. Remova cópias exatas apenas numa tabela temporária. Aponte os IDs conflitantes.

**Bash**

```bash
cd aulas/qualidade-dos-dados/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/qualidade-dos-dados/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import pandas as pd

df = pd.DataFrame({"id": ["a", "b", "a", "a"], "km": [0, None, 0, 3]})
unicas = df.drop_duplicates()
conflitos = unicas.loc[unicas["id"].duplicated(keep=False), "id"].unique()
print(conflitos.tolist())
```

Saída esperada

```text
['a']
```

Depois de retirar a repetição exata, a ainda aponta para duas linhas com distâncias diferentes.

## E3 · Resolva

Audite ausências, negativos, duplicatas excedentes e conflitos de ID sem alterar o original. Use a:0, b:ausente, c:-2, a:0 e a:1. No caso de borda c:-2, mantenha a linha disponível para inspeção e só liste no relatório.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/qualidade-dos-dados/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/qualidade-dos-dados/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import pandas as pd

df = pd.DataFrame({"id": ["a", "b", "c", "a", "a"], "km": [0, None, -2, 0, 1]})
# Monte uma lista de IDs por regra.
```

Saída esperada

```text
km ausentes 1 ['b']
km negativos 1 ['c']
duplicatas excedentes 1 ['a']
IDs em conflito 1 ['a']
```

<details>
<summary>Ver uma pista</summary>

Investigue duplicidade de ID depois de retirar apenas cópias exatas, em um objeto separado.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import pandas as pd

def auditar(df):
    unicas = df.drop_duplicates()
    conflitos = unicas.loc[unicas["id"].duplicated(keep=False), "id"].unique()
    return {
        "km ausentes": df.loc[df["km"].isna(), "id"].tolist(),
        "km negativos": df.loc[df["km"].lt(0), "id"].tolist(),
        "duplicatas excedentes": df.loc[df.duplicated(), "id"].tolist(),
        "IDs em conflito": sorted(conflitos.tolist()),
    }

df = pd.DataFrame({"id": ["a", "b", "c", "a", "a"], "km": [0, None, -2, 0, 1]})
for regra, ids in auditar(df).items():
    print(regra, len(ids), ids)
assert len(df) == 5
assert df.loc[2, "km"] == -2
```

Saída esperada

```text
km ausentes 1 ['b']
km negativos 1 ['c']
duplicatas excedentes 1 ['a']
IDs em conflito 1 ['a']
```

As três primeiras medidas contam linhas brutas. A quarta conta chaves distintas em conflito. A própria tabela permanece disponível para decidir o destino de cada linha. Com a qualidade descrita, avance para distribuições.

No ZIP, a solução está em `aulas/qualidade-dos-dados/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/exploracao/distribuicoes)

## Fontes

- [Dados ausentes](https://pandas.pydata.org/docs/user_guide/missing_data.html)
- [Duplicatas](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html)
