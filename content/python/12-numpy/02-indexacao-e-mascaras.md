# Indexação, máscaras e cópias

Você quer manter somente viagens com distância positiva. Preveja os IDs que devem sobreviver se a segunda linha trouxer uma distância negativa.

Use NumPy e retome [Arrays](#/python/numpy/arrays) se precisar rever a forma de uma coluna. Cada atividade cria os próprios dados.

Uma comparação com um array produz uma **máscara booleana**, com um verdadeiro ou falso para cada elemento comparado. Se a máscara veio de uma coluna, pode ser usada no primeiro eixo da tabela para selecionar linhas inteiras. Fatias básicas normalmente compartilham os dados com o array de origem, como uma janela para os mesmos valores (**view**). A indexação booleana devolve uma cópia, e `copy()` permite pedir explicitamente uma cópia de uma fatia.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/numpy/indexacao-e-mascaras.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/numpy/indexacao-e-mascaras-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/numpy.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Em `[2, -1, 5]`, marque os valores positivos antes de executar. Imprima primeiro a máscara e depois a seleção.

**Bash**

```bash
cd aulas/indexacao-e-mascaras/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/indexacao-e-mascaras/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import numpy as np

valores = np.array([2, -1, 5])
positivos = valores > 0
print(positivos.tolist())
print(valores[positivos].tolist())
```

Saída esperada

```text
[True, False, True]
[2, 5]
```

A comparação é feita em cada posição. A seleção conserva os dois valores marcados como verdadeiros.

## E2 · Altere ou depure

Mude o primeiro valor de uma fatia básica para 99. Repita com uma cópia independente e tente mudar para 77.

**Bash**

```bash
cd aulas/indexacao-e-mascaras/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/indexacao-e-mascaras/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import numpy as np

a = np.array([2, 4, 6])
fatia = a[:2]
fatia[0] = 99
print(a.tolist())

independente = a[:2].copy()
independente[0] = 77
print(a.tolist(), independente.tolist())
```

Saída esperada

```text
[99, 4, 6]
[99, 4, 6] [77, 4]
```

A primeira escrita chega ao array original porque a fatia compartilha memória. A segunda muda somente a cópia.

## E3 · Resolva

Filtre as viagens com distância de pelo menos 5 km. A primeira coluna é distância e a segunda é tempo. Selecione os IDs da mesma forma. Confira também um limite para o qual nenhuma linha passa.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/indexacao-e-mascaras/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/indexacao-e-mascaras/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import numpy as np

ids = np.array(["L", "M", "N"])
viagens = np.array([[5, 14], [2, 8], [6, 15]])
limite = 5
# Crie uma máscara e aplique a ids e viagens.
```

Saída esperada

```text
['L', 'N'] [[5, 14], [6, 15]]
```

<details>
<summary>Ver uma pista</summary>

A máscara deve ter um valor por viagem. Faça a comparação na coluna de distância.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import numpy as np

def filtrar(ids, viagens, limite):
    mascara = viagens[:, 0] >= limite
    return ids[mascara], viagens[mascara]

ids = np.array(["L", "M", "N"])
viagens = np.array([[5, 14], [2, 8], [6, 15]])
ids_validos, linhas = filtrar(ids, viagens, 5)
print(ids_validos.tolist(), linhas.tolist())

ids_vazios, linhas_vazias = filtrar(ids, viagens, 20)
assert ids_vazios.shape == (0,)
assert linhas_vazias.shape == (0, 2)
```

Saída esperada

```text
['L', 'N'] [[5, 14], [6, 15]]
```

O teste inclui 5 km, e a mesma máscara guarda os IDs e as linhas nas mesmas posições. Se nenhuma linha passar, a tabela vazia ainda tem duas colunas. Na próxima aula, experimente operar uma tabela inteira por eixo.

No ZIP, a solução está em `aulas/indexacao-e-mascaras/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/numpy/eixos-e-broadcasting)

## Fontes

- [Indexação de arrays](https://numpy.org/doc/stable/user/basics.indexing.html)
- [Cópias e views](https://numpy.org/doc/stable/user/basics.copies.html)
