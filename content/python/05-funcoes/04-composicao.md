# Composição de funções

Onde investigar se um relatório mostra o nome certo mas a soma errada? Você vai passar o resultado de uma função à seguinte e testar cada etapa. Retome [Contratos e tipos](#/python/funcoes/contratos-e-tipos) e [Resumo de lote](#/python/registros/resumo-de-lote).

Separe a obtenção dos dados, a transformação e a apresentação. Nesta aula os dados de entrada já estão em uma lista. No começo da composição, `limpar_nome(" Lia ")` devolve `"Lia"`. Em seguida `gerar_etiqueta("Lia")` devolve `"Nome: Lia"`. O código que chama decide quando imprimir. A saída de uma etapa precisa respeitar o formato que a seguinte recebe.

Funções também podem ser argumentos. Em `sorted(registros, key=duracao)`, passe a função pelo nome, sem parênteses. sorted chama `duracao` para cada registro e usa seu retorno para ordenar. Chamar `duracao(registro)` no lugar do argumento key passaria um valor e perderia a regra.

Teste limpeza sem somar e teste soma com nomes já limpos. Se cada etapa tiver uma entrada conhecida, você consegue descobrir em qual delas o resultado mudou. Na próxima aula a entrada vai chegar de um arquivo.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/funcoes/composicao.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/funcoes/composicao-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/funcoes.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o retorno da limpeza e a etiqueta final para um nome com espaços. Execute a composição e exiba a etiqueta.

**Bash**

```bash
cd aulas/composicao/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/composicao/e1
py exemplo.py
```

```python
def limpar_nome(texto):
    return texto.strip()

def gerar_etiqueta(nome):
    return f"Nome: {nome}"

print(gerar_etiqueta(limpar_nome(" Lia ")))
```

Saída esperada

```text
Nome: Lia
```

A chamada interna devolve Lia e a externa cria a etiqueta. print trabalha com o texto final.

## E2 · Altere ou depure

Compare a ordem inicial com a ordem esperada por duração crescente. Forneça uma função key que leia a duração de cada registro.

**Bash**

```bash
cd aulas/composicao/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/composicao/e2
py variacao.py
```

```python
def duracao(registro):
    tema, minutos = registro
    return minutos

registros = [("Água", 6), ("Luz", 3), ("Som", 4)]
ordenados = sorted(registros, key=duracao)
print(ordenados)
```

Saída esperada

```text
[('Luz', 3), ('Som', 4), ('Água', 6)]
```

sorted obtém 6, 3 e 4 chamando duracao nos registros e devolve uma lista ordenada por esses números.

## E3 · Resolva

Separe a limpeza dos temas, a soma de minutos e a apresentação em funções. Use [(" Água ", 2), ("água", 4), ("LUZ", 3)] e mostre minutos por tema normalizado pela ordem de `sorted`, além do total. Confira cada etapa com entrada própria: a limpeza recebe [(" SOM ", 0)] e a soma recebe [("luz", 2), ("luz", 0), ("luz", 1)]. No lote vazio, mostre apenas total zero.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/composicao/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/composicao/e3
py exercicio.py
```

```python
registros = [(" Água ", 2), ("água", 4), ("LUZ", 3)]

def normalizar(registros):
    pass

def somar_por_tema(registros):
    pass

def apresentar(totais):
    pass

# Componha as funções passando adiante cada retorno.
```

Saída esperada

```text
luz: 3 min
água: 6 min
Total: 9 min
```

<details>
<summary>Ver uma pista</summary>

Faça a primeira função devolver pares. A segunda recebe esses pares e devolve o dicionário que a terceira mostra.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def normalizar(registros):
    return [(tema.strip().lower(), minutos) for tema, minutos in registros]

def somar_por_tema(registros):
    totais = {}
    for tema, minutos in registros:
        totais[tema] = totais.get(tema, 0) + minutos
    return totais

def apresentar(totais):
    for tema in sorted(totais):
        print(f"{tema}: {totais[tema]} min")
    print(f"Total: {sum(totais.values())} min")

registros = [(" Água ", 2), ("água", 4), ("LUZ", 3)]
apresentar(somar_por_tema(normalizar(registros)))
```

Saída esperada

```text
luz: 3 min
água: 6 min
Total: 9 min
```

normalizar tira espaços e converte os nomes em minúsculas. somar_por_tema reúne nomes iguais. apresentar usa a ordem de sorted, que compara textos por pontos de código. Assim, luz precede água. Os dois testes isolam a limpeza para som e a soma 3 para luz. Com lote vazio, não há temas e sum dos subtotais devolve 0.

No ZIP, a solução está em `aulas/composicao/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/arquivos/caminhos-e-texto)

## Fontes

- [Parâmetros nomeados](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#keyword-arguments)
- [Guia de ordenação e funções chave](https://docs.python.org/pt-br/3.14/howto/sorting.html#key-functions)
