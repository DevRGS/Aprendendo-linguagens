# Tuplas e desempacotamento

Como manter o ID de uma leitura ligado ao seu valor? Retome [Listas e cópias](#/python/sequencias/listas). Aqui cada registro tem dois campos em ordem fixa.

A tupla `("a", 3)` guarda texto e número em um mesmo registro. A tupla é imutável: a posição 0 continua com o mesmo item. Em `identificador, valor = registro`, o desempacotamento liga cada nome ao item da posição correspondente. Para dois nomes, o registro precisa ter dois itens.

`zip(nomes, medidas)` produz pares, um por posição. Por padrão, para assim que uma das entradas termina. Com nomes `["a", "b"]` e medidas `[3]`, só aparece `("a", 3)`. Se todos os nomes precisarem de medida, compare os comprimentos antes de combinar ou use `zip(..., strict=True)` e percorra os resultados para detectar a divergência. Nesta aula usamos listas, cujo tamanho se consulta com `len`.

Explique por que o truncamento pode esconder um registro incompleto. Em [Dicionários](#/python/registros/dicionarios) você vai usar o ID para localizar um valor.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/registros/tuplas-e-desempacotamento.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/registros/tuplas-e-desempacotamento-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/registros.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Indique a posição de cada campo e desempacote `("a", 3)` em dois nomes.

**Bash**

```bash
cd aulas/tuplas-e-desempacotamento/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/tuplas-e-desempacotamento/e1
py exemplo.py
```

```python
registro = ("a", 3)
identificador, valor = registro
print(identificador, valor)
```

Saída esperada

```text
a 3
```

A ordem na atribuição é a ordem da tupla. O ID continua texto e a medida continua inteira.

## E2 · Altere ou depure

Preveja quantos pares saem de duas listas com 2 e 1 itens. Mostre o resultado do zip comum e confira se os comprimentos coincidem.

**Bash**

```bash
cd aulas/tuplas-e-desempacotamento/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/tuplas-e-desempacotamento/e2
py variacao.py
```

```python
nomes = ["a", "b"]
medidas = [3]
print(list(zip(nomes, medidas)))
print(len(nomes) == len(medidas))
```

Saída esperada

```text
[('a', 3)]
False
```

list materializa os pares para exibi-los. A comparação dos comprimentos revela que b ficou sem medida.

## E3 · Resolva

Combine os nomes A, B e C com as medidas 2, 3 e 4, na mesma ordem. Exiba cada par. Se o tamanho divergir, rejeite o lote com `Tamanhos incompatíveis`, sem imprimir pares parciais. Teste com a última medida removida.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/tuplas-e-desempacotamento/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/tuplas-e-desempacotamento/e3
py exercicio.py
```

```python
nomes = ["A", "B", "C"]
medidas = [2, 3, 4]
# Valide os tamanhos e só então mostre os pares.
```

Saída esperada

```text
A 2
B 3
C 4
```

<details>
<summary>Ver uma pista</summary>

Compare os comprimentos antes de chamar zip.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
nomes = ["A", "B", "C"]
medidas = [2, 3, 4]

if len(nomes) != len(medidas):
    print("Tamanhos incompatíveis")
else:
    for nome, medida in zip(nomes, medidas):
        print(nome, medida)
```

Saída esperada

```text
A 2
B 3
C 4
```

Comparar os tamanhos antes da iteração impede que parte do lote seja mostrada. Com duas medidas, só sai a mensagem de incompatibilidade. Duas listas vazias têm tamanhos compatíveis e produzem zero pares.

No ZIP, a solução está em `aulas/tuplas-e-desempacotamento/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/registros/dicionarios)

## Fontes

- [Tuplas e sequências](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#tuples-and-sequences)
- [Função zip e strict](https://docs.python.org/pt-br/3.14/library/functions.html#zip)
