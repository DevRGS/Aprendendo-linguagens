# Conjuntos

Dois lotes podem repetir um ID dentro do próprio lote. Como contar IDs distintos? Retome [Listas e cópias](#/python/sequencias/listas) e [Comparações e lógica](#/python/fluxo/comparacoes).

`set([2, 2, 4])` guarda uma vez cada ID. `2 in ids` testa pertinência. A interseção `a & b` contém os itens presentes em ambos. A diferença `a - b` contém os itens de a que estão fora de b. O conjunto não oferece uma ordem de exibição para o relatório. `sorted(ids)` devolve uma lista ordenada dos IDs comparáveis.

`set("ab")` percorre os caracteres do texto. Já `{"ab"}` contém o texto inteiro como um elemento. Para escrever um conjunto vazio, use `set()`, pois `{}` cria um dicionário. Antes de seguir para [Resumo de lote](#/python/registros/resumo-de-lote), explique com um exemplo por que a diferença depende da ordem dos lotes.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/registros/conjuntos.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/registros/conjuntos-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/registros.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja quantos IDs únicos há em [2, 2, 4]. Mostre a lista ordenada e a quantidade.

**Bash**

```bash
cd aulas/conjuntos/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/conjuntos/e1
py exemplo.py
```

```python
ids = set([2, 2, 4])
print(sorted(ids))
print(len(ids))
```

Saída esperada

```text
[2, 4]
2
```

O 2 repetido vira um único elemento. sorted ordena a lista de apresentação.

## E2 · Altere ou depure

Preveja como cada construção trata o texto `"ab"`. Mostre as listas ordenadas para comparar.

**Bash**

```bash
cd aulas/conjuntos/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/conjuntos/e2
py variacao.py
```

```python
caracteres = set("ab")
textos = {"ab"}
print(sorted(caracteres))
print(sorted(textos))
```

Saída esperada

```text
['a', 'b']
['ab']
```

O construtor percorre o texto e recebe a e b separadamente. As chaves com o literal inteiro guardam ab como um elemento.

## E3 · Resolva

Para os lotes [8, 2, 8, 4] e [4, 2, 6], mostre os IDs comuns em ordem crescente, sem repetição. Teste também um segundo lote que tenha apenas o ID 9.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/conjuntos/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/conjuntos/e3
py exercicio.py
```

```python
lote_a = [8, 2, 8, 4]
lote_b = [4, 2, 6]
# Encontre os comuns e mostre em ordem crescente.
```

Saída esperada

```text
[2, 4]
```

<details>
<summary>Ver uma pista</summary>

Use um conjunto para cada lote e o operador de interseção entre eles.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
lote_a = [8, 2, 8, 4]
lote_b = [4, 2, 6]
comuns = set(lote_a) & set(lote_b)
print(sorted(comuns))
```

Saída esperada

```text
[2, 4]
```

A interseção exige ocorrência nos dois lotes. Ordenar produz uma lista estável para mostrar. Se nenhum ID coincide, a interseção e a lista de saída ficam vazias.

No ZIP, a solução está em `aulas/conjuntos/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/registros/resumo-de-lote)

## Fontes

- [Conjuntos no tutorial](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#sets)
- [Tipos de conjuntos](https://docs.python.org/pt-br/3.14/library/stdtypes.html#set-types-set-frozenset)
