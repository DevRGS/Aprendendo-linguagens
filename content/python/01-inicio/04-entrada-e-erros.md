# Entrada e erros

Se alguém digita 12, o que você precisa fazer antes de somar 1? Você vai ler texto, convertê-lo e aprender por onde começar a investigar um erro. Retome [Nomes e tipos](#/python/inicio/nomes-e-tipos) para rever a diferença entre texto e inteiro.

`input()` espera uma linha e devolve o texto digitado sem a quebra de linha. Ao digitar 12, o valor lido é `"12"`. A chamada `int("12")` devolve o inteiro 12. O programa então consegue calcular 12 + 1. No caderno o pedido aparece sob a célula, na área de entrada do kernel. No terminal, digite quando o programa estiver aguardando. Estes exemplos usam `input()` sem mensagem de prompt e o enunciado indica cada entrada.

Quando surge um erro, leia a última linha da mensagem para localizar a classe, como `ValueError`. Leia também a linha do código apontada pelo intérprete. Um erro pode impedir a análise do programa (`SyntaxError`) ou surgir durante uma instrução analisada com sucesso (`NameError`, por exemplo).

**Exemplo intencionalmente incorreto:** em `prin("ola mundo)` a string está aberta. Confira numa célula descartável ou num arquivo separado. Fechar a string em `prin("ola mundo")` revela o `NameError` numa sessão nova, pois `prin` não foi definido. A correção `print("ola mundo")` exibe `ola mundo`. Compare a classe do erro, pois a mensagem detalhada pode variar.

Explique por que digitar `doze` não equivale a digitar `12` para `int`. O tratamento automático de entradas inválidas vem no [módulo Arquivos e erros](#/python/arquivos/excecoes).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/inicio/entrada-e-erros.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/inicio/entrada-e-erros-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/inicio.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Quando a execução esperar a entrada, digite `12` e confirme com Enter. Transcrição da prática: você digita `12` e o programa escreve `13`. Antes de rodar, diga em que momento surge um inteiro.

**Bash**

```bash
cd aulas/entrada-e-erros/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/entrada-e-erros/e1
py exemplo.py
```

```python
texto = input()
numero = int(texto)
print(numero + 1)
```

Digite cada entrada em uma linha.

```text
12
```

Saída esperada

```text
13
```

A leitura produz o texto '12'. A chamada de int converte o texto e a expressão soma 1 ao inteiro.

## E2 · Altere ou depure

Compare os exemplos intencionalmente incorretos `prin("oi")` e `print("oi)`. Antes de rodar a demonstração abaixo, classifique qual falha na leitura e qual falha só ao executar. O bloco usa `try` para observar exatamente a classe esperada e seguir com a outra demonstração.

**Bash**

```bash
cd aulas/entrada-e-erros/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/entrada-e-erros/e2
py variacao.py
```

```python
try:
    prin("oi")
except NameError:
    print("NameError")

try:
    compile('print("oi)', "<exemplo>", "exec")
except SyntaxError:
    print("SyntaxError")

print("oi")
```

Saída esperada

```text
NameError
SyntaxError
oi
```

prin tem sintaxe de chamada, mas o nome não existe nesta sessão. compile analisa o texto sem executá-lo e detecta a string aberta. A versão corrigida tem aspas fechadas e chama print.

## E3 · Resolva

Leia dois inteiros, um por linha, e mostre a soma. Digite `12`, depois `5`. A saída deve ser `17`. Como variação, tente `doze` na primeira leitura. Preveja a classe de erro e se a soma aparece.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/entrada-e-erros/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/entrada-e-erros/e3
py exercicio.py
```

```python
primeiro_texto = input()
# Converta o primeiro texto, leia e converta o segundo.
# Mostre a soma.
```

Digite cada entrada em uma linha.

```text
12
5
```

Saída esperada

```text
17
```

<details>
<summary>Ver uma pista</summary>

Faça uma leitura por valor e converta cada texto com int antes de usar +.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
primeiro = int(input())
segundo = int(input())
print(primeiro + segundo)
```

Digite cada entrada em uma linha.

```text
12
5
```

Saída esperada

```text
17
```

Cada conversão cria um inteiro antes da adição. Na variação, int('doze') levanta ValueError, a segunda leitura não começa e a soma não aparece. No terminal ou caderno, leia a última linha do erro para confirmar a classe.

No ZIP, a solução está em `aulas/entrada-e-erros/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/fluxo/comparacoes)

## Fontes

- [Função input](https://docs.python.org/pt-br/3.14/library/functions.html#input)
- [Conversão para int](https://docs.python.org/pt-br/3.14/library/functions.html#int)
- [Sintaxe, exceções e últimas linhas](https://docs.python.org/pt-br/3.14/tutorial/errors.html)
