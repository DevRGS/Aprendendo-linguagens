# Custo de buscas e índices

Procure o último ID e um ausente em uma lista. Antes da busca, estime o número de comparações. Retome [percorrer sequências](#/python/sequencias/percorrer-e-filtrar) e [conjuntos](#/python/registros/conjuntos).

Uma busca linear compara elementos até achar o alvo ou acabar a lista. Seu pior caso cresce na proporção do comprimento. Um `set` cria um índice de pertinência por hash, com busca usual de custo médio constante sob condições típicas. Sua construção percorre os dados, guarda as chaves únicas e usa memória adicional. O custo de colisões depende dos dados, portanto o exemplo conta passagens e consultas, e deixa a medição de tempo para uma comparação controlada.

No caderno e no kit, rode os mesmos valores. Em E2, compare contagens, não segundos. Quantas consultas justificam construir um índice neste cenário? Em seguida, veja [reprodutibilidade](#/python/qualidade/reprodutibilidade).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/qualidade/custo-de-operacoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/qualidade/custo-de-operacoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/qualidade.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Conte comparações ao buscar 40 e 99 em [10, 20, 30, 40]. Identifique se uma busca para antes da outra.

**Bash**

```bash
cd aulas/custo-de-operacoes/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/custo-de-operacoes/e1
py exemplo.py
```

```python
def buscar_lista(valores, alvo):
    comparacoes = 0
    for valor in valores:
        comparacoes += 1
        if valor == alvo:
            return True, comparacoes
    return False, comparacoes

ids = [10, 20, 30, 40]
for alvo in [40, 99]:
    print(buscar_lista(ids, alvo))
```

Saída esperada

```text
(True, 4)
(False, 4)
```

40 está na última posição. 99 não existe. Ambos os casos examinam todos os itens, embora a resposta de pertinência seja diferente.

## E2 · Altere ou depure

Para quatro IDs e três consultas, compare a busca repetida na lista com a construção de um único set e consultas de pertinência. Confira as mesmas respostas.

**Bash**

```bash
cd aulas/custo-de-operacoes/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/custo-de-operacoes/e2
py variacao.py
```

```python
def buscar_lista(valores, alvo):
    comparacoes = 0
    for valor in valores:
        comparacoes += 1
        if valor == alvo:
            return True, comparacoes
    return False, comparacoes

ids = [10, 20, 30, 40]
consultas = [40, 99, 10]

resultados = [buscar_lista(ids, alvo) for alvo in consultas]
indice = set(ids)
respostas = [alvo in indice for alvo in consultas]
print([encontrado for encontrado, _ in resultados] == respostas)
print("comparações na lista:", sum(contagem for _, contagem in resultados))
print("itens lidos para construir:", len(ids))
print("consultas ao índice:", len(consultas))
```

Saída esperada

```text
True
comparações na lista: 9
itens lidos para construir: 4
consultas ao índice: 3
```

As comparações lineares somam 4 + 4 + 1. O índice usa uma passagem inicial e três operações de pertinência. Estas são contagens de atividades diferentes, pois cada consulta ao set pode ter mais de uma operação interna.

## E3 · Resolva

Confirme o acordo entre lista e índice para 100 IDs e 1000 consultas alternadas ao último e a um ausente. Conte comparações da lista, itens da construção e consultas ao índice. Confira a pertinência em entrada vazia e justifique quando reaproveitar o índice.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/custo-de-operacoes/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/custo-de-operacoes/e3
py exercicio.py
```

```python
ids = list(range(100))
consultas = [99, -1] * 500
# Use a busca contada de E1 e compare os resultados com um set.
# Inclua uma entrada vazia.
```

Saída esperada

```text
respostas iguais: True
comparações: 100000
construção e consultas: 100 1000
vazio: True
```

<details>
<summary>Ver uma pista</summary>

Crie `set(ids)` fora do laço de consultas e compare todas as respostas em ordem.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def buscar_lista(valores, alvo):
    comparacoes = 0
    for valor in valores:
        comparacoes += 1
        if valor == alvo:
            return True, comparacoes
    return False, comparacoes

ids = list(range(100))
consultas = [99, -1] * 500
indice = set(ids)
resultados = [buscar_lista(ids, alvo) for alvo in consultas]
iguais = [a for a, _ in resultados] == [alvo in indice for alvo in consultas]
print("respostas iguais:", iguais)
print("comparações:", sum(qtd for _, qtd in resultados))
print("construção e consultas:", len(ids), len(consultas))
print("vazio:", buscar_lista([], 99)[0] == (99 in set()))
```

Saída esperada

```text
respostas iguais: True
comparações: 100000
construção e consultas: 100 1000
vazio: True
```

São 100 comparações em cada busca de último ou ausente. Construir o índice uma vez favorece muitas consultas repetidas e custa memória para as chaves. Para uma consulta simples em uma lista pequena, a passagem de construção pode não compensar. Uma entrada vazia dá ausência nos dois casos.

No ZIP, a solução está em `aulas/custo-de-operacoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/qualidade/reprodutibilidade)

## Fontes

- [Conjuntos e pertinência](https://docs.python.org/3.14/library/stdtypes.html#set-types-set-frozenset)
- [Objetos que podem servir como chaves de hash](https://docs.python.org/3.14/glossary.html#term-hashable)
