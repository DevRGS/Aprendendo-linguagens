# Observação, atributos e alvo

A empresa quer estimar a duração de uma viagem antes da partida. Em que momento cada medida fica disponível? Faça essa previsão para distância planejada, chegada real e duração real.

Retome [Comunicar resultados](#/python/exploracao/relatorio-visual) e [Arrays](#/python/numpy/arrays). Use pandas. Cada atividade contém seus próprios dados.

O instante de decisão é antes da partida. Uma observação é uma viagem. Os atributos em `X` são medidas disponíveis para a previsão, como km planejados. O alvo em `y` é o que queremos estimar, aqui minutos reais. IDs são úteis para rastrear qual saída vem de qual observação. Guarde-os à parte. Evite colunas obtidas após a viagem, como o horário de chegada real, para impedir vazamento de informação.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/preparacao-ml/observacao-atributo-alvo.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/preparacao-ml/observacao-atributo-alvo-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/preparacao-ml.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Em duas viagens, separe quilômetros planejados e duração real. Confira um atributo por viagem e um alvo por viagem.

**Bash**

```bash
cd aulas/observacao-atributo-alvo/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/observacao-atributo-alvo/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import pandas as pd

df = pd.DataFrame({"id": ["a", "b"], "km_planejados": [2, 5], "minutos_reais": [6, 12]})
X = df[["km_planejados"]].to_numpy()
y = df["minutos_reais"].to_numpy()
print(X.shape, X.tolist())
print(y.shape, y.tolist())
```

Saída esperada

```text
(2, 1) [[2], [5]]
(2,) [6, 12]
```

A seleção por lista mantém uma tabela de uma coluna para X. A seleção pelo nome da coluna fornece um vetor para y.

## E2 · Altere ou depure

Adicione o horário real de chegada. Separe as colunas em atributos, rastreio, alvo e informação pós-partida excluída.

**Bash**

```bash
cd aulas/observacao-atributo-alvo/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/observacao-atributo-alvo/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import pandas as pd

df = pd.DataFrame({
    "id": ["a", "b"], "km_planejados": [2, 5],
    "minutos_reais": [6, 12], "chegada_real": ["08:06", "09:12"],
})
atributos = ["km_planejados"]
metadados = ["id"]
alvo = "minutos_reais"
excluidas = [nome for nome in df if nome not in [*atributos, *metadados, alvo]]
print("X:", atributos, "y:", alvo)
print("Rastreio:", metadados, "Pós-partida:", excluidas)
```

Saída esperada

```text
X: ['km_planejados'] y: minutos_reais
Rastreio: ['id'] Pós-partida: ['chegada_real']
```

ID só rastreia as linhas neste problema. A chegada real ainda não ocorreu quando precisamos estimar o tempo.

## E3 · Resolva

Documente a disponibilidade, unidade e papel das cinco colunas abaixo. Extraia X e y na ordem das mesmas linhas, incluindo duas viagens de dados deliberadamente fora de ordem alfabética. Confira também uma entrada de uma única viagem.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/observacao-atributo-alvo/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/observacao-atributo-alvo/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import pandas as pd

df = pd.DataFrame({
    "id": ["b", "a"], "km_planejados": [5, 2], "paradas_planejadas": [1, 0],
    "chegada_real": ["09:12", "08:06"], "minutos_reais": [12, 6],
})
# Defina o contrato e preserve os IDs ao selecionar X e y.
```

Saída esperada

```text
id antes, chave, rastreio
km_planejados antes, km, atributo
paradas_planejadas antes, contagem, atributo
chegada_real depois, horário local, fora de X
minutos_reais depois, min, alvo
(2, 2) (2,) ['b', 'a']
```

<details>
<summary>Ver uma pista</summary>

Escolha colunas da mesma tabela sem reordenar X e y de forma independente.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import pandas as pd

def separar(df):
    atributos = ["km_planejados", "paradas_planejadas"]
    return df[atributos].to_numpy(), df["minutos_reais"].to_numpy(), df["id"].tolist()

df = pd.DataFrame({
    "id": ["b", "a"], "km_planejados": [5, 2], "paradas_planejadas": [1, 0],
    "chegada_real": ["09:12", "08:06"], "minutos_reais": [12, 6],
})
contrato = {
    "id": "antes, chave, rastreio",
    "km_planejados": "antes, km, atributo",
    "paradas_planejadas": "antes, contagem, atributo",
    "chegada_real": "depois, horário local, fora de X",
    "minutos_reais": "depois, min, alvo",
}
for coluna, descricao in contrato.items():
    print(coluna, descricao)
X, y, ids = separar(df)
print(X.shape, y.shape, ids)
assert X.tolist() == [[5, 1], [2, 0]] and y.tolist() == [12, 6]
unica, alvo_unico, ids_unicos = separar(df.iloc[:1])
assert unica.shape == (1, 2) and alvo_unico.shape == (1,) and ids_unicos == ["b"]
```

Saída esperada

```text
id antes, chave, rastreio
km_planejados antes, km, atributo
paradas_planejadas antes, contagem, atributo
chegada_real depois, horário local, fora de X
minutos_reais depois, min, alvo
(2, 2) (2,) ['b', 'a']
```

Cada linha de X está ligada à mesma posição de y por seu ID. A forma funciona mesmo com uma linha. Em seguida, os grupos inteiros serão divididos em partições por data.

No ZIP, a solução está em `aulas/observacao-atributo-alvo/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/preparacao-ml/particoes)

## Fontes

- [Vazamento de dados](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
- [Converter tabela em array](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_numpy.html)
