# Escopo e valores padrão

Como receber um preço e aplicar normalmente 10% de desconto, deixando o chamador mudar a taxa? Retome [Parâmetros e retorno](#/python/funcoes/parametros-e-retorno).

Nomes definidos dentro de uma função, como `abatimento = preco * taxa`, são locais à sua chamada. Um parâmetro também é local. Você pode chamar `desconto(preco=100, taxa=0.10)` e indicar a qual parâmetro pertence cada argumento. Em `def desconto(preco, taxa=0.10):`, omitir a taxa usa o valor padrão. Uma taxa de 0.10 aplicada a 100 produz abatimento 10.0 e preço final 90.0.

O Python avalia um valor padrão quando executa a definição da função. Uma lista escrita como padrão pode acumular mudanças entre chamadas que omitem o argumento. Use `None` como sentinela e crie uma lista nova dentro da função para cada chamada sem lista. O teste `is None` separa o argumento omitido nessa política de uma lista vazia fornecida de propósito.

Explique qual estado acompanha cada chamada. Na aula seguinte você vai documentar o que uma função recebe e entrega.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/funcoes/escopo-e-padroes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/funcoes/escopo-e-padroes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/funcoes.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o preço final de 100 sem passar taxa. Chame também com taxa explícita de 25%.

**Bash**

```bash
cd aulas/escopo-e-padroes/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/escopo-e-padroes/e1
py exemplo.py
```

```python
def desconto(preco, taxa=0.10):
    abatimento = preco * taxa
    return preco - abatimento

print(desconto(100))
print(desconto(preco=100, taxa=0.25))
```

Saída esperada

```text
90.0
75.0
```

A primeira chamada usa a taxa padrão 0.10. A segunda informa pelo nome taxa o valor 0.25.

## E2 · Altere ou depure

A primeira versão tem uma lista compartilhada como padrão, um erro intencional de estado. Preveja os retornos de duas chamadas seguidas e compare com a versão corrigida.

**Bash**

```bash
cd aulas/escopo-e-padroes/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/escopo-e-padroes/e2
py variacao.py
```

```python
def adicionar_partilhado(item, lista=[]):
    lista.append(item)
    return lista

print(adicionar_partilhado("A"))
print(adicionar_partilhado("B"))

def adicionar(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista

print(adicionar("A"))
print(adicionar("B"))
```

Saída esperada

```text
['A']
['A', 'B']
['A']
['B']
```

A lista padrão da primeira versão é criada na definição e reaparece na segunda chamada. A correção cria uma lista nova em cada chamada com None.

## E3 · Resolva

Crie `rotular(texto, prefixo='Item')` para devolver o rótulo com dois pontos e um espaço entre prefixo e texto. Mostre o padrão e a troca por `Tema` via argumento nomeado para `Água`, depois mostre que a origem permanece `Água`. Teste também texto vazio.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/escopo-e-padroes/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/escopo-e-padroes/e3
py exercicio.py
```

```python
def rotular(texto, prefixo="Item"):
    pass  # Devolva o rótulo.

origem = "Água"
# Experimente as duas formas de chamar e exiba a origem.
```

Saída esperada

```text
Item: Água
Tema: Água
Água
```

<details>
<summary>Ver uma pista</summary>

Declare o padrão na definição e monte a string com os dois parâmetros.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def rotular(texto, prefixo="Item"):
    return f"{prefixo}: {texto}"

origem = "Água"
print(rotular(origem))
print(rotular(origem, prefixo="Tema"))
print(origem)
```

Saída esperada

```text
Item: Água
Tema: Água
Água
```

A f-string cria outro texto. O argumento nomeado muda o prefixo apenas naquela chamada. Para texto vazio, o resultado termina em dois pontos e um espaço, sem caracteres de texto depois.

No ZIP, a solução está em `aulas/escopo-e-padroes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/funcoes/contratos-e-tipos)

## Fontes

- [Valores padrão](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#default-argument-values)
- [Argumentos nomeados](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#keyword-arguments)
