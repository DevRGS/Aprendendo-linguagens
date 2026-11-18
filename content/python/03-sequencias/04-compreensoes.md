# Compreensões de lista

Como escrever o dobro de cada item em uma lista sem perder de vista o laço equivalente? Retome [Percorrer e filtrar](#/python/sequencias/percorrer-e-filtrar).

O laço começa com uma lista vazia, percorre os valores e acrescenta `valor * 2`. A compreensão `[valor * 2 for valor in dados]` produz uma nova lista com a mesma sequência. Leia primeiro o `for`, identifique cada valor e então aplique a expressão à esquerda. Em `[valor * 2 for valor in dados if valor % 2 == 0]`, o teste atua no valor original. Somente quando passa é que o dobro vai para a saída.

Para filtrar depois de transformar, guarde os valores transformados e use outra etapa. Manter duas etapas ajuda a enxergar qual valor passa pelo teste. Ao terminar, explique por que dobrar primeiro pode mudar o resultado. Na próxima aula você vai agrupar valores que pertencem ao mesmo registro.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/sequencias/compreensoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/sequencias/compreensoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/sequencias.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o resultado de dobrar [1, 2, 3]. Execute o laço e a compreensão e compare as listas.

**Bash**

```bash
cd aulas/compreensoes/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/compreensoes/e1
py exemplo.py
```

```python
dados = [1, 2, 3]
pelo_laco = []
for valor in dados:
    pelo_laco.append(valor * 2)

pela_compreensao = [valor * 2 for valor in dados]
print(pelo_laco)
print(pela_compreensao)
```

Saída esperada

```text
[2, 4, 6]
[2, 4, 6]
```

Cada valor é lido uma vez em cada versão. A expressão da compreensão calcula o mesmo valor enviado a append.

## E2 · Altere ou depure

Preveja a diferença entre selecionar os pares originais e selecionar os pares já dobrados em [1, 2, 3]. Escreva as duas etapas da segunda abordagem.

**Bash**

```bash
cd aulas/compreensoes/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/compreensoes/e2
py variacao.py
```

```python
dados = [1, 2, 3]
dobro_dos_pares = [valor * 2 for valor in dados if valor % 2 == 0]
dobros = [valor * 2 for valor in dados]
pares_dos_dobros = [valor for valor in dobros if valor % 2 == 0]
print(dobro_dos_pares)
print(pares_dos_dobros)
```

Saída esperada

```text
[4]
[2, 4, 6]
```

Só 2 passa pelo primeiro filtro. Depois de dobrar todos os valores, cada dobro é par e passa pelo segundo filtro.

## E3 · Resolva

Use uma compreensão para produzir o quadrado de cada inteiro par de 0 até 5. Confira o resultado também com uma sequência vazia.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/compreensoes/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/compreensoes/e3
py exercicio.py
```

```python
numeros = range(6)
# Construa a compreensão e exiba seu resultado.
```

Saída esperada

```text
[0, 4, 16]
```

<details>
<summary>Ver uma pista</summary>

Coloque o produto antes do for e o teste de resto zero depois da sequência.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
numeros = range(6)
quadrados = [numero * numero for numero in numeros if numero % 2 == 0]
print(quadrados)
```

Saída esperada

```text
[0, 4, 16]
```

O teste deixa 0, 2 e 4 passarem. O produto do valor por ele mesmo calcula o quadrado. Uma entrada vazia produz [] porque nenhuma expressão é avaliada.

No ZIP, a solução está em `aulas/compreensoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/registros/tuplas-e-desempacotamento)

## Fontes

- [Compreensões de lista](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#list-comprehensions)
- [Semântica de compreensões](https://docs.python.org/pt-br/3.14/reference/expressions.html#displays-for-lists-sets-and-dictionaries)
