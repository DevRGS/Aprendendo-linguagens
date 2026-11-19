# Geradores sob demanda

Solicite só o primeiro quadrado e observe quantas multiplicações acontecem. Retome [iteradores](#/python/protocolos/iteradores).

Uma função com `yield` cria um gerador ao ser chamada. O corpo começa quando pedimos um valor. `yield` entrega o valor e suspende o corpo, que continua na próxima solicitação. Como iterador, o gerador esgota. Consumir itens sob demanda permite processar dados grandes sem guardar a sequência inteira. Transformá-los em `list` materializa todos os itens.

Use o CSV ou texto fornecido apenas onde indicado no enunciado. O arquivo de E3 fica aberto durante o consumo da função geradora. A atividade consome até o final dentro do cálculo. O que mudaria se o consumidor pedisse só um valor? Depois, veja [decoradores](#/python/protocolos/decoradores).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/protocolos/geradores.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/protocolos/geradores-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/protocolos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Gere os quadrados dos inteiros 0, 1 e 2. Antes do laço, diga em que momento a função geradora calculará cada item.

**Bash**

```bash
cd aulas/geradores/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/geradores/e1
py exemplo.py
```

```python
def quadrados(limite):
    for n in range(limite):
        yield n * n

for valor in quadrados(3):
    print(valor)
```

Saída esperada

```text
0
1
4
```

Cada volta do for solicita mais um valor ao gerador. O limite de range exclui 3.

## E2 · Altere ou depure

Acrescente uma marca antes de yield. Crie um gerador e consuma apenas o primeiro valor. Conte as marcas produzidas.

**Bash**

```bash
cd aulas/geradores/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/geradores/e2
py variacao.py
```

```python
def quadrados(limite):
    for n in range(limite):
        print(f"calculando {n}")
        yield n * n

cursor = quadrados(3)
print("gerador criado")
print("primeiro:", next(cursor))
```

Saída esperada

```text
gerador criado
calculando 0
primeiro: 0
```

Criar o gerador ainda não executa o corpo. next avança até o primeiro yield. Para ver a retomada, peça o próximo valor ao mesmo cursor.

## E3 · Resolva

Some os inteiros de `leituras.txt` sem armazenar todas as linhas. Pule linhas sem inteiro, aceite zero e negativos e faça a soma de arquivo vazio resultar em 0. No arquivo fornecido, espere 6.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/geradores/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/geradores/e3
py exercicio.py
```

```python
from pathlib import Path

def inteiros(caminho):
    # Use with, percorra as linhas e emita inteiros com yield.
    raise NotImplementedError

print(sum(inteiros(Path("leituras.txt"))))
```

Saída esperada

```text
6
0
```

<details>
<summary>Ver uma pista</summary>

O yield deve ficar depois da conversão válida. Passe o gerador diretamente a sum.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path

def inteiros(caminho):
    with caminho.open(encoding="utf-8") as arquivo:
        for linha in arquivo:
            try:
                numero = int(linha)
            except ValueError:
                continue
            yield numero

print(sum(inteiros(Path("leituras.txt"))))
print(sum(inteiros(Path("vazio.txt"))))
```

Saída esperada

```text
6
0
```

O gerador lê uma linha de cada vez, e sum consome até o fim sem montar uma lista. O arquivo fica aberto no with durante o consumo e fecha ao encerrar. Sem valores, sum começa e termina em zero.

No ZIP, a solução está em `aulas/geradores/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/protocolos/decoradores)

## Fontes

- [Funções geradoras](https://docs.python.org/3.14/tutorial/classes.html#generators)
- [Expressões geradoras](https://docs.python.org/3.14/tutorial/classes.html#generator-expressions)
