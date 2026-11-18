# Contratos e tipos

Como comunicar a quem chama uma função de média o que fazer com uma lista vazia? Retome [Parâmetros e retorno](#/python/funcoes/parametros-e-retorno) e [Listas e cópias](#/python/sequencias/listas).

Um contrato explicita pré-condições, como “a lista contém números e tem pelo menos um valor”, e pós-condições, como “o resultado é a soma dividida pela quantidade”. Uma docstring é o texto colocado como primeira instrução do corpo. Use-a para descrever a regra e limites que a assinatura não expressa sozinha.

Em `def media(valores: list[float]) -> float:`, `:` depois de `valores` anota o tipo esperado do argumento e `->` anota o retorno. Anotar não insere testes de validade em tempo de execução. Uma lista vazia chega ao corpo, e dividir por seu comprimento zero levanta `ZeroDivisionError`. Uma função pode escolher outro contrato, como retornar `None` no caso vazio. A anotação `float | None` permite comunicar essas duas possibilidades.

Antes de passar para [Composição](#/python/funcoes/composicao), compare a média de [0, 0] com o resultado de []. Uma tem valor numérico e a outra representa ausência.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/funcoes/contratos-e-tipos.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/funcoes/contratos-e-tipos-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/funcoes.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

A função abaixo espera uma lista numérica não vazia. Preveja a soma, a quantidade e o retorno para [2.0, 4.0].

**Bash**

```bash
cd aulas/contratos-e-tipos/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/contratos-e-tipos/e1
py exemplo.py
```

```python
def media(valores: list[float]) -> float:
    """Calcule a média de uma lista não vazia."""
    return sum(valores) / len(valores)

print(media([2.0, 4.0]))
```

Saída esperada

```text
3.0
```

sum calcula 6.0 e len informa 2. A divisão retorna 3.0, conforme a regra documentada.

## E2 · Altere ou depure

Faça a chamada intencionalmente fora do contrato com lista vazia. Preveja se a anotação bloqueia a entrada antes de o corpo rodar. O exemplo captura só o erro esperado.

**Bash**

```bash
cd aulas/contratos-e-tipos/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/contratos-e-tipos/e2
py variacao.py
```

```python
def media(valores: list[float]) -> float:
    """Calcule a média de uma lista não vazia."""
    return sum(valores) / len(valores)

try:
    media([])
except ZeroDivisionError:
    print("ZeroDivisionError")
```

Saída esperada

```text
ZeroDivisionError
```

A chamada chega ao corpo. A divisão falha porque len([]) é zero. A anotação não prevê o comprimento e não valida o valor.

## E3 · Resolva

Implemente `media_ou_none` com anotação e docstring. Para uma lista de números não vazia, devolva a média como float. Para uma vazia, devolva None. Mostre o resultado de [2, 4] e []. Confira o caso [0, 0] para distinguir zero de ausência.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/contratos-e-tipos/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/contratos-e-tipos/e3
py exercicio.py
```

```python
def media_ou_none(valores: list[float]) -> float | None:
    # Documente o contrato antes de escrever as instruções do corpo.
    pass

print(media_ou_none([2, 4]))
print(media_ou_none([]))
```

Saída esperada

```text
3.0
None
```

<details>
<summary>Ver uma pista</summary>

Teste o comprimento antes de dividir. Declare as duas formas de retorno na assinatura.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def media_ou_none(valores: list[float]) -> float | None:
    """Retorne a média dos números ou None quando a lista estiver vazia."""
    if len(valores) == 0:
        return None
    return sum(valores) / len(valores)

print(media_ou_none([2, 4]))
print(media_ou_none([]))
```

Saída esperada

```text
3.0
None
```

A função verifica o limite antes da divisão. Uma lista de dois zeros produz 0.0 e não passa pelo ramo da ausência. As anotações descrevem os tipos previstos e o teste de comprimento faz a decisão real.

No ZIP, a solução está em `aulas/contratos-e-tipos/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/funcoes/composicao)

## Fontes

- [Docstrings](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#documentation-strings)
- [Anotações de função](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#function-annotations)
