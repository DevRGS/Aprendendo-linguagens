# Listas e cópias

Se você acrescentar 8 a uma lista de medidas, o que verá pelo nome original? Retome [Texto e fatias](#/python/sequencias/texto-e-fatias) para rever o índice inicial 0.

Uma lista ordena itens entre colchetes. Em `medidas = [4, 6]`, `medidas[0]` é 4. `medidas.append(8)` acrescenta ao fim e altera a lista existente. `medidas[1] = 7` substitui o segundo item. `medidas.remove(7)` remove a primeira ocorrência do valor 7. Para remover pela posição, use `pop(indice)`, que também devolve o item removido.

`outra = medidas` liga outro nome à mesma lista. Uma alteração feita por qualquer nome aparece pelo outro. `outra = medidas.copy()` cria uma nova lista externa, de modo que substituir ou acrescentar itens nela não altera a lista original. Essa cópia é rasa: se os itens forem listas internas, elas continuam compartilhadas. Aqui usamos listas planas de inteiros.

Antes de seguir para [Percorrer e filtrar](#/python/sequencias/percorrer-e-filtrar), explique por que dar um novo nome à mesma lista não protege as medidas originais.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/sequencias/listas.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/sequencias/listas-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/sequencias.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja a posição de 8 depois de acrescentá-lo a [4, 6]. Mostre a lista resultante.

**Bash**

```bash
cd aulas/listas/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/listas/e1
py exemplo.py
```

```python
medidas = [4, 6]
medidas.append(8)
print(medidas)
```

Saída esperada

```text
[4, 6, 8]
```

append acrescenta no fim da lista. O 8 fica no índice 2.

## E2 · Altere ou depure

Preveja o conteúdo do original, do nome compartilhado e da cópia ao alterar o primeiro item pelo nome compartilhado.

**Bash**

```bash
cd aulas/listas/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/listas/e2
py variacao.py
```

```python
original = [4, 6]
compartilhada = original
copia = original.copy()
compartilhada[0] = 9
print(original)
print(compartilhada)
print(copia)
```

Saída esperada

```text
[9, 6]
[9, 6]
[4, 6]
```

original e compartilhada referenciam a mesma lista. A cópia foi criada antes da alteração e conserva a sequência anterior.

## E3 · Resolva

Parta de [4, 6, 4]. Faça uma cópia, remova dela só a primeira ocorrência de 4 e acrescente 8. Exiba o original e a cópia, nessa ordem. Confira também se acrescentar à cópia de uma lista vazia deixa o original vazio.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/listas/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/listas/e3
py exercicio.py
```

```python
original = [4, 6, 4]
# Crie outra lista e faça as mudanças apenas nela.
```

Saída esperada

```text
[4, 6, 4]
[6, 4, 8]
```

<details>
<summary>Ver uma pista</summary>

Crie a cópia antes de chamar qualquer método que altere a lista.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
original = [4, 6, 4]
ajustada = original.copy()
ajustada.remove(4)
ajustada.append(8)
print(original)
print(ajustada)
```

Saída esperada

```text
[4, 6, 4]
[6, 4, 8]
```

A cópia tem estrutura externa própria. remove atua pela primeira ocorrência do valor. O caso vazio testa apenas append, pois uma lista vazia não contém 4 para remover.

No ZIP, a solução está em `aulas/listas/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/sequencias/percorrer-e-filtrar)

## Fontes

- [Listas no tutorial](https://docs.python.org/pt-br/3.14/tutorial/introduction.html#lists)
- [Métodos de lista e cópia rasa](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#more-on-lists)
