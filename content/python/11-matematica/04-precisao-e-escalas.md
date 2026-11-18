# Precisão, centralização e escalas

Números float representam muitos decimais por aproximação binária. Use isclose para verificar uma diferença aceitável e indique tolerância absoluta perto de zero. Centralizar subtrai a média de cada observação. Normalizar pelo intervalo subtrai o mínimo e divide pela amplitude. Um vetor constante exige uma regra porque a amplitude é zero. Guarde a unidade antes de transformar. Revise [centro e dispersão](#/python/matematica/centro-e-dispersao).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/matematica/precisao-e-escalas.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/matematica/precisao-e-escalas-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/matematica.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Compare 0.1+0.2 com 0.3 por igualdade e tolerância.

**Bash**

```bash
cd aulas/precisao-e-escalas/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/precisao-e-escalas/e1
py exemplo.py
```

```python
from math import isclose
print(0.1 + 0.2 == 0.3)
print(isclose(0.1 + 0.2, 0.3, abs_tol=1e-9))
```

Saída esperada

```text
False
True
```

A representação binária pode produzir um pequeno erro de arredondamento.

## E2 · Altere ou depure

Centralize [2,4,6] e confira a média dos resultados.

**Bash**

```bash
cd aulas/precisao-e-escalas/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/precisao-e-escalas/e2
py variacao.py
```

```python
from statistics import mean
valores = [2,4,6]
centro = mean(valores)
centrados = [x-centro for x in valores]
print(centrados)
print(mean(centrados))
```

Saída esperada

```text
[-2, 0, 2]
0
```

Cada valor foi deslocado por 4. A unidade é preservada.

## E3 · Resolva

Normalize [2,4,8] pela amplitude. Comprove, por tolerância, o valor intermediário. Use zero para coluna constante.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/precisao-e-escalas/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/precisao-e-escalas/e3
py exercicio.py
```

```python
valores = [2, 4, 8]
# Implemente escalar e teste [5, 5] também.
```

Saída esperada

```text
[0.0, 0.333, 1.0]
[0.0, 0.0]
```

<details>
<summary>Ver uma pista</summary>

Calcule a amplitude antes de calcular os valores para decidir qual regra usar.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from math import isclose
def escalar(valores):
    minimo, maximo = min(valores), max(valores)
    amplitude = maximo - minimo
    if amplitude == 0:
        return [0.0 for _ in valores]
    return [(x - minimo) / amplitude for x in valores]

normal = escalar([2,4,8])
print([round(x, 3) for x in normal])
assert isclose(normal[1], 1/3, abs_tol=1e-9)
print(escalar([5,5]))
```

Saída esperada

```text
[0.0, 0.333, 1.0]
[0.0, 0.0]
```

O intervalo original vale 6. Para entrada constante, combinar a regra dos zeros antes de dividir. A função pressupõe ao menos um valor.

No ZIP, a solução está em `aulas/precisao-e-escalas/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/numpy/arrays)

## Fontes

- [Comparação com tolerância](https://docs.python.org/pt-br/3.14/library/math.html#math.isclose)
- [Estatística na biblioteca padrão](https://docs.python.org/pt-br/3.14/library/statistics.html)
