# Produto matricial e pontuação

Uma viagem tem dois valores e você quer uma nota calculada com um peso para cada um. Quantas notas você espera de três viagens?

Use NumPy e retome [Eixos e broadcasting](#/python/numpy/eixos-e-broadcasting). As atividades criam os arrays diretamente.

`a * b` multiplica elementos, seguindo as regras de broadcasting. `a @ b` realiza produto matricial. Em `(n, p) @ (p, m)`, cada linha da primeira matriz é combinada com cada coluna da segunda. O comprimento interno `p` deve coincidir. A saída tem forma `(n, m)`. Se o segundo operando for um vetor de forma `(p,)`, o resultado fica com forma `(n,)`: uma soma de produtos por linha.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/numpy/produto-matricial.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/numpy/produto-matricial-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/numpy.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Preveja a nota da segunda linha antes de usar os pesos `[2, 1]`. Compare o efeito de `*` e `@`.

**Bash**

```bash
cd aulas/produto-matricial/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/produto-matricial/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
pesos = np.array([2, 1])
print((a * pesos).tolist())
print((a @ pesos).tolist())
```

Saída esperada

```text
[[2, 2], [6, 4]]
[4, 10]
```

O produto elemento a elemento deixa os termos separados. O produto matricial soma 2 + 2 e 6 + 4.

## E2 · Altere ou depure

Use três linhas e uma matriz coluna de pesos. Antecipe a forma de `(3, 2) @ (2, 1)` antes de rodar.

**Bash**

```bash
cd aulas/produto-matricial/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/produto-matricial/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import numpy as np

a = np.array([[1, 2], [3, 4], [5, 6]])
pesos = np.array([[2], [1]])
notas = a @ pesos
print(notas.shape, notas.tolist())
```

Saída esperada

```text
(3, 1) [[4], [10], [16]]
```

Há três linhas e uma coluna no resultado, pois a segunda matriz tem uma coluna.

## E3 · Resolva

Obtenha uma pontuação por linha de `[[1, 3], [2, 5], [0, 4]]` com pesos `[0.5, 2.0]`. Faça por laços e por `@`, compare com `np.allclose` e teste lote de uma linha.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/produto-matricial/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/produto-matricial/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import numpy as np

a = np.array([[1, 3], [2, 5], [0, 4]])
pesos = np.array([0.5, 2.0])
# Calcule a primeira nota à mão antes de escrever os laços.
```

Saída esperada

```text
[6.5, 11.0, 8.0]
True
```

<details>
<summary>Ver uma pista</summary>

Faça uma soma de produtos separada para cada linha. Reinicie o acumulador a cada linha.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import numpy as np

def pontuar_laco(a, pesos):
    notas = []
    for linha in a:
        soma = 0.0
        for valor, peso in zip(linha, pesos, strict=True):
            soma += valor * peso
        notas.append(soma)
    return notas

a = np.array([[1, 3], [2, 5], [0, 4]])
pesos = np.array([0.5, 2.0])
notas = a @ pesos
print(notas.tolist())
print(np.allclose(pontuar_laco(a, pesos), notas))
assert (a[:1] @ pesos).shape == (1,)
assert np.allclose(pontuar_laco(a[:1], pesos), a[:1] @ pesos)
```

Saída esperada

```text
[6.5, 11.0, 8.0]
True
```

O laço interno combina cada valor com seu peso e acumula a pontuação. `strict=True` evita truncar silenciosamente uma linha de comprimento incompatível. Para uma linha a saída continua sendo um vetor. Se errou o eixo no marco, volte a [Eixos e broadcasting](#/python/numpy/eixos-e-broadcasting) e repita aqui com pesos [1, 0] e uma linha [7, 2]. A seguir, o pandas acrescenta rótulos e chaves às tabelas.

No ZIP, a solução está em `aulas/produto-matricial/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/pandas/ler-e-inspecionar)

## Fontes

- [Produto matricial](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html)
- [Comparação numérica](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html)
