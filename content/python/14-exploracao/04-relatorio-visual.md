# Comunicar resultados com gráficos

Em qual estação uma proporção maior das viagens foi pontual? Preveja se a resposta muda quando os grupos têm tamanhos diferentes.

Use Matplotlib e retome [Dispersão e correlação](#/python/exploracao/relacoes). Os dados são sintéticos, declarados no código. No projeto, escolhas exploratórias serão feitas usando o treino.

Comece pela pergunta. Use barras para comparar categorias. Dê nome à medida, unidade e denominador. Uma legenda identifica séries quando há mais de uma. Use também descrição textual e uma tabela equivalente para recuperar os valores sem ver a figura ou depender de cor. Conclua informando o que a amostra permite afirmar.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/exploracao/relatorio-visual.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/exploracao/relatorio-visual-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/exploracao.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Crie uma figura de barras de viagens pontuais por estação, A=3 e B=4. Rotule o eixo e salve o PNG.

**Bash**

```bash
cd aulas/relatorio-visual/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/relatorio-visual/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(layout="constrained")
ax.bar(["A", "B"], [3, 4], edgecolor="black")
ax.set(xlabel="Estação", ylabel="Viagens pontuais (contagem)", title="Registros pontuais")
fig.savefig("pontuais.png")
plt.close(fig)
print("A: 3 viagens; B: 4 viagens")
```

Saída esperada

```text
A: 3 viagens; B: 4 viagens
```

B tem a barra mais alta, com 4 viagens contra 3 de A. Essa figura descreve contagens e seu texto informa os valores.

## E2 · Altere ou depure

O rótulo de porcentagem seria incorreto sobre barras de alturas 3 e 4. Use totais 4 e 8 para calcular porcentagens e salve as barras corrigidas.

**Bash**

```bash
cd aulas/relatorio-visual/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/relatorio-visual/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

estacoes, pontuais, totais = ["A", "B"], [3, 4], [4, 8]
percentuais = [100 * pontos / total for pontos, total in zip(pontuais, totais, strict=True)]
fig, ax = plt.subplots(layout="constrained")
ax.bar(estacoes, percentuais, edgecolor="black")
ax.set(xlabel="Estação", ylabel="Viagens pontuais (%)", ylim=(0, 100), title="Pontualidade")
fig.savefig("percentuais.png")
plt.close(fig)
print("A: 75% de 4; B: 50% de 8")
```

Saída esperada

```text
A: 75% de 4; B: 50% de 8
```

A passa a aparecer acima de B: 3/4 supera 4/8. A mudança exige recalcular os dados usados nas barras, além de corrigir o rótulo.

## E3 · Resolva

Para A=3/4, B=4/8 e C=0/0, entregue uma figura com percentuais definidos, tabela com numeradores e denominadores e duas frases sustentadas pelos números. Marque C como não calculável.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/relatorio-visual/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/relatorio-visual/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

dados = [("A", 3, 4), ("B", 4, 8), ("C", 0, 0)]
# Prepare a tabela e passe só percentuais definidos ao gráfico.
```

Saída esperada

```text
Estação | Pontuais | Total | Percentual
A | 3 | 4 | 75%
B | 4 | 8 | 50%
C | 0 | 0 | não calculável
A teve 75% e B teve 50% de pontualidade na amostra.
C não teve viagens registradas, então não há taxa para comparar.
```

<details>
<summary>Ver uma pista</summary>

Em C, a ausência de denominador exige uma política visível na tabela.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

dados = [("A", 3, 4), ("B", 4, 8), ("C", 0, 0)]
nomes, alturas = [], []
print("Estação | Pontuais | Total | Percentual")
for nome, pontuais, total in dados:
    if total == 0:
        print(f"{nome} | {pontuais} | {total} | não calculável")
    else:
        percentual = 100 * pontuais / total
        nomes.append(nome)
        alturas.append(percentual)
        print(f"{nome} | {pontuais} | {total} | {percentual:.0f}%")

fig, ax = plt.subplots(layout="constrained")
ax.bar(nomes, alturas, edgecolor="black")
ax.set(xlabel="Estação", ylabel="Viagens pontuais (%)", ylim=(0, 100),
       title="Pontualidade entre estações observadas")
fig.savefig("relatorio.png")
plt.close(fig)
print("A teve 75% e B teve 50% de pontualidade na amostra.")
print("C não teve viagens registradas, então não há taxa para comparar.")
```

Saída esperada

```text
Estação | Pontuais | Total | Percentual
A | 3 | 4 | 75%
B | 4 | 8 | 50%
C | 0 | 0 | não calculável
A teve 75% e B teve 50% de pontualidade na amostra.
C não teve viagens registradas, então não há taxa para comparar.
```

As barras de A e B têm alturas de 75% e 50%. C permanece na tabela com denominador zero. Com poucos registros, os percentuais descrevem esta amostra. Na preparação para ML, decida quais dados estarão disponíveis antes da previsão.

No ZIP, a solução está em `aulas/relatorio-visual/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/preparacao-ml/observacao-atributo-alvo)

## Fontes

- [Guia Matplotlib](https://matplotlib.org/stable/users/explain/quick_start.html)
- [Barras](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.bar.html)
