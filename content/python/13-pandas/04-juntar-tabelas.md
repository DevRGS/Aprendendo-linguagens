# Chaves e junções de tabelas

Anexe nomes de estação a uma tabela em que uma linha é uma viagem. O que deverá acontecer com uma viagem que usa uma estação sem cadastro?

Use pandas. Retome [Resumir dados por grupo](#/python/pandas/agregar). As tabelas são criadas no código.

Uma chave relaciona registros. Muitas viagens podem apontar para a mesma estação, mas o cadastro deve ter no máximo uma linha por chave. `merge` com `how="left"` mantém as viagens do lado esquerdo. Um `inner` conserva somente linhas com par. `validate="many_to_one"` verifica a unicidade na direita. `indicator=True` cria a coluna `_merge`, que contém `left_only` para viagem sem par.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/pandas/juntar-tabelas.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/pandas/juntar-tabelas-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/pandas.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Combine duas viagens com o cadastro e confira que os IDs de viagem continuam na saída.

**Bash**

```bash
cd aulas/juntar-tabelas/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/juntar-tabelas/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import pandas as pd

viagens = pd.DataFrame({"id": ["v1", "v2"], "estacao": ["A", "A"]})
estacoes = pd.DataFrame({"estacao": ["A", "B"], "nome": ["Centro", "Norte"]})
uniao = viagens.merge(estacoes, on="estacao", how="left", validate="many_to_one")
print(uniao[["id", "nome"]].values.tolist())
```

Saída esperada

```text
[['v1', 'Centro'], ['v2', 'Centro']]
```

As duas viagens recebem o nome da única linha referente a A no cadastro.

## E2 · Altere ou depure

Crie duas linhas com chave A no cadastro. Compare a junção simples com o erro intencional usando a validação many_to_one.

**Bash**

```bash
cd aulas/juntar-tabelas/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/juntar-tabelas/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import pandas as pd

viagens = pd.DataFrame({"id": ["v1", "v2"], "estacao": ["A", "B"]})
estacoes = pd.DataFrame({"estacao": ["A", "A", "B"], "nome": ["Centro", "Sul", "Norte"]})
print("Linhas sem validação:", len(viagens.merge(estacoes, on="estacao", how="left")))
try:
    viagens.merge(estacoes, on="estacao", how="left", validate="many_to_one")
except pd.errors.MergeError:
    print("MergeError: chave duplicada no cadastro")
```

Saída esperada

```text
Linhas sem validação: 3
MergeError: chave duplicada no cadastro
```

A viagem v1 teria duas combinações. Investigue o cadastro antes de tentar novamente.

## E3 · Resolva

Enriqueça três viagens e liste os IDs sem cadastro. Compare com inner e confira o caso de um cadastro vazio com as mesmas colunas.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/juntar-tabelas/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/juntar-tabelas/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import pandas as pd

viagens = pd.DataFrame({"id": ["v1", "v2", "v3"], "estacao": ["A", "C", "B"]})
estacoes = pd.DataFrame({"estacao": ["A", "B"], "nome": ["Centro", "Norte"]})
# Faça a junção e liste os IDs sem par.
```

Saída esperada

```text
IDs: ['v1', 'v2', 'v3']
Sem par: ['v2']
Linhas com inner: 2
```

<details>
<summary>Ver uma pista</summary>

Filtre _merge pelo rótulo que indica uma linha presente apenas no lado esquerdo.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import pandas as pd

def enriquecer(viagens, estacoes):
    return viagens.merge(estacoes, on="estacao", how="left",
                          validate="many_to_one", indicator=True)

viagens = pd.DataFrame({"id": ["v1", "v2", "v3"], "estacao": ["A", "C", "B"]})
estacoes = pd.DataFrame({"estacao": ["A", "B"], "nome": ["Centro", "Norte"]})
uniao = enriquecer(viagens, estacoes)
sem_par = uniao.loc[uniao["_merge"] == "left_only", "id"]
print("IDs:", uniao["id"].tolist())
print("Sem par:", sem_par.tolist())
print("Linhas com inner:", len(viagens.merge(estacoes, on="estacao", how="inner")))
assert enriquecer(viagens, estacoes.iloc[:0])["_merge"].eq("left_only").all()
```

Saída esperada

```text
IDs: ['v1', 'v2', 'v3']
Sem par: ['v2']
Linhas com inner: 2
```

A viagem v2 continua na junção à esquerda. Com cadastro vazio, todas as viagens ficam sem par. Em seguida, leve essa contagem à auditoria.

No ZIP, a solução está em `aulas/juntar-tabelas/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/exploracao/qualidade-dos-dados)

## Fontes

- [Junção de DataFrames](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html)
