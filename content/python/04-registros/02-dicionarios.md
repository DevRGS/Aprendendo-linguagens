# Dicionários

Como guardar uma medida por ID e substituir só a medida de a? Retome [Tuplas e desempacotamento](#/python/registros/tuplas-e-desempacotamento) para rever registros em pares.

Um dicionário associa chaves a valores. Em `medidas = {"a": 2}`, a chave é o texto a e o valor é 2. `medidas["a"]` devolve 2. Se a chave não existir, esse acesso obrigatório gera `KeyError`. `medidas.get("b", 0)` devolve 0 como padrão se não houver b. Se zero for um valor registrado, use `"b" in medidas` para testar presença.

`medidas["a"] = 3` substitui apenas a associação de a. `for chave, valor in medidas.items():` entrega cada par para desempacotamento. Antes de avançar, explique quando usar padrão 0 faz sentido, como em uma contagem que ainda não viu a cor. Na próxima aula você vai verificar chaves comuns sem guardar valores.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/registros/dicionarios.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/registros/dicionarios-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/registros.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o valor de a antes e depois da atualização. Leia e exiba o campo nas duas etapas.

**Bash**

```bash
cd aulas/dicionarios/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/dicionarios/e1
py exemplo.py
```

```python
medidas = {"a": 2}
print(medidas["a"])
medidas["a"] = 3
print(medidas["a"])
```

Saída esperada

```text
2
3
```

A segunda atribuição usa a mesma chave e substitui o valor associado.

## E2 · Altere ou depure

Preveja as duas saídas quando a chave a tem valor zero e a chave b está ausente. Compare get com a verificação de presença.

**Bash**

```bash
cd aulas/dicionarios/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/dicionarios/e2
py variacao.py
```

```python
medidas = {"a": 0}
print(medidas.get("a", 0), "a" in medidas)
print(medidas.get("b", 0), "b" in medidas)
```

Saída esperada

```text
0 True
0 False
```

Os valores lidos coincidem, mas só a consta do mapa. O zero para b vem do padrão de get.

## E3 · Resolva

Conte as ocorrências de cada cor em [azul, azul, verde]. Imprima uma linha por cor na ordem da primeira aparição. Confira também se uma entrada vazia produz zero associações.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/dicionarios/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/dicionarios/e3
py exercicio.py
```

```python
cores = ["azul", "azul", "verde"]
frequencias = {}
# Acumule por cor e percorra os pares de frequencias.
```

Saída esperada

```text
azul 2
verde 1
```

<details>
<summary>Ver uma pista</summary>

Use get com padrão zero para ler a contagem antes do primeiro incremento.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
cores = ["azul", "azul", "verde"]
frequencias = {}
for cor in cores:
    frequencias[cor] = frequencias.get(cor, 0) + 1
for cor, quantidade in frequencias.items():
    print(cor, quantidade)
```

Saída esperada

```text
azul 2
verde 1
```

Cada ocorrência acrescenta 1 à frequência anterior, que começa em 0 para uma chave nova. items percorre na ordem de inserção. Sem ocorrências, o mapa fica vazio e o segundo laço não imprime linhas.

No ZIP, a solução está em `aulas/dicionarios/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/registros/conjuntos)

## Fontes

- [Dicionários no tutorial](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#dictionaries)
- [Métodos dos dicionários](https://docs.python.org/pt-br/3.14/library/stdtypes.html#mapping-types-dict)
