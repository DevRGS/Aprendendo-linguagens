# Pipeline de arquivos

Encadeie CSV, cálculo e gravação JSON. Preveja o que acontece ao repetir a operação com a mesma entrada. Retome [CSV](#/python/arquivos/csv), [JSON](#/python/arquivos/json) e [imports](#/python/projetos/modulos-e-imports).

Num pipeline a saída de uma etapa alimenta a próxima. A leitura recebe um caminho e devolve uma lista de inteiros. O cálculo recebe a lista e devolve um dicionário. A gravação recebe o resultado e um caminho de saída. Configure origens e destinos por argumentos. Use modo `w` para gerar um único relatório da entrada a cada execução.

No caderno, use os auxiliares da preparação. Reinicie o kernel para reler um auxiliar já importado que tenha editado. No terminal, execute a partir da pasta do exercício para que os caminhos curtos apontem aos dados. Depois de comparar duas execuções, considere o que deve conter um resumo sem registros. Em seguida, veja [instâncias](#/python/objetos/instancias).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projetos/pipeline-de-arquivos.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projetos/pipeline-de-arquivos-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Encadeie as duas funções auxiliares para ler `sessoes.csv` com 3 e 7 minutos. Grave `resumo.json` e mostre o total.

**Bash**

```bash
cd aulas/pipeline-de-arquivos/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/pipeline-de-arquivos/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import json
from pathlib import Path
from ler_sessoes import ler_minutos
from resumir_sessoes import resumir

def executar(origem, destino):
    minutos = ler_minutos(origem)
    resultado = resumir(minutos)
    with destino.open("w", encoding="utf-8") as arquivo:
        json.dump(resultado, arquivo)
    return resultado

resultado = executar(Path("sessoes.csv"), Path("resumo.json"))
print(resultado["total"])
```

Saída esperada

```text
10
```

Ler converte as durações. Resumir calcula o total e executar grava o resultado. Abra resumo.json para ver os dois campos.

## E2 · Altere ou depure

Execute duas vezes com a mesma entrada e o mesmo destino. Compare os objetos lidos depois de cada execução. Preveja a contagem do segundo.

**Bash**

```bash
cd aulas/pipeline-de-arquivos/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/pipeline-de-arquivos/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
import json
from pathlib import Path
from ler_sessoes import ler_minutos
from resumir_sessoes import resumir

def executar(origem, destino):
    minutos = ler_minutos(origem)
    resultado = resumir(minutos)
    with destino.open("w", encoding="utf-8") as arquivo:
        json.dump(resultado, arquivo)
    return resultado

origem = Path("sessoes.csv")
destino = Path("resumo.json")
executar(origem, destino)
primeiro = json.loads(destino.read_text(encoding="utf-8"))
executar(origem, destino)
segundo = json.loads(destino.read_text(encoding="utf-8"))
print(primeiro == segundo)
print(segundo["quantidade"])
```

Saída esperada

```text
True
2
```

w substitui o arquivo. Cada chamada recalcula a lista e as contagens a partir do CSV. Dois carregamentos com os mesmos pares são iguais.

## E3 · Resolva

Entregue dois auxiliares e o programa principal. Na pasta nova da atividade, coloque `sessoes.csv` junto dos três arquivos. Execute o principal a partir dessa pasta, releia `resumo.json` e confira total 10 e quantidade 2. Teste um CSV só com cabeçalho, que deve resultar em total e quantidade zero.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/pipeline-de-arquivos/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/pipeline-de-arquivos/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from pathlib import Path
from ler_sessoes import ler_minutos
from resumir_sessoes import resumir

origem = Path("sessoes.csv")
destino = Path("resumo.json")
# Leia, resuma e grave o destino.
```

Saída esperada

```text
10 2
0 0
```

<details>
<summary>Ver uma pista</summary>

Use o dicionário devolvido pelo resumo como entrada de json.dump.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import json
from pathlib import Path
from ler_sessoes import ler_minutos
from resumir_sessoes import resumir

def executar(origem, destino):
    minutos = ler_minutos(origem)
    resultado = resumir(minutos)
    with destino.open("w", encoding="utf-8") as arquivo:
        json.dump(resultado, arquivo)
    return resultado

executar(Path("sessoes.csv"), Path("resumo.json"))
resumo = json.loads(Path("resumo.json").read_text(encoding="utf-8"))
print(resumo["total"], resumo["quantidade"])

vazio = executar(Path("sem_sessoes.csv"), Path("resumo_vazio.json"))
print(vazio["total"], vazio["quantidade"])
```

Saída esperada

```text
10 2
0 0
```

ler_sessoes.py converte os campos. resumir_sessoes.py calcula sem abrir arquivos, e o programa principal coordena a entrada e a saída. A célula faz o papel do principal no caderno.

No ZIP, a solução está em `aulas/pipeline-de-arquivos/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/objetos/instancias)

## Fontes

- [Leitura de CSV](https://docs.python.org/3.14/library/csv.html#csv.DictReader)
- [Gravar com json.dump](https://docs.python.org/3.14/library/json.html#json.dump)
- [Organizar código em módulos](https://docs.python.org/3.14/tutorial/modules.html)
