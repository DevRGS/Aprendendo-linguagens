# Ponto de entrada e argumentos

Faça um relatório das primeiras tarefas até um limite. Preveja a quantidade para `--limite 2`. Retome [funções](#/python/funcoes/parametros-e-retorno) e [imports](#/python/projetos/modulos-e-imports).

`main(args)` coordena a execução. O módulo auxiliar define main. Já o ponto de entrada protege a chamada com `if __name__ == "__main__":`. `argparse.ArgumentParser` descreve opções com tipo e valor padrão. Passar uma lista explícita a `parse_args` evita ler os argumentos do kernel. Sem lista, o parser lê os argumentos do processo.

No terminal, use o arquivo `relatorio_cli.py` de cada exercício. No caderno, passe listas explícitas. Em E3, `runpy` executa o ponto de entrada como script para comparar a saída. A atividade restaura os argumentos da sessão em seguida. O que deve acontecer se a opção for omitida? Veja [pipeline](#/python/projetos/pipeline-de-arquivos) depois.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projetos/entrada-do-programa.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projetos/entrada-do-programa-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Receba limite 5 pela lista explícita. No terminal da pasta E1, compare com `python3 relatorio_cli.py --limite 5` em Bash ou `py relatorio_cli.py --limite 5` em PowerShell.

**Bash**

```bash
cd aulas/entrada-do-programa/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/entrada-do-programa/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from entrada_limite import main

main(["--limite", "5"])
```

Saída esperada

```text
limite: 5
```

O parser converte o argumento textual em inteiro. A opção omitida usa o padrão 3.

## E2 · Altere ou depure

Compare análise válida, pedido de ajuda e opção não numérica. A ajuda e o erro encerrariam o processo e são capturados aqui. Determine qual usa a saída de diagnóstico.

**Bash**

```bash
cd aulas/entrada-do-programa/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/entrada-do-programa/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from argparse import ArgumentParser
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

parser = ArgumentParser(prog="relatorio")
parser.add_argument("--limite", type=int, default=3)
print(parser.parse_args(["--limite", "5"]).limite)

for rotulo, args in [("ajuda", ["--help"]), ("erro", ["--limite", "dois"])]:
    saida, diagnostico = StringIO(), StringIO()
    with redirect_stdout(saida), redirect_stderr(diagnostico):
        try:
            parser.parse_args(args)
        except SystemExit as fim:
            codigo = fim.code
    print(rotulo, codigo, bool(saida.getvalue()), bool(diagnostico.getvalue()))
```

Saída esperada

```text
5
ajuda 0 True False
erro 2 False True
```

A ajuda vai à saída padrão e termina com código 0. A opção inválida usa a saída de diagnóstico e código 2. Para inspecionar o texto real, imprima o conteúdo de saida e diagnostico dentro do laço após a captura.

## E3 · Resolva

Faça `main(["--limite", "2"])` e a chamada `relatorio_cli.py --limite 2` emitirem o mesmo relatório com duas tarefas. Use 3 como padrão e 0 como seleção vazia. Na pasta E3, experimente `python3 relatorio_cli.py --limite 2` em Bash ou `py relatorio_cli.py --limite 2` em PowerShell.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/entrada-do-programa/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/entrada-do-programa/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
# Em entrada_relatorio.py, implemente main com ArgumentParser.
# Em relatorio_cli.py, importe main e proteja sua chamada.
from entrada_relatorio import main

main(["--limite", "2"])
```

Saída esperada

```text
tarefas=2
ler, revisar
mesmo relatório: True
tarefas=0
```

<details>
<summary>Ver uma pista</summary>

Use fatiamento. No arquivo de entrada, chame `main()` dentro da guarda de `__name__`.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import runpy
import sys
from contextlib import redirect_stdout
from io import StringIO
from entrada_relatorio import main

no_caderno = StringIO()
with redirect_stdout(no_caderno):
    main(["--limite", "2"])

na_cli = StringIO()
argumentos_anteriores = sys.argv
try:
    sys.argv = ["relatorio_cli.py", "--limite", "2"]
    with redirect_stdout(na_cli):
        runpy.run_path("relatorio_cli.py", run_name="__main__")
finally:
    sys.argv = argumentos_anteriores

print(no_caderno.getvalue(), end="")
print("mesmo relatório:", no_caderno.getvalue() == na_cli.getvalue())
main(["--limite", "0"])
```

Saída esperada

```text
tarefas=2
ler, revisar
mesmo relatório: True
tarefas=0
```

main recebe a lista do caderno. O ponto de entrada chama main sem lista e o parser usa sys.argv. Zero seleciona uma fatia vazia. Valores negativos são rejeitados para que não sejam tratados como índices de fim negativos.

No ZIP, a solução está em `aulas/entrada-do-programa/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projetos/pipeline-de-arquivos)

## Fontes

- [Módulos como scripts](https://docs.python.org/3.14/tutorial/modules.html#executing-modules-as-scripts)
- [Argumentos, tipos e padrões](https://docs.python.org/3.14/library/argparse.html#quick-links-for-add-argument)
- [Executar um arquivo com runpy](https://docs.python.org/3.14/library/runpy.html#runpy.run_path)
