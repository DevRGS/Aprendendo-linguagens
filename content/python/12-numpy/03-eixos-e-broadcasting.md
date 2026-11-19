# Eixos e broadcasting

Na tabela `[[1, 2], [3, 4]]`, marque os pares que entram na média de cada coluna. Como essa escolha muda se a média for de cada linha?

Retome [Arrays](#/python/numpy/arrays) e use NumPy. As atividades criam as matrizes que usam.

Somar, subtrair ou multiplicar duas matrizes compatíveis aplica a operação elemento a elemento. Uma agregação reduz valores ao longo do eixo indicado. Em 2D, `axis=0` percorre as linhas e deixa um resultado por coluna. `axis=1` percorre as colunas e deixa um resultado por linha.

No *broadcasting*, o NumPy compara as dimensões da direita para a esquerda. Dimensões iguais ou com 1 em um dos lados são compatíveis, e dimensões que faltam à esquerda contam como 1. Isso permite subtrair `[2, 3]` de cada linha da matriz de duas colunas.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/numpy/eixos-e-broadcasting.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/numpy/eixos-e-broadcasting-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/numpy.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Escreva os dois pares que entram nas médias. Calcule uma média por coluna.

**Bash**

```bash
cd aulas/eixos-e-broadcasting/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/eixos-e-broadcasting/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
medias = a.mean(axis=0)
print(medias.shape, medias.tolist())
```

Saída esperada

```text
(2,) [2.0, 3.0]
```

O cálculo reúne 1 e 3 para a primeira média e 2 e 4 para a segunda.

## E2 · Altere ou depure

Subtraia o vetor de médias das linhas. Verifique que as médias por coluna chegam a zero.

**Bash**

```bash
cd aulas/eixos-e-broadcasting/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/eixos-e-broadcasting/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
centrada = a - a.mean(axis=0)
print(centrada.tolist())
print(centrada.mean(axis=0).tolist())
```

Saída esperada

```text
[[-1.0, -1.0], [1.0, 1.0]]
[0.0, 0.0]
```

O vetor de forma (2,) alinha com o último eixo (colunas). A média da primeira coluna é subtraída de 1 e 3, por exemplo.

## E3 · Resolva

Centre as **linhas** de `[[1, 3], [4, 8], [2, 2]]`. Preveja as formas de `a` e de `a.mean(axis=1)`. Reproduza a subtração direta como erro intencional e corrija para preservar a forma. Verifique também uma única linha.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/eixos-e-broadcasting/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/eixos-e-broadcasting/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import numpy as np

dados = [[1, 3], [4, 8], [2, 2]]
a = np.array(dados, dtype=float)
# Calcule as médias das linhas preservando a dimensão reduzida.
```

Saída esperada

```text
(3, 2) (3,)
ValueError: dimensões finais incompatíveis
[[-1.0, 1.0], [-2.0, 2.0], [0.0, 0.0]]
```

<details>
<summary>Ver uma pista</summary>

Qual dimensão deve ser preservada para obter médias de forma (3, 1)?

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import numpy as np

def centrar_linhas(a):
    return a - a.mean(axis=1, keepdims=True)

dados = [[1, 3], [4, 8], [2, 2]]
a = np.array(dados, dtype=float)
medias_linhas = a.mean(axis=1)
print(a.shape, medias_linhas.shape)
try:
    a - medias_linhas
except ValueError:
    print("ValueError: dimensões finais incompatíveis")

centrada = centrar_linhas(a)
print(centrada.tolist())
assert centrada.shape == a.shape
np.testing.assert_allclose(centrada.mean(axis=1), 0, atol=1e-9)
np.testing.assert_allclose(centrar_linhas(np.array([[3, 7]])), [[-2, 2]])
```

Saída esperada

```text
(3, 2) (3,)
ValueError: dimensões finais incompatíveis
[[-1.0, 1.0], [-2.0, 2.0], [0.0, 0.0]]
```

O erro ocorre porque 2 e 3 se encontram na última dimensão. Com `keepdims=True` as médias ficam em (3, 1), uma por linha, e cada média é subtraída das duas colunas da sua linha. Também funciona com uma única linha. Por que uma matriz quadrada pode mascarar o erro ao omitir `keepdims`? Ela alinha as médias ao eixo das colunas sem falhar. A próxima aula usa os mesmos eixos para combinar colunas com pesos.

No ZIP, a solução está em `aulas/eixos-e-broadcasting/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/numpy/produto-matricial)

## Fontes

- [Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html)
- [Média por eixo](https://numpy.org/doc/stable/reference/generated/numpy.mean.html)
