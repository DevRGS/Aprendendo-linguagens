# Seleções e colunas derivadas

Você precisa filtrar viagens longas e calcular tempo por quilômetro. Decida o que a saída deve mostrar para uma viagem de distância zero.

Retome [Ler e inspecionar](#/python/pandas/ler-e-inspecionar) e use pandas. As tabelas são criadas no código.

`loc` seleciona por rótulos e aceita uma máscara booleana alinhada pelo índice. `iloc` usa posições inteiras começando em zero. Com índices de 10, 30 e 50, `loc[30]` e `iloc[1]` selecionam a segunda linha. Faça uma cópia para acrescentar uma coluna sem editar a origem. Para calcular a taxa, torne ausentes os denominadores zero antes da divisão.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/pandas/selecionar-e-transformar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/pandas/selecionar-e-transformar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/pandas.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Quais viagens têm pelo menos 5 km? Faça uma máscara e selecione os IDs com loc.

**Bash**

```bash
cd aulas/selecionar-e-transformar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/selecionar-e-transformar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import pandas as pd

viagens = pd.DataFrame({"id": ["a", "b", "c"], "km": [4, 5, 9]})
mascara = viagens["km"] >= 5
print(viagens.loc[mascara, "id"].tolist())
```

Saída esperada

```text
['b', 'c']
```

A máscara inclui a viagem no limite. O segundo argumento seleciona a coluna de ID.

## E2 · Altere ou depure

Use índices 10, 30 e 50. Ache a segunda linha pelo rótulo e pela posição. Compare com a tentativa intencionalmente errada de usar loc[1].

**Bash**

```bash
cd aulas/selecionar-e-transformar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/selecionar-e-transformar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import pandas as pd

viagens = pd.DataFrame({"id": ["a", "b", "c"], "km": [4, 5, 9]}, index=[10, 30, 50])
print(viagens.loc[30, "id"], viagens.iloc[1, 0])
try:
    viagens.loc[1]
except KeyError:
    print("KeyError: rótulo 1 ausente")
```

Saída esperada

```text
b b
KeyError: rótulo 1 ausente
```

Use iloc[1] quando 1 indica posição. Como o rótulo 1 está ausente, loc[1] gera a exceção.

## E3 · Resolva

Acrescente a coluna min_por_km em uma cópia. No caso de 0 km, a taxa deve ficar ausente. Confira que a tabela original segue com as duas colunas iniciais.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/selecionar-e-transformar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/selecionar-e-transformar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import pandas as pd

original = pd.DataFrame({"km": [5, 0, 2], "minutos": [15, 3, 8]})
taxas = original.copy()
# Prepare os denominadores e faça a divisão.
```

Saída esperada

```text
[3.0, 4.0]
Índice da taxa ausente: [1]
```

<details>
<summary>Ver uma pista</summary>

Prepare os denominadores antes de dividir. Que condição preserva valores diferentes de zero?

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import pandas as pd

original = pd.DataFrame({"km": [5, 0, 2], "minutos": [15, 3, 8]})
taxas = original.copy()
distancias = taxas["km"].where(taxas["km"] != 0)
taxas["min_por_km"] = taxas["minutos"] / distancias
print(taxas["min_por_km"].dropna().tolist())
print("Índice da taxa ausente:", taxas.index[taxas["min_por_km"].isna()].tolist())
assert original.columns.tolist() == ["km", "minutos"]
assert pd.isna(taxas.loc[1, "min_por_km"])
```

Saída esperada

```text
[3.0, 4.0]
Índice da taxa ausente: [1]
```

A unidade é min/km. where conserva valores com condição verdadeira e marca os demais como ausentes. A distância permanece zero e somente a taxa fica ausente. A seguir, veja como ausentes afetam resumos.

No ZIP, a solução está em `aulas/selecionar-e-transformar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/pandas/agregar)

## Fontes

- [Seleção de dados tabulares](https://pandas.pydata.org/docs/getting_started/intro_tutorials/03_subset_data.html)
- [Método Series.where](https://pandas.pydata.org/docs/reference/api/pandas.Series.where.html)
