# Centro e dispersão

Média é soma dividida pela quantidade. Mediana é o valor central da lista ordenada ou a média dos dois valores centrais. Amplitude subtrai o menor valor do maior. Desvio padrão mede dispersão na unidade original. Quando toda a população é conhecida, a variância usa n no denominador. A variância amostral usa n−1 para estimar a variância populacional a partir da amostra. O desvio padrão é a raiz quadrada da variância. Revise [funções e contratos](#/python/funcoes/contratos-e-tipos).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/matematica/centro-e-dispersao.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/matematica/centro-e-dispersao-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/matematica.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Calcule média, mediana e amplitude de [2,4,6].

**Bash**

```bash
cd aulas/centro-e-dispersao/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/centro-e-dispersao/e1
py exemplo.py
```

```python
from statistics import mean, median
valores = [2,4,6]
print(mean(valores), median(valores), max(valores)-min(valores))
```

Saída esperada

```text
4 4 4
```

A soma é 12, o valor central é 4 e os extremos diferem em 4.

## E2 · Altere ou depure

Acrescente 100 e compare os dois centros.

**Bash**

```bash
cd aulas/centro-e-dispersao/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/centro-e-dispersao/e2
py variacao.py
```

```python
from statistics import mean, median
valores = [2,4,6,100]
print(mean(valores), median(valores))
```

Saída esperada

```text
28 5.0
```

O novo valor entra na soma da média. A mediana usa os dois valores centrais 4 e 6.

## E3 · Resolva

Calcule o desvio padrão amostral de [2,4,6] e teste uma única leitura.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/centro-e-dispersao/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/centro-e-dispersao/e3
py exercicio.py
```

```python
from statistics import stdev
valores = [2, 4, 6]
# Informe o desvio e experimente uma única leitura.
```

Saída esperada

```text
2.0
1.633
amostra requer dois valores
```

<details>
<summary>Ver uma pista</summary>

A biblioteca oferece stdev e pstdev.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from statistics import StatisticsError, pstdev, stdev
print(stdev([2,4,6]))
print(round(pstdev([2,4,6]), 3))
try:
    stdev([2])
except StatisticsError:
    print("amostra requer dois valores")
```

Saída esperada

```text
2.0
1.633
amostra requer dois valores
```

Os desvios ao quadrado são 4, 0 e 4. A raiz de 8/2 é 2. Em uma amostra unitária n−1 seria zero.

No ZIP, a solução está em `aulas/centro-e-dispersao/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/matematica/frequencia-e-probabilidade)

## Fontes

- [Estatística na biblioteca padrão](https://docs.python.org/pt-br/3.14/library/statistics.html)
