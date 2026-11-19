# Contas e formatação

Quantas horas completas cabem em 135 minutos e quanto sobra? Você vai escolher operações e exibir o resultado em uma forma legível. Retome [Nomes e tipos](#/python/inicio/nomes-e-tipos) se precisar rever atribuições e números.

Use `+`, `-` e `*` para somar, subtrair e multiplicar. Multiplicação e divisão têm prioridade sobre soma e subtração. Parênteses indicam a operação que você quer calcular primeiro. Para inteiros como 135 e 60, `135 / 60` devolve 2.25, um `float`. `135 // 60` dá o quociente inteiro 2 e `135 % 60` dá o resto 15. Conferimos com `2 * 60 + 15 == 135`.

Uma f-string começa com `f` e deixa inserir valores calculados entre chaves. Se `valor` é 7.5, `f"{valor:.2f}"` produz o texto `7.50`. A instrução após os dois pontos controla a apresentação. O número guardado em `valor` continua 7.5.

Antes de avançar, explique qual operação mostraria apenas os minutos que sobraram. Na próxima aula, o valor virá de uma entrada digitada.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/inicio/contas-e-formatacao.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/inicio/contas-e-formatacao-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/inicio.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o número de horas completas e de minutos restantes. Em seguida, converta 135 minutos e imprima os dois valores em uma frase.

**Bash**

```bash
cd aulas/contas-e-formatacao/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/contas-e-formatacao/e1
py exemplo.py
```

```python
total_minutos = 135
horas = total_minutos // 60
minutos = total_minutos % 60
print(f"{horas} horas e {minutos} minutos")
```

Saída esperada

```text
2 horas e 15 minutos
```

O quociente conta grupos completos de 60. O resto mede o que ainda não forma um grupo.

## E2 · Altere ou depure

Preveja qual expressão calcula a soma primeiro. Execute as duas e confira seus palpites.

**Bash**

```bash
cd aulas/contas-e-formatacao/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/contas-e-formatacao/e2
py variacao.py
```

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

Saída esperada

```text
14
20
```

Na primeira linha, 3 vezes 4 vale 12 e depois entra o 2. Na segunda, os parênteses fazem o 2 mais 3 virar o primeiro fator.

## E3 · Resolva

Calcule o total de 3 itens de 2,50 e exiba `Total: 7.50`. Mostre como caso de borda o total de zero itens e explique onde surgem os zeros à direita.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/contas-e-formatacao/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/contas-e-formatacao/e3
py exercicio.py
```

```python
quantidade = 3
preco = 2.50
# Calcule e exiba o total.
```

Saída esperada

```text
Total: 7.50
```

<details>
<summary>Ver uma pista</summary>

Calcule o produto antes e escreva `:.2f` depois do nome dentro das chaves.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
quantidade = 3
preco = 2.50
total = quantidade * preco
print(f"Total: {total:.2f}")
```

Saída esperada

```text
Total: 7.50
```

A multiplicação produz o número 7.5. A f-string monta o texto com duas casas decimais. Com zero itens a conta dá 0.0 e a mesma formatação mostra 0.00.

No ZIP, a solução está em `aulas/contas-e-formatacao/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/inicio/entrada-e-erros)

## Fontes

- [Usar Python como calculadora](https://docs.python.org/pt-br/3.14/tutorial/introduction.html#using-python-as-a-calculator)
- [Strings literais formatadas](https://docs.python.org/pt-br/3.14/tutorial/inputoutput.html#formatted-string-literals)
