# Interprete a referência e seu erro

Use a preparação do marco anterior e revise [referência e erro](#/python/preparacao-ml/referencia-e-erro). No treino, descreva a duração com mediana e extremos e use um histograma com eixos em minutos e contagem. A mediana de y no treino fornece uma referência constante de 10 minutos. Calcule o desvio absoluto de cada previsão e tire a média. Congelar a referência antes de consultar o teste mantém o conjunto final para avaliação.

Rastrear ou gravar os alvos de teste durante a preparação é uma operação estrutural. Produza gráficos exploratórios com treino, decida com validação e use os alvos de teste para medir a escolha congelada. Compare os erros em minutos e explique os limites de uma amostra tão pequena.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projeto/interpretar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projeto/interpretar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projeto.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Resuma o alvo do treino em minutos.

**Bash**

```bash
cd aulas/interpretar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/interpretar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from preparacao_viagens import ajustar, aplicar, exportar, extrair, particionar
partes = particionar(validas)
parametros = ajustar(partes["treino"])

from statistics import median
alvos = partes["treino"]["minutos_reais"].tolist()
print(alvos)
print(f"mínimo={min(alvos):.1f} mediana={median(alvos):.1f} máximo={max(alvos):.1f}")
```

Saída esperada

```text
[6.0, 8.0, 10.0, 10.0, 12.0, 14.0]
mínimo=6.0 mediana=10.0 máximo=14.0
```

O gráfico final usa somente essas seis observações.

## E2 · Altere ou depure

Calcule à mão os erros absolutos de 10 contra alvos de validação 8 e 15, e compare.

**Bash**

```bash
cd aulas/interpretar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/interpretar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from preparacao_viagens import ajustar, aplicar, exportar, extrair, particionar
partes = particionar(validas)
parametros = ajustar(partes["treino"])

from preparacao_viagens import mae
ref = parametros["referencia_minutos"]
alvos = partes["validacao"]["minutos_reais"]
print([abs(y-ref) for y in alvos])
print(mae(alvos, ref))
```

Saída esperada

```text
[2.0, 5.0]
3.5
```

7 minutos de erro absoluto somados, divididos por duas viagens, resultam em 3.5 minutos.

## E3 · Resolva

Congele a referência. Calcule então o erro de teste e exporte um relatório com gráfico de treino, tabela, unidade e limites.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/interpretar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/interpretar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from preparacao_viagens import ajustar, aplicar, exportar, extrair, particionar
partes = particionar(validas)
parametros = ajustar(partes["treino"])
# Calcule os erros e escreva relatorio.md com uma figura.
```

Saída esperada

```text
True
{'validacao': 3.5, 'teste': 10.0}
```

<details>
<summary>Ver uma pista</summary>

Use média dos erros absolutos nas duas partições. Reserve o gráfico exploratório para treino.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path
from executar_projeto import executar, mostrar

pasta = Path.cwd()
resultados = executar(pasta/"dados/viagens.csv", pasta/"dados/estacoes.csv", pasta/"saida")

_, _, _, metricas = resultados
assert metricas == {"validacao":3.5, "teste":10.0}
print(Path("saida/relatorio.md").is_file())
print(metricas)
```

Saída esperada

```text
True
{'validacao': 3.5, 'teste': 10.0}
```

No teste, os alvos 18 e 22 estão a 8 e 12 minutos da previsão. A média é 10. O relatório inclui título, eixos, descrição e tabela com os valores do treino. Em uma avaliação com pouquíssimas observações, um valor novo pode mudar a métrica substancialmente.

No ZIP, a solução está em `aulas/interpretar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projeto/reproduzir)

## Fontes

- [Evitar vazamento de dados](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
- [Métricas de regressão](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics)
- [Plotar com Matplotlib](https://matplotlib.org/stable/users/explain/quick_start.html)
