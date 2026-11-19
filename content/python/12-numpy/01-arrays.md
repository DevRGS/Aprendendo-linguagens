# Arrays, tipos e dimensões

Imagine três viagens medidas por distância e tempo. Quantos números descrevem cada viagem? Agora imagine guardar apenas a primeira viagem para um programa que espera a tabela inteira. Que formato essa seleção precisa ter?

Revise listas e fatias em [Texto e fatias](#/python/sequencias/texto-e-fatias). No caderno, o kernel precisa oferecer NumPy. No terminal, instale as dependências do kit e rode os scripts com o mesmo intérprete. Nenhum arquivo de entrada é necessário nesta aula.

`np.array` cria um `ndarray`. Este array guarda elementos de um tipo comum, chamado `dtype`. Escolhemos `int64` nos exemplos para tornar explícito o tipo de inteiro usado. `ndim` informa a quantidade de dimensões. `shape` dá o comprimento em cada dimensão, na ordem. Um array de forma `(3, 2)` tem três linhas e duas colunas. Um vetor de forma `(3,)` tem uma dimensão, mesmo se seus três números vieram de uma coluna.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/numpy/arrays.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/numpy/arrays-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/numpy.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Preveja a forma de três linhas de dois números. Crie o array e confira o tipo, o número de dimensões e a forma.

**Bash**

```bash
cd aulas/arrays/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/arrays/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import numpy as np

medidas = np.array([[1, 2], [3, 4], [5, 6]], dtype=np.int64)
print(medidas.dtype, medidas.ndim, medidas.shape)
print(medidas.tolist())
```

Saída esperada

```text
int64 2 (3, 2)
[[1, 2], [3, 4], [5, 6]]
```

Cada lista interna fornece uma linha. Há três linhas e cada uma tem dois inteiros.

## E2 · Altere ou depure

Selecione a primeira coluna com o índice `0` e depois com a fatia `0:1`. Compare valores e formas.

**Bash**

```bash
cd aulas/arrays/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/arrays/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import numpy as np

medidas = np.array([[1, 2], [3, 4], [5, 6]], dtype=np.int64)
vetor = medidas[:, 0]
coluna = medidas[:, 0:1]
print(vetor.shape, vetor.tolist())
print(coluna.shape, coluna.tolist())
```

Saída esperada

```text
(3,) [1, 3, 5]
(3, 1) [[1], [3], [5]]
```

O índice inteiro elimina a dimensão da coluna. A fatia mantém essa dimensão com comprimento 1.

## E3 · Resolva

Se cada linha é uma amostra, devolva a primeira de `[[4, 9], [8, 13]]` com forma `(1, 2)`. Confira o mesmo contrato com um lote de uma única linha.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/arrays/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/arrays/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import numpy as np

lote = np.array([[4, 9], [8, 13]])
# Selecione uma linha e confira forma e valores.
```

Saída esperada

```text
(1, 2) [[4, 9]]
```

<details>
<summary>Ver uma pista</summary>

Conserve a dimensão das linhas da mesma forma que E2 conservou a das colunas.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import numpy as np

def primeira_amostra(lote):
    return lote[0:1, :]

lote = np.array([[4, 9], [8, 13]])
amostra = primeira_amostra(lote)
print(amostra.shape, amostra.tolist())
unica = primeira_amostra(np.array([[2, 7]]))
assert unica.shape == (1, 2)
assert unica.tolist() == [[2, 7]]
```

Saída esperada

```text
(1, 2) [[4, 9]]
```

A fatia `0:1` mantém o eixo das amostras para que o próximo programa ainda possa contar linhas e colunas. Ela funciona em um lote que já tem uma linha. Na próxima aula, observe o que acontece se você modificar uma fatia.

No ZIP, a solução está em `aulas/arrays/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/numpy/indexacao-e-mascaras)

## Fontes

- [Fundamentos do NumPy](https://numpy.org/doc/stable/user/absolute_beginners.html)
