# Vetores e soma ponderada

Cada linha de uma tabela pode descrever uma observação por meio de várias coordenadas. Em (distância, paradas), a ordem diz o que representa cada número. A dimensão é a quantidade de coordenadas. Para somar dois vetores ou multiplicar coordenadas correspondentes, confira dimensões iguais. A soma de (1, 2) e (3, 4) é (1+3, 2+4), ou (4, 6). No produto escalar somamos os produtos depois de multiplicar os pares: (1, 2) e (3, 4) fornecem 1×3 + 2×4 = 11. Revise [tuplas e desempacotamento](#/python/registros/tuplas-e-desempacotamento).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/matematica/vetores.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/matematica/vetores-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/matematica.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Calcule os produtos antes de executar e compare o total.

**Bash**

```bash
cd aulas/vetores/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/vetores/e1
py exemplo.py
```

```python
x, y = [1, 2], [3, 4]
produtos = [a * b for a, b in zip(x, y, strict=True)]
print(produtos)
print(sum(produtos))
```

Saída esperada

```text
[3, 8]
11
```

A correspondência é por posição. O produto escalar devolve um número.

## E2 · Altere ou depure

Inspecione os comprimentos. Como impedir que o terceiro valor desapareça?

**Bash**

```bash
cd aulas/vetores/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/vetores/e2
py variacao.py
```

```python
x, y = [1, 2], [3, 4, 5]
print(len(x), len(y))
try:
    list(zip(x, y, strict=True))
except ValueError:
    print("dimensões incompatíveis")
```

Saída esperada

```text
2 3
dimensões incompatíveis
```

Sem strict, zip para quando termina a menor sequência. O modo estrito detecta a diferença ao consumir o iterador.

## E3 · Resolva

Combine pesos 0.25, 0.75 com os valores 4, 8. Depois faça o mesmo com um elemento e com comprimentos distintos.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/vetores/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/vetores/e3
py exercicio.py
```

```python
pesos = [0.25, 0.75]
valores = [4, 8]
# Complete a soma dos produtos e confira os tamanhos.
```

Saída esperada

```text
7.0
tamanhos diferentes
```

<details>
<summary>Ver uma pista</summary>

Multiplique pares e some.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def ponderar(pesos, valores):
    return sum(peso * valor for peso, valor in zip(pesos, valores, strict=True))

print(ponderar([0.25, 0.75], [4, 8]))
assert ponderar([1], [12]) == 12
try:
    ponderar([1], [2, 3])
except ValueError:
    print("tamanhos diferentes")
```

Saída esperada

```text
7.0
tamanhos diferentes
```

Os produtos são 1 e 6. Em uma média ponderada os pesos somam 1. O modo estrito também protege o caso de tamanhos diferentes.

No ZIP, a solução está em `aulas/vetores/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/matematica/centro-e-dispersao)

## Fontes

- [Função zip](https://docs.python.org/pt-br/3.14/library/functions.html#zip)
