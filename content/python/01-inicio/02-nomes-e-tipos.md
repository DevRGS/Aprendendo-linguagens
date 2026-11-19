# Nomes e tipos

Como guardar 4 aulas e acrescentar 2 antes de exibir o total? Você já precisa conseguir chamar `print`. Se quiser retomar, abra [Primeira execução](#/python/inicio/primeira-execucao). Cada prática começa com os próprios valores.

Um literal é um valor escrito diretamente no código. Em `aulas = 4`, o literal inteiro é 4 e a atribuição liga o nome `aulas` a esse valor. Ao ler `aulas = aulas + 2`, comece pelo lado direito: o valor anterior é 4, a soma produz 6 e só depois o nome passa a designar 6.

`int` é o tipo de 4, `float` é o tipo de 4.0, `str` é o tipo de `"4"` e `bool` é o tipo dos valores `True` e `False`. O tipo define operações possíveis. Multiplicar um texto por um inteiro repete o texto. Multiplicar dois inteiros faz uma conta. Em `type(valor).__name__`, `type(valor)` identifica o tipo e `.__name__` extrai seu nome curto.

Preveja se `print("4")` e `print(4)` exibem a mesma linha. A saída pode coincidir mesmo quando os tipos diferem. A próxima aula usa números para converter unidades.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/inicio/nomes-e-tipos.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/inicio/nomes-e-tipos-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/inicio.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Antes de executar, diga quanto vale `aulas` depois de cada atribuição. Exiba o total depois de acrescentar duas aulas a quatro.

**Bash**

```bash
cd aulas/nomes-e-tipos/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/nomes-e-tipos/e1
py exemplo.py
```

```python
aulas = 4
aulas = aulas + 2
print(aulas)
```

Saída esperada

```text
6
```

A primeira atribuição liga aulas a 4. A expressão à direita da segunda usa esse 4 e liga aulas ao resultado 6.

## E2 · Altere ou depure

Preveja separadamente o valor e o tipo de `"4" * 2` e de `4 * 2`. Exiba os dois pares.

**Bash**

```bash
cd aulas/nomes-e-tipos/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/nomes-e-tipos/e2
py variacao.py
```

```python
codigo = "4" * 2
dobro = 4 * 2
print(codigo, type(codigo).__name__)
print(dobro, type(dobro).__name__)
```

Saída esperada

```text
44 str
8 int
```

O inteiro à direita de um texto determina o número de repetições. Entre dois inteiros, o mesmo operador calcula o produto.

## E3 · Resolva

Monte uma ficha com título `Revisão`, duração `2.5` em horas e indicador de conclusão verdadeiro. Exiba cada valor com o nome do seu tipo. Em seguida teste uma etapa ainda pendente de duração `0.0`.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/nomes-e-tipos/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/nomes-e-tipos/e3
py exercicio.py
```

```python
titulo = "Revisão"
# Defina a duração e o indicador. Em seguida mostre valor e tipo de cada campo.
```

Saída esperada

```text
Revisão str
2.5 float
True bool
```

<details>
<summary>Ver uma pista</summary>

Use texto entre aspas, ponto na duração decimal e a inicial maiúscula de True ou False.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
titulo = "Revisão"
duracao = 2.5
concluida = True
print(titulo, type(titulo).__name__)
print(duracao, type(duracao).__name__)
print(concluida, type(concluida).__name__)
```

Saída esperada

```text
Revisão str
2.5 float
True bool
```

O título é um texto, a duração em horas é float e o indicador é bool. Ao escrever 0.0, você mantém o tipo float mesmo com valor zero. Uma etapa pendente usa o literal False.

No ZIP, a solução está em `aulas/nomes-e-tipos/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/inicio/contas-e-formatacao)

## Fontes

- [Literais numéricos e texto](https://docs.python.org/pt-br/3.14/tutorial/introduction.html)
- [Função type](https://docs.python.org/pt-br/3.14/library/functions.html#type)
