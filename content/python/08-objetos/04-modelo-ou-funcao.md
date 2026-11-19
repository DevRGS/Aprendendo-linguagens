# Escolher entre objeto e função

Compare dois lotes com medidas diferentes. Antes de rodar, preveja o total de cada um e decida onde guardar o estado. Retome [contratos de funções](#/python/funcoes/contratos-e-tipos) e [estado por instância](#/python/objetos/instancias).

Uma transformação sem estado pode ser uma função pura. Ela devolve o mesmo resultado para entradas iguais e não altera os dados nem o ambiente. Um objeto pode manter estado quando há atualizações em momentos diferentes. Passe as dependências explicitamente. Um resumo de lista pronta pode receber os dados por argumento, enquanto uma coleta incremental pode precisar de uma instância por lote.

O caderno e o kit trazem entradas pequenas e independentes. Em E3, confira quantidade, total e o caso de lote vazio. Como a escolha mudaria se as medidas viessem uma por vez? Depois siga para [iteração](#/python/protocolos/iteradores).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/objetos/modelo-ou-funcao.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/objetos/modelo-ou-funcao-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/objetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Reescreva um resumo sem estado como função pura. Compare seu retorno com o da classe e confira se a lista original mudou.

**Bash**

```bash
cd aulas/modelo-ou-funcao/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/modelo-ou-funcao/e1
py exemplo.py
```

```python
class Calculadora:
    def resumo(self, medidas):
        return {"total": sum(medidas), "quantidade": len(medidas)}


def resumir(medidas):
    return {"total": sum(medidas), "quantidade": len(medidas)}

medidas = [2, 5]
print(resumir(medidas) == Calculadora().resumo(medidas))
print(medidas)
```

Saída esperada

```text
True
[2, 5]
```

A classe não tem estado próprio. A função obtém o mesmo resultado só com o argumento e preserva a lista de entrada.

## E2 · Altere ou depure

Simule dois lotes de uma coleta incremental. Observe o que acontece ao reutilizar a instância e depois confira o total com instâncias independentes.

**Bash**

```bash
cd aulas/modelo-ou-funcao/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/modelo-ou-funcao/e2
py variacao.py
```

```python
class Coleta:
    def __init__(self):
        self.total = 0

    def registrar(self, valor):
        self.total += valor


compartilhada = Coleta()
compartilhada.registrar(2)
compartilhada.registrar(5)
print(compartilhada.total)

lote_a, lote_b = Coleta(), Coleta()
lote_a.registrar(2)
lote_b.registrar(5)
print(lote_a.total, lote_b.total)
```

Saída esperada

```text
7
2 5
```

O contrato pede totais separados por lote. Reusar o mesmo objeto soma os dois. Cada instância carrega sua própria atualização.

## E3 · Resolva

Entregue uma função relatorio(medidas) que devolva total e quantidade para uma lista entregue de uma vez. Teste [2, 5], [0] e []. Mostre que chamá-la duas vezes não acumula estado. Justifique a escolha de função ou objeto.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/modelo-ou-funcao/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/modelo-ou-funcao/e3
py exercicio.py
```

```python
def relatorio(medidas):
    # Devolva os campos total e quantidade.
    raise NotImplementedError

assert relatorio([2, 5]) == {"total": 7, "quantidade": 2}
# Inclua testes de zero, lista vazia e repetição.
```

Saída esperada

```text
{'total': 7, 'quantidade': 2}
quatro verificações passaram
```

<details>
<summary>Ver uma pista</summary>

Some e conte apenas os elementos da lista recebida nesta chamada.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def relatorio(medidas):
    return {"total": sum(medidas), "quantidade": len(medidas)}

normal = relatorio([2, 5])
assert normal == {"total": 7, "quantidade": 2}
assert relatorio([0]) == {"total": 0, "quantidade": 1}
assert relatorio([]) == {"total": 0, "quantidade": 0}
assert relatorio([2, 5]) == normal
print(normal)
print("quatro verificações passaram")
```

Saída esperada

```text
{'total': 7, 'quantidade': 2}
quatro verificações passaram
```

A lista completa chega como argumento. Uma função basta, pois cada resultado depende só daquela lista. Zero entra na quantidade. A lista vazia tem total e quantidade 0. As condições de assert verificam resultados previstos independentemente.

No ZIP, a solução está em `aulas/modelo-ou-funcao/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/protocolos/iteradores)

## Fontes

- [Comportamento funcional](https://docs.python.org/3.14/howto/functional.html)
- [Estado de instância e classe](https://docs.python.org/3.14/tutorial/classes.html#class-and-instance-variables)
