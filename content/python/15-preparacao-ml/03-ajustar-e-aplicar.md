# Ajustar no treino e aplicar a regra

A distância de uma viagem de validação está ausente. Você tem alguns valores no treino e um valor alto na validação. De quais observações virá o preenchimento?

Retome [Treino, validação e teste](#/python/preparacao-ml/particoes) e [Precisão e escalas](#/python/matematica/precisao-e-escalas). Os exercícios usam a biblioteca padrão, guardam a saída do último em JSON e criam os dados de entrada no código.

Ajustar é calcular parâmetros a partir dos exemplos de treino. Aplicar é preencher e transformar com esses valores já calculados. A mediana dos valores observados no treino preenche ausentes nas três partições. Para escala mínimo-máximo, subtraia o mínimo do treino e divida pela amplitude do treino. Se a amplitude for zero, esta aula define escalados como zero. Valores novos podem ficar fora de [0, 1].

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/preparacao-ml/ajustar-e-aplicar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/preparacao-ml/ajustar-e-aplicar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/preparacao-ml.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Ache a mediana dos valores observados em [2, 4, ausente, 6].

**Bash**

```bash
cd aulas/ajustar-e-aplicar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/ajustar-e-aplicar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from statistics import median

treino = [2, 4, None, 6]
observados = [km for km in treino if km is not None]
print(median(observados))
```

Saída esperada

```text
4
```

A mediana usa três números observados. A célula ausente não entra no cálculo.

## E2 · Altere ou depure

A validação é [100, ausente]. Compare preencher com 4, da mediana do treino, e com a mediana local.

**Bash**

```bash
cd aulas/ajustar-e-aplicar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/ajustar-e-aplicar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from statistics import median

validacao = [100, None]
local = median(km for km in validacao if km is not None)
for valor in (4, local):
    print([valor if km is None else km for km in validacao])
```

Saída esperada

```text
[100, 4]
[100, 100]
```

O preenchimento com a mediana local aprende sobre o conjunto reservado. Reuse a mediana do treino.

## E3 · Resolva

Implemente ajustar e aplicar separadamente. Salve e recarregue parâmetros de [2,4,ausente,6]. Troque somente um valor de teste e confirme que o JSON guardado se mantém. Cubra amplitude zero e treino todo ausente.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/ajustar-e-aplicar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/ajustar-e-aplicar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from statistics import median

treino = [2, 4, None, 6]
teste = [None, 8]
# Separe o ajuste, a transformação e a persistência dos parâmetros.
```

Saída esperada

```text
[0.5, 1.5]
[0.5, 2.5]
treino sem km observados
```

<details>
<summary>Ver uma pista</summary>

Ajustar pode receber só o treino. Aplicar recebe um lote e os parâmetros que já foram congelados.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import json
import math
from pathlib import Path
from statistics import median

def ajustar(treino):
    observados = [km for km in treino if km is not None]
    if not observados:
        raise ValueError("treino sem km observados")
    return {"mediana": median(observados), "minimo": min(observados), "maximo": max(observados)}

def aplicar(lote, params):
    amplitude = params["maximo"] - params["minimo"]
    preenchidos = [params["mediana"] if km is None else km for km in lote]
    return [(km - params["minimo"]) / amplitude if amplitude else 0.0 for km in preenchidos]

treino = [2, 4, None, 6]
caminho = Path("parametros.json")
caminho.write_text(json.dumps(ajustar(treino), sort_keys=True), encoding="utf-8")
antes = caminho.read_text(encoding="utf-8")
params = json.loads(antes)
print(aplicar([None, 8], params))
print(aplicar([None, 12], params))
assert json.dumps(ajustar(treino), sort_keys=True) == antes
assert caminho.read_text(encoding="utf-8") == antes
assert math.isclose(aplicar([None], params)[0], 0.5, abs_tol=1e-6)
assert aplicar([None, 9], ajustar([4, None, 4])) == [0.0, 0.0]
try:
    ajustar([None])
except ValueError as erro:
    print(erro)
```

Saída esperada

```text
[0.5, 1.5]
[0.5, 2.5]
treino sem km observados
```

A troca de km altera apenas o escalado da segunda linha de teste. A min-max do treino pode produzir 2,5 e não recorta valores. Uma coluna constante mapeia todos os valores para zero pela regra explícita. A próxima aula usa o alvo de treino para uma previsão de referência.

No ZIP, a solução está em `aulas/ajustar-e-aplicar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/preparacao-ml/referencia-e-erro)

## Fontes

- [Pré-processamento e vazamento](https://scikit-learn.org/stable/common_pitfalls.html)
- [Mediana](https://docs.python.org/pt-br/3.14/library/statistics.html#statistics.median)
