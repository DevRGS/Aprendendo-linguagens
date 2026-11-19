# Percorrer e filtrar

Quais temperaturas devem continuar se o filtro aceita apenas valores acima de zero? Retome [For e acumuladores](#/python/fluxo/for-e-acumuladores) e [Listas e cópias](#/python/sequencias/listas).

`for valor in dados:` entrega os elementos, um por vez. Se você precisa também da posição, `for indice, valor in enumerate(dados):` dá os dois valores de cada passagem, com índice começando em 0. A condição dentro do laço decide quais itens entram em uma lista inicialmente vazia. Use append na lista de resultado para manter a entrada intacta.

Neste conjunto, `None` representa um valor ausente. `valor is None` testa a presença desse marcador. Um teste como `not valor` englobaria também zero e confundiria dois estados diferentes.

Em [Compreensões](#/python/sequencias/compreensoes) você vai reconhecer esse mesmo filtro em uma expressão. Antes, explique o que se perderia se o teste tratasse zero como ausência.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/sequencias/percorrer-e-filtrar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/sequencias/percorrer-e-filtrar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/sequencias.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja quais itens de [−1, 2, 0, 4] passam pelo limite estrito. Construa uma lista contendo só temperaturas positivas.

**Bash**

```bash
cd aulas/percorrer-e-filtrar/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/percorrer-e-filtrar/e1
py exemplo.py
```

```python
temperaturas = [-1, 2, 0, 4]
positivas = []
for temperatura in temperaturas:
    if temperatura > 0:
        positivas.append(temperatura)
print(positivas)
```

Saída esperada

```text
[2, 4]
```

A lista começa vazia. O teste > 0 exclui −1 e 0. Cada valor aceito entra na ordem em que foi encontrado.

## E2 · Altere ou depure

Antes de executar, diga qual é a posição do zero e qual valor está na posição zero. Exiba cada posição junto do valor.

**Bash**

```bash
cd aulas/percorrer-e-filtrar/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/percorrer-e-filtrar/e2
py variacao.py
```

```python
temperaturas = [-1, 2, 0, 4]
for indice, temperatura in enumerate(temperaturas):
    print(indice, temperatura)
```

Saída esperada

```text
0 -1
1 2
2 0
3 4
```

enumerate começa pelo índice 0. O valor 0 está no terceiro lugar, índice 2.

## E3 · Resolva

Localize os índices de valores ausentes em [3, None, 0, None]. Use None como único marcador de ausência e mantenha a lista original. Mostre os índices. Depois teste [0], que deve produzir lista de índices vazia.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/percorrer-e-filtrar/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/percorrer-e-filtrar/e3
py exercicio.py
```

```python
medicoes = [3, None, 0, None]
ausentes = []
# Encontre e exiba os índices dos ausentes.
```

Saída esperada

```text
[1, 3]
```

<details>
<summary>Ver uma pista</summary>

Use enumerate para receber índice e valor, e faça a comparação explícita com None.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
medicoes = [3, None, 0, None]
ausentes = []
for indice, valor in enumerate(medicoes):
    if valor is None:
        ausentes.append(indice)
print(ausentes)
```

Saída esperada

```text
[1, 3]
```

Guardamos o índice quando o item é None. Zero é uma medição presente. A lista [0] tem uma medição e nenhum índice de ausência.

No ZIP, a solução está em `aulas/percorrer-e-filtrar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/sequencias/compreensoes)

## Fontes

- [Técnicas de iteração](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#looping-techniques)
- [Função enumerate](https://docs.python.org/pt-br/3.14/library/functions.html#enumerate)
