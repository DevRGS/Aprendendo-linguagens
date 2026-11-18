# Decoradores e encaminhamento de chamadas

Envolva uma função de cálculo com um registro de chamadas e verifique se o valor calculado é preservado. Retome [funções como valores](#/python/funcoes/composicao) e [retorno](#/python/funcoes/parametros-e-retorno).

Uma função de ordem superior recebe ou devolve funções. No decorador, a função interna guarda acesso ao argumento da função externa. Isso é uma closure. Essa função interna, chamada wrapper, roda no lugar da original. A notação `@decorar` equivale a definir a função e aplicar `nome = decorar(nome)`. `functools.wraps` copia metadados, como `__name__`. Encaminhar `*args` e `**kwargs` e usar `return` preserva a chamada e o resultado.

Cada bloco define seu próprio decorador na célula ou no kit. O erro do segundo exercício é intencional. O que permanece no objeto função em E3 depois de chamar duas vezes? Em seguida, veja [gerentes de contexto](#/python/protocolos/gerentes-de-contexto).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/protocolos/decoradores.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/protocolos/decoradores-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/protocolos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Envolva uma função dobro, registre uma chamada e confira se o registro aparece antes ou depois do resultado.

**Bash**

```bash
cd aulas/decoradores/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/decoradores/e1
py exemplo.py
```

```python
def registrar(funcao):
    def wrapper(valor):
        print("chamada registrada")
        return funcao(valor)
    return wrapper

@registrar
def dobro(n):
    return n * 2

print(dobro(3))
```

Saída esperada

```text
chamada registrada
6
```

dobro foi substituída pelo wrapper. Ele registra e devolve o cálculo da função que guardou.

## E2 · Altere ou depure

Investigue o wrapper que perde o retorno e não aceita argumento nomeado. Capture o TypeError intencional e compare com o wrapper reparado.

**Bash**

```bash
cd aulas/decoradores/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/decoradores/e2
py variacao.py
```

```python
def defeituoso(funcao):
    def wrapper(*args):
        funcao(*args)
    return wrapper

def corrigido(funcao):
    def wrapper(*args, **kwargs):
        return funcao(*args, **kwargs)
    return wrapper

def somar(a, b=0):
    return a + b

ruim = defeituoso(somar)
print(ruim(2, 3))
try:
    ruim(2, b=3)
except TypeError:
    print("argumento nomeado rejeitado")

bom = corrigido(somar)
print(bom(2, b=3))
```

Saída esperada

```text
None
argumento nomeado rejeitado
5
```

Sem return, o wrapper devolve None. Sem kwargs, a chamada nomeada falha na entrada do wrapper. A correção encaminha os dois grupos de argumentos e devolve o resultado.

## E3 · Resolva

Decore `etiqueta` para contar duas chamadas e preserve seus retornos e nome. Use um contador por função decorada. Antes da primeira chamada, a contagem deve ser zero.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/decoradores/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/decoradores/e3
py exercicio.py
```

```python
from functools import wraps

def contar(funcao):
    @wraps(funcao)
    def wrapper(*args, **kwargs):
        # Conte a tentativa e devolva o resultado original.
        raise NotImplementedError

    # Inicialize o contador no wrapper antes de devolvê-lo.
    return wrapper
```

Saída esperada

```text
0
ID: a
Lote: b
etiqueta 2
```

<details>
<summary>Ver uma pista</summary>

Inicialize `wrapper.chamadas` na função externa e incremente dentro do wrapper.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from functools import wraps

def contar(funcao):
    @wraps(funcao)
    def wrapper(*args, **kwargs):
        wrapper.chamadas += 1
        return funcao(*args, **kwargs)

    wrapper.chamadas = 0
    return wrapper

@contar
def etiqueta(texto, prefixo="ID"):
    return f"{prefixo}: {texto}"

print(etiqueta.chamadas)
print(etiqueta("a"))
print(etiqueta("b", prefixo="Lote"))
print(etiqueta.__name__, etiqueta.chamadas)
```

Saída esperada

```text
0
ID: a
Lote: b
etiqueta 2
```

Cada aplicação cria um wrapper com seu contador. wraps mantém o nome e return preserva o resultado. A contagem é incrementada antes de executar, então uma chamada que falhe também conta como tentativa.

No ZIP, a solução está em `aulas/decoradores/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/protocolos/gerentes-de-contexto)

## Fontes

- [Sintaxe e ordem de decoradores](https://docs.python.org/3.14/reference/compound_stmts.html#function-definitions)
- [Preservar metadados com wraps](https://docs.python.org/3.14/library/functools.html#functools.wraps)
