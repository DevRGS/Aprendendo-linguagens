# Quartis e histogramas

Coloque 0, 2, 4, 6 e 8 minutos em ordem. Onde ficam 25%, 50% e 75% ao longo da amostra ordenada pelo método linear? Preveja como um intervalo mais largo muda o desenho.

Use NumPy e Matplotlib e retome [Auditar a qualidade](#/python/exploracao/qualidade-dos-dados). No terminal, Agg salva sem janela. No caderno, veja o PNG mostrado após a execução ou abra o arquivo gerado. Nenhum arquivo de entrada é necessário.

Quantis são pontos de referência na sequência ordenada. O método linear do NumPy usa posição `q * (n - 1)` e interpola entre vizinhos se ela for fracionária. Q2 é a mediana. A amplitude interquartil é Q3 − Q1. Com `fig, ax = plt.subplots()` você obtém a figura e seus eixos. `ax.hist` conta números em intervalos, fechados à esquerda e abertos à direita, exceto o último, que inclui a borda final. Um extremo pode aparecer numa cauda. A quantidade de intervalos altera sua aparência.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/exploracao/distribuicoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/exploracao/distribuicoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/exploracao.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Calcule os quartis de [0, 2, 4, 6, 8]. Salve o histograma com intervalos [0, 4) e [4, 8] e indique as alturas em texto.

**Bash**

```bash
cd aulas/distribuicoes/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/distribuicoes/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

tempos = [0, 2, 4, 6, 8]
print(np.quantile(tempos, [0.25, 0.50, 0.75], method="linear").tolist())
fig, ax = plt.subplots(layout="constrained")
contagens, _, _ = ax.hist(tempos, bins=[0, 4, 8], edgecolor="black")
ax.set(xlabel="Tempo (min)", ylabel="Viagens (contagem)", title="Distribuição de tempos")
fig.savefig("quartis.png")
plt.close(fig)
print(contagens.astype(int).tolist())
```

Saída esperada

```text
[2.0, 4.0, 6.0]
[2, 3]
```

Os quartis estão nas posições 1, 2 e 3. O gráfico tem duas barras, de alturas 2 e 3, e inclui 8 na última.

## E2 · Altere ou depure

Para os mesmos tempos, compare as contagens com bordas [0,4,8] e [0,2,4,6,8]. Explique por que o valor máximo entra no último intervalo.

**Bash**

```bash
cd aulas/distribuicoes/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/distribuicoes/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

tempos = [0, 2, 4, 6, 8]
fig, axes = plt.subplots(1, 2, sharey=True, layout="constrained")
for ax, bordas in zip(axes, [[0, 4, 8], [0, 2, 4, 6, 8]], strict=True):
    contagens, _, _ = ax.hist(tempos, bins=bordas, edgecolor="black")
    ax.set(xlabel="Tempo (min)", ylabel="Viagens (contagem)", title=f"{len(bordas) - 1} intervalos")
    print(bordas, contagens.astype(int).tolist())
fig.savefig("intervalos.png")
plt.close(fig)
```

Saída esperada

```text
[0, 4, 8] [2, 3]
[0, 2, 4, 6, 8] [1, 1, 1, 2]
```

A tabela impressa descreve a altura de cada barra. O total e os dados continuam iguais. O último intervalo inclui a borda direita.

## E3 · Resolva

Para [1, 2, 2, 3, 9] minutos, entregue mediana, amplitude interquartil e um histograma com bordas [0, 3, 6, 9] e eixos com unidades. Mostre também que uma amostra constante [2, 2] tem amplitude interquartil zero.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/distribuicoes/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/distribuicoes/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

tempos = [1, 2, 2, 3, 9]
bordas = [0, 3, 6, 9]
# Calcule os quartis e salve a figura.
```

Saída esperada

```text
Mediana: 2.0 min. AIQ: 1.0 min.
Contagens: [3, 1, 1]
```

<details>
<summary>Ver uma pista</summary>

Calcule os três quantis juntos e preserve os valores retornados por hist para montar a descrição.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

def resumo(tempos):
    q1, mediana, q3 = np.quantile(tempos, [0.25, 0.5, 0.75], method="linear")
    return mediana, q3 - q1

tempos = [1, 2, 2, 3, 9]
mediana, aiq = resumo(tempos)
print(f"Mediana: {mediana:.1f} min. AIQ: {aiq:.1f} min.")
fig, ax = plt.subplots(layout="constrained")
contagens, _, _ = ax.hist(tempos, bins=[0, 3, 6, 9], edgecolor="black")
ax.set(xlabel="Tempo (min)", ylabel="Viagens (contagem)", title="Tempos observados")
fig.savefig("distribuicao.png")
plt.close(fig)
print("Contagens:", contagens.astype(int).tolist())
assert resumo([2, 2])[1] == 0
```

Saída esperada

```text
Mediana: 2.0 min. AIQ: 1.0 min.
Contagens: [3, 1, 1]
```

A amplitude entre Q1=2 e Q3=3 é 1 min. As barras mostram três viagens abaixo de 3 min, uma de 3 até menos de 6 e outra de 6 a 9. A amostra constante tem quartis iguais. A seguir estudaremos duas medidas de cada viagem.

No ZIP, a solução está em `aulas/distribuicoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/exploracao/relacoes)

## Fontes

- [Quantil linear](https://numpy.org/doc/stable/reference/generated/numpy.quantile.html)
- [Guia Matplotlib](https://matplotlib.org/stable/users/explain/quick_start.html)
- [Histograma](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html)
