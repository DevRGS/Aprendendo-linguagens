# Dispersão e correlação

Uma nuvem de pontos cresce da esquerda para a direita. Que tipo de relação ela sugere? E se todos os pontos estiverem na mesma altura?

Use NumPy e Matplotlib. Retome [Quartis e histogramas](#/python/exploracao/distribuicoes) para lembrar figura, eixos e PNG. As atividades usam pares sintéticos no código.

Em um gráfico de dispersão, cada ponto é uma observação com duas medidas. A correlação de Pearson resume associação linear de −1 a 1. Uma coluna constante tem desvio zero e torna o coeficiente indefinido. Relações curvas podem produzir correlação perto de zero. Uma associação observada pode ter fatores em comum e não estabelece uma causa por si só.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/exploracao/relacoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/exploracao/relacoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/exploracao.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Acople [1, 2, 3] km a [2, 4, 6] min e calcule a correlação linear. Preveja o sinal.

**Bash**

```bash
cd aulas/relacoes/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/relacoes/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import numpy as np

x = [1, 2, 3]
y = [2, 4, 6]
print(f"r = {np.corrcoef(x, y)[0, 1]:.1f}")
```

Saída esperada

```text
r = 1.0
```

A matriz de correlação usa a posição [0, 1] para o par x e y, que cresce como uma reta.

## E2 · Altere ou depure

Troque y por [4, 4, 4]. Detecte desvio zero antes de calcular e apresente o estado do coeficiente.

**Bash**

```bash
cd aulas/relacoes/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/relacoes/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import numpy as np

x = [1, 2, 3]
y = [4, 4, 4]
if np.std(x) == 0 or np.std(y) == 0:
    print("r indefinido")
else:
    print(np.corrcoef(x, y)[0, 1])
```

Saída esperada

```text
r indefinido
```

A divisão necessária para normalizar a correlação teria denominador zero.

## E3 · Resolva

Compare pontos de dois sensores fictícios nos ajustes [-2,-1,0,1,2]. O sensor 1 lê o próprio ajuste e o sensor 2 lê seu quadrado. Salve dois gráficos com unidades arbitrárias, liste os pares e explique o caso de borda de variáveis relacionadas com r igual a zero.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/relacoes/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/relacoes/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

x = np.array([-2, -1, 0, 1, 2])
# Compare x com x e com x**2 usando dois gráficos de dispersão.
```

Saída esperada

```text
Reta: r = 1.0 [(-2, -2), (-1, -1), (0, 0), (1, 1), (2, 2)]
Curva: r = 0.0 [(-2, 4), (-1, 1), (0, 0), (1, 1), (2, 4)]
```

<details>
<summary>Ver uma pista</summary>

Compare a simetria dos pares com x negativo e positivo no segundo painel.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

x = np.array([-2, -1, 0, 1, 2])
fig, axes = plt.subplots(1, 2, layout="constrained")
for ax, y, titulo in zip(axes, [x, x**2], ["Reta", "Curva"], strict=True):
    r = np.corrcoef(x, y)[0, 1]
    print(f"{titulo}: r = {r:.1f}", list(zip(x.tolist(), y.tolist(), strict=True)))
    ax.scatter(x, y, marker="o", edgecolors="black")
    ax.set(xlabel="Ajuste (u.a.)", ylabel="Leitura (u.a.)", title=titulo)
fig.savefig("relacoes.png")
plt.close(fig)
assert np.isclose(np.corrcoef(x, x**2)[0, 1], 0, atol=1e-9)
```

Saída esperada

```text
Reta: r = 1.0 [(-2, -2), (-1, -1), (0, 0), (1, 1), (2, 2)]
Curva: r = 0.0 [(-2, 4), (-1, 1), (0, 0), (1, 1), (2, 4)]
```

Na figura da esquerda os pontos formam uma reta crescente. À direita formam um U simétrico, com correlação linear zero e relação matemática exata. Os pares escritos permitem reconstruir os gráficos. Em dados observacionais, mesmo r alto pode refletir um terceiro fator. A próxima aula liga o gráfico à pergunta.

No ZIP, a solução está em `aulas/relacoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/exploracao/relatorio-visual)

## Fontes

- [Correlação de Pearson no NumPy](https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html)
- [Dispersão no Matplotlib](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html)
