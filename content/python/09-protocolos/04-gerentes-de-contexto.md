# Contexto e limpeza de recursos

Leia um arquivo pequeno e preveja se continuará aberto após sair do bloco. Retome [with e arquivos](#/python/arquivos/caminhos-e-texto), [exceções](#/python/arquivos/excecoes) e [yield](#/python/protocolos/geradores).

Um recurso tem entrada, uso e liberação. `with` aciona o gerente que prepara e finaliza esse uso. O gerenciador pode lidar com a saída por erro. `try/finally` executa a limpeza ao sair do bloco, inclusive se uma exceção se propagar. Com `contextlib.contextmanager`, código antes de `yield` prepara, o valor emitido pode ser usado por `as`, e `finally` executa a liberação.

Os arquivos de E1 e E2 estão nas pastas do roteiro. E2 e E3 levantam erros intencionais e os capturam após a saída do contexto. Qual saída mostraria que a limpeza aconteceu antes da captura? Depois, veja [testes unitários](#/python/qualidade/testes-unitarios).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/protocolos/gerentes-de-contexto.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/protocolos/gerentes-de-contexto-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/protocolos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Leia `amostra.txt` e imprima `arquivo.closed` dentro e fora de with. Preveja as duas respostas.

**Bash**

```bash
cd aulas/gerentes-de-contexto/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/gerentes-de-contexto/e1
py exemplo.py
```

```python
from pathlib import Path

with Path("amostra.txt").open(encoding="utf-8") as arquivo:
    print(arquivo.read().strip())
    print(arquivo.closed)
print(arquivo.closed)
```

Saída esperada

```text
sessão
False
True
```

O arquivo está aberto para leitura dentro do bloco e fechado após a saída. O nome permanece disponível para consultar seu estado.

## E2 · Altere ou depure

Levante ValueError intencional dentro do bloco após ler `amostra.txt`. Capture fora e verifique se o arquivo já está fechado.

**Bash**

```bash
cd aulas/gerentes-de-contexto/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/gerentes-de-contexto/e2
py variacao.py
```

```python
from pathlib import Path

try:
    with Path("amostra.txt").open(encoding="utf-8") as arquivo:
        print(arquivo.read().strip())
        raise ValueError("dado inválido")
except ValueError as erro:
    print(erro)
    print("fechado:", arquivo.closed)
```

Saída esperada

```text
sessão
dado inválido
fechado: True
```

O gerente fecha o arquivo durante a saída por exceção e a captura externa recebe o ValueError original.

## E3 · Resolva

Implemente um contexto que registre início e fim. Faça uma execução normal e outra que levante ValueError no bloco. Registre o fim em ambos os casos e confirme que a exceção observada fora é a original.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/gerentes-de-contexto/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/gerentes-de-contexto/e3
py exercicio.py
```

```python
from contextlib import contextmanager

@contextmanager
def registrar(eventos):
    eventos.append("início")
    # Suspenda durante o bloco e registre o fim na saída.
    raise NotImplementedError

eventos = []
# Teste saídas normal e por ValueError.
```

Saída esperada

```text
início / trabalho / fim
início / fim
mesma exceção: True
```

<details>
<summary>Ver uma pista</summary>

Coloque yield dentro de try e registre o fim em finally.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from contextlib import contextmanager

@contextmanager
def registrar(eventos):
    eventos.append("início")
    try:
        yield
    finally:
        eventos.append("fim")

normal = []
with registrar(normal):
    normal.append("trabalho")
print(" / ".join(normal))

com_erro = []
falha = ValueError("dado inválido")
try:
    with registrar(com_erro):
        raise falha
except ValueError as observada:
    print(" / ".join(com_erro))
    print("mesma exceção:", observada is falha)
```

Saída esperada

```text
início / trabalho / fim
início / fim
mesma exceção: True
```

A entrada registra início. Durante yield, o bloco do with roda. finally executa a limpeza nas duas saídas. Como o gerente não captura o erro, ele se propaga para o tratamento externo.

No ZIP, a solução está em `aulas/gerentes-de-contexto/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/qualidade/testes-unitarios)

## Fontes

- [A instrução with](https://docs.python.org/3.14/reference/compound_stmts.html#the-with-statement)
- [Gerentes com contextmanager](https://docs.python.org/3.14/library/contextlib.html#contextlib.contextmanager)
