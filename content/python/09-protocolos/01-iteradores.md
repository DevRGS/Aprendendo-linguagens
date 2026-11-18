# Iteráveis, iteradores e esgotamento

Leia dois valores, um por vez. Antes da terceira chamada, preveja se o cursor retorna ao início. Retome [laços](#/python/fluxo/for-e-acumuladores) e [listas](#/python/sequencias/listas).

Um iterável pode fornecer um iterador por `iter(objeto)`. Um iterador guarda a posição, e `next(iterador)` solicita o próximo valor. Quando acaba, a chamada sem padrão levanta `StopIteration`. Um laço for usa esse sinal para terminar. Já `next(iterador, padrão)` devolve o padrão no esgotamento. Uma lista normalmente fornece um iterador novo a cada percurso. Pedir `iter` ao próprio iterador devolve o mesmo objeto.

Use cada bloco na célula ou pasta do próprio exercício. O esgotamento de E1 é intencional. Que padrão você escolheria se zero fosse um valor válido? Em seguida, veja [geradores](#/python/protocolos/geradores).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/protocolos/iteradores.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/protocolos/iteradores-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/protocolos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Consuma [2, 5] com duas chamadas. Faça uma terceira chamada intencionalmente e capture apenas StopIteration.

**Bash**

```bash
cd aulas/iteradores/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/iteradores/e1
py exemplo.py
```

```python
cursor = iter([2, 5])
print(next(cursor))
print(next(cursor))
try:
    next(cursor)
except StopIteration:
    print("fim do iterador")
```

Saída esperada

```text
2
5
fim do iterador
```

O iterador lembra onde parou. O terceiro next sinaliza esgotamento, e o tratamento mostra isso em uma linha.

## E2 · Altere ou depure

Faça dois percursos de uma lista e dois do mesmo iterador. Preveja o segundo resultado de cada um.

**Bash**

```bash
cd aulas/iteradores/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/iteradores/e2
py variacao.py
```

```python
valores = [2, 5]
print([n for n in valores], [n for n in valores])

cursor = iter(valores)
print(list(cursor), list(cursor))
```

Saída esperada

```text
[2, 5] [2, 5]
[2, 5] []
```

Cada compreensão sobre a lista pede outro iterador. Com o cursor, list consome tudo na primeira chamada e não encontra itens na segunda.

## E3 · Resolva

Obtenha apenas o primeiro inteiro não negativo em [None, -1, 0, 4]. Use None como padrão para uma entrada sem válidos, inclusive a sequência vazia.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/iteradores/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/iteradores/e3
py exercicio.py
```

```python
def primeiro_valido(registros):
    candidatos = (n for n in registros if type(n) is int and n >= 0)
    # Consuma só o primeiro e informe o que fazer no esgotamento.
    raise NotImplementedError

print(primeiro_valido([None, -1, 0, 4]))
print(primeiro_valido([]))
```

Saída esperada

```text
0
None
None
```

<details>
<summary>Ver uma pista</summary>

Passe um padrão a `next`. O teste de válido deve aceitar zero.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def primeiro_valido(registros):
    validos = (n for n in registros if type(n) is int and n >= 0)
    return next(validos, None)

print(primeiro_valido([None, -1, 0, 4]))
print(primeiro_valido([None, -2]))
print(primeiro_valido([]))
```

Saída esperada

```text
0
None
None
```

A expressão com parênteses produz os candidatos sob demanda. next só pede um. type(n) is int restringe a inteiros, excluindo bool, e a segunda condição aceita 0. None identifica esgotamento sem ser uma resposta válida.

No ZIP, a solução está em `aulas/iteradores/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/protocolos/geradores)

## Fontes

- [Iteradores](https://docs.python.org/3.14/tutorial/classes.html#iterators)
- [Função next e valor padrão](https://docs.python.org/3.14/library/functions.html#next)
