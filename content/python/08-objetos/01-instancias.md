# Instâncias e estado

Crie dois contadores. Antes de incrementar um deles, preveja o valor que ficará no outro. Retome [funções e argumentos](#/python/funcoes/parametros-e-retorno).

Uma classe define como criar e usar um tipo de objeto. Cada chamada a `Contador()` cria uma instância. O método `__init__` inicializa essa instância. Em `a.incrementar()`, Python passa o objeto `a` como primeiro argumento do método, chamado `self`. Atribuir `self.valor` guarda estado naquela instância.

Execute cada bloco em sua pasta do kit ou na célula correspondente do caderno. Que lugar dá uma lista própria a cada contador? Na próxima aula, [dataclasses](#/python/objetos/dataclasses) gera parte da inicialização.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/objetos/instancias.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/objetos/instancias-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/objetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Crie e exiba dois contadores, incremente apenas o primeiro e observe os dois estados finais.

**Bash**

```bash
cd aulas/instancias/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/instancias/e1
py exemplo.py
```

```python
class Contador:
    def __init__(self):
        self.valor = 0

    def incrementar(self):
        self.valor += 1


a, b = Contador(), Contador()
print(a.valor, b.valor)
a.incrementar()
print(a.valor, b.valor)
```

Saída esperada

```text
0 0
1 0
```

self aponta para a instância que recebeu a chamada. O método mudou apenas a.valor.

## E2 · Altere ou depure

Em `AgendaCompartilhada`, acrescente "coleta" pela primeira instância e consulte a segunda. Depois teste uma lista inicializada por instância.

**Bash**

```bash
cd aulas/instancias/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/instancias/e2
py variacao.py
```

```python
class AgendaCompartilhada:
    tarefas = []


class AgendaIndividual:
    def __init__(self):
        self.tarefas = []


a, b = AgendaCompartilhada(), AgendaCompartilhada()
a.tarefas.append("coleta")
print(b.tarefas)

c, d = AgendaIndividual(), AgendaIndividual()
c.tarefas.append("coleta")
print(d.tarefas)
```

Saída esperada

```text
['coleta']
[]
```

O corpo da classe cria uma lista compartilhada. append modifica o objeto encontrado pela primeira instância. Em __init__, cada chamada cria e atribui outra lista.

## E3 · Resolva

Implemente Acumulador com total inicial 0 e um método adicionar. Adicione 2 e 5 à primeira instância e exiba 7. Uma instância nova ou que recebeu apenas 0 deve expor total 0.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/instancias/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/instancias/e3
py exercicio.py
```

```python
class Acumulador:
    def __init__(self):
        # Defina o estado inicial desta instância.
        raise NotImplementedError

    def adicionar(self, valor):
        raise NotImplementedError


acumulador = Acumulador()
# Adicione 2 e 5 e imprima o total.
```

Saída esperada

```text
7
0
```

<details>
<summary>Ver uma pista</summary>

No inicializador, atribua `self.total = 0`.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
class Acumulador:
    def __init__(self):
        self.total = 0

    def adicionar(self, valor):
        self.total += valor


acumulador = Acumulador()
acumulador.adicionar(2)
acumulador.adicionar(5)
print(acumulador.total)

vazio = Acumulador()
vazio.adicionar(0)
print(vazio.total)
```

Saída esperada

```text
7
0
```

O total fica na instância. Cada método adiciona ao valor anterior. Acrescentar zero preserva o total e outra instância começa do próprio zero.

No ZIP, a solução está em `aulas/instancias/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/objetos/dataclasses)

## Fontes

- [Classes, objetos e métodos](https://docs.python.org/3.14/tutorial/classes.html#class-objects)
- [Variáveis de classe e de instância](https://docs.python.org/3.14/tutorial/classes.html#class-and-instance-variables)
