# Parâmetros e retorno

Como aproveitar o dobro de 3 em outra conta? Você vai criar uma função para calcular o valor e deixar a chamada decidir como usá-lo. Retome [Contas e formatação](#/python/inicio/contas-e-formatacao) para rever expressões e [Condições e faixas](#/python/fluxo/condicoes) para rever indentação.

`def dobro(numero):` define a função e declara um parâmetro chamado `numero`. Ao chamar `dobro(3)`, o 3 é o argumento e `numero` é o nome que o recebe dentro do bloco. `return numero * 2` termina a chamada e entrega 6 ao chamador. Assim `dobro(3) + 1` pode calcular 7. Rode a definição antes da chamada, no mesmo arquivo ou célula.

`print` escreve na saída. Uma função que chega ao fim do bloco sem executar `return` devolve `None`. Compare o que aparece na tela com o valor que a chamada entrega. Antes de passar para [Escopo e padrões](#/python/funcoes/escopo-e-padroes), explique onde colocaria a impressão se quisesse reutilizar a função num cálculo silencioso.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/funcoes/parametros-e-retorno.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/funcoes/parametros-e-retorno-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/funcoes.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o retorno de dobro(3) e o resultado ao acrescentar 1. Mostre os dois.

**Bash**

```bash
cd aulas/parametros-e-retorno/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/parametros-e-retorno/e1
py exemplo.py
```

```python
def dobro(numero):
    return numero * 2

resultado = dobro(3)
print(resultado)
print(resultado + 1)
```

Saída esperada

```text
6
7
```

A chamada armazena o retorno 6 em resultado, que fica disponível para a conta seguinte.

## E2 · Altere ou depure

A primeira função apenas imprime. Preveja o que será escrito pela função e o que será escrito após guardar seu retorno. Compare com uma versão que devolve o valor.

**Bash**

```bash
cd aulas/parametros-e-retorno/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/parametros-e-retorno/e2
py variacao.py
```

```python
def mostrar_dobro(numero):
    print(numero * 2)

valor = mostrar_dobro(3)
print(valor)

def dobro(numero):
    return numero * 2

valor = dobro(3)
print(valor + 1)
```

Saída esperada

```text
6
None
7
```

mostrar_dobro escreve 6, mas termina sem return e entrega None. dobro retorna o inteiro, que pode participar da adição.

## E3 · Resolva

Escreva `minutos(h, m)` para receber horas inteiras não negativas e minutos inteiros entre 0 e 59. A função deve devolver o total em minutos e a chamada deve exibir o resultado de (2, 15). Confira que (0, 0) retorna 0.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/parametros-e-retorno/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/parametros-e-retorno/e3
py exercicio.py
```

```python
def minutos(h, m):
    pass  # Devolva o total de minutos.

# Mostre o valor devolvido para 2 horas e 15 minutos.
```

Saída esperada

```text
135
```

<details>
<summary>Ver uma pista</summary>

Calcule horas vezes 60 e some os minutos. Use return no corpo e print depois da definição.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def minutos(h, m):
    return h * 60 + m

print(minutos(2, 15))
```

Saída esperada

```text
135
```

Cada hora vale 60 minutos. Multiplique h por 60, some m e retorne esse inteiro. Deixe print no chamador para manter a função reutilizável. A entrada (0, 0) respeita a faixa e devolve zero.

No ZIP, a solução está em `aulas/parametros-e-retorno/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/funcoes/escopo-e-padroes)

## Fontes

- [Definir funções](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#defining-functions)
- [Instrução return](https://docs.python.org/pt-br/3.14/reference/simple_stmts.html#the-return-statement)
