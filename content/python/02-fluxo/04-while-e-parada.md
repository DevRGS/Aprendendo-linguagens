# While e parada

Que mudança faz uma contagem iniciada em 3 acabar? Nesta aula você vai prever a parada e usar uma entrada para sinalizar o fim de um lote. Retome [For e acumuladores](#/python/fluxo/for-e-acumuladores) e [Entrada e erros](#/python/inicio/entrada-e-erros) se precisar.

Em `while faltam > 0:`, Python testa a condição antes de cada passagem. Começando em 3 e subtraindo 1 a cada vez, `faltam` chega a 0. A condição falha e o corpo não roda novamente. Se a atualização falta ou move o estado na direção errada, o laço pode nunca parar.

Uma sentinela é um valor separado para indicar o fim da leitura. Nesta aula será 0. Dentro de `while True`, `break` encerra imediatamente o laço. Confira a sentinela antes de incrementar a contagem ou a soma. Se precisar parar uma execução no terminal, use Ctrl+C. No caderno, use o controle **Interromper kernel**.

O que deve acontecer quando a primeira entrada já é a sentinela? Nas próximas aulas você vai processar sequências e distinguir valores ausentes de zeros legítimos.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/fluxo/while-e-parada.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/fluxo/while-e-parada-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/fluxo.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja os valores impressos antes da condição falhar. Conte de 3 até 1 com while.

**Bash**

```bash
cd aulas/while-e-parada/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/while-e-parada/e1
py exemplo.py
```

```python
faltam = 3
while faltam > 0:
    print(faltam)
    faltam = faltam - 1
```

Saída esperada

```text
3
2
1
```

O 0 é alcançado depois da última atualização. O próximo teste é falso e impede que 0 seja impresso.

## E2 · Altere ou depure

No papel, trace o trecho intencionalmente incompleto `faltam = 2` seguido de `while faltam > 0: print(faltam)`. Qual valor se repetiria? Escreva a atualização que falta antes de executar a versão corrigida abaixo.

**Bash**

```bash
cd aulas/while-e-parada/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/while-e-parada/e2
py variacao.py
```

```python
faltam = 2
while faltam > 0:
    print(faltam)
    faltam = faltam - 1
print("Fim")
```

Saída esperada

```text
2
1
Fim
```

Sem a atualização, faltam continuaria 2. A subtração altera o estado a cada passagem e finalmente torna a condição falsa.

## E3 · Resolva

Leia um inteiro por vez. Digite `3`, `2` e `0`, confirmando cada linha. Mostre a quantidade de entradas anteriores ao zero e a soma delas, sem contar a sentinela. Repita com 0 como primeira entrada.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/while-e-parada/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/while-e-parada/e3
py exercicio.py
```

```python
quantidade = 0
total = 0
while True:
    valor = int(input())
    # Teste a sentinela antes de atualizar.
    break  # Substitua pela condição de parada e pelo acúmulo.
```

Digite cada entrada em uma linha.

```text
3
2
0
```

Saída esperada

```text
Quantidade: 2
Total: 5
```

<details>
<summary>Ver uma pista</summary>

Leia, teste o zero e só depois mude os acumuladores.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
quantidade = 0
total = 0
while True:
    valor = int(input())
    if valor == 0:
        break
    quantidade = quantidade + 1
    total = total + valor
print("Quantidade:", quantidade)
print("Total:", total)
```

Digite cada entrada em uma linha.

```text
3
2
0
```

Saída esperada

```text
Quantidade: 2
Total: 5
```

A checagem antes da atualização impede que zero conte como entrada. Com 0 no primeiro pedido, ambos os acumuladores permanecem em 0. Forneça inteiros até o zero para encerrar.

No ZIP, a solução está em `aulas/while-e-parada/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/sequencias/texto-e-fatias)

## Fontes

- [Instrução while](https://docs.python.org/pt-br/3.14/reference/compound_stmts.html#the-while-statement)
- [Controle de laços com break](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#break-and-continue-statements)
