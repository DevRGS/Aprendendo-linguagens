# Ambiente e versões de pacotes

Descubra qual Python executa a atividade e se a versão do NumPy importado coincide com a registrada na instalação. Retome [imports](#/python/projetos/modulos-e-imports).

Um intérprete executa o código. `sys.executable` indica o caminho quando disponível, e `sys.version` informa versão e detalhes da compilação. Um ambiente virtual tem o intérprete do ambiente e um conjunto isolado de pacotes. Use esse mesmo intérprete com `-m pip` para selecionar o instalador do ambiente. Registre dependências e versões para outra pessoa reconstruir a sessão.

**Terminal**. A partir da raiz do kit, em PowerShell no Windows:

```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip --version
```

Em Bash no Linux ou macOS:

```bash
python3.14 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m pip --version
```

Rode os exemplos com o Python da `.venv`. Se só houver `python` ou `python3`, confira `--version` antes de criar o ambiente. Se `venv` faltar no Linux, consulte a instalação desse componente Python na documentação da distribuição. Se o pacote faltar, confira o intérprete e a pasta do kit.

**Caderno**. Abra a atividade com o kernel Python com NumPy indicado na preparação e confira a versão pela célula. Os comandos anteriores são do terminal. Se outro ambiente mostrar uma versão diferente, quais valores você compararia? Siga para [argumentos](#/python/projetos/entrada-do-programa).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projetos/ambiente-e-pacotes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projetos/ambiente-e-pacotes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Localize `sys.executable` e `sys.version`. Depois da primeira execução, mostre os valores completos como indicado abaixo e anote-os. No terminal, repita pelo Python da .venv.

**Bash**

```bash
cd aulas/ambiente-e-pacotes/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/ambiente-e-pacotes/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import sys

executavel = sys.executable
versao = sys.version
print("versão identificada:", bool(versao))
print("versão começa com o número principal:", versao.startswith(str(sys.version_info.major)))
```

Saída esperada

```text
versão identificada: True
versão começa com o número principal: True
```

Acrescente print(executavel) e print(versao) para ver os valores concretos. O caminho muda por sessão e pode vir vazio em alguns ambientes. A versão continua identificável.

## E2 · Altere ou depure

No ambiente preparado, compare `numpy.__version__` e `importlib.metadata.version("numpy")`. Qual delas vem da distribuição instalada?

**Bash**

```bash
cd aulas/ambiente-e-pacotes/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/ambiente-e-pacotes/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from importlib.metadata import version
import numpy

importada = numpy.__version__
instalada = version("numpy")
print("versões coincidem:", importada == instalada)
```

Saída esperada

```text
versões coincidem: True
```

A primeira vem do módulo importado. A segunda vem dos metadados da distribuição. Acrescente print(importada, instalada) para ver os números. Se divergirem, confira numpy.__file__, o executável e a instalação selecionada.

## E3 · Resolva

Grave `ambiente.json` com versões do Python e do NumPy e um procedimento para reproduzir a sessão. Identifique o percurso usado. Se o caminho do executável for vazio, registre isso explicitamente.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/ambiente-e-pacotes/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/ambiente-e-pacotes/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
import json
import sys
from importlib.metadata import version
from pathlib import Path

caminho = Path("ambiente.json")
# Registre as versões, salve a ficha e releia-a.
```

Saída esperada

```text
versões registradas: True
instruções registradas: True
caminho ausente: não informado pelo ambiente
```

<details>
<summary>Ver uma pista</summary>

Escreva um dicionário de versões e instruções com json. Teste caminho vazio.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import json
import sys
from importlib.metadata import version
from pathlib import Path

def ficha(executavel):
    return {
        "python": ".".join(map(str, sys.version_info[:3])),
        "numpy": version("numpy"),
        "executavel": executavel or "não informado pelo ambiente",
        "terminal": "Criar a .venv, instalar requirements.txt e rodar pelo Python da .venv",
        "caderno": "Abrir no kernel Python com NumPy, preparar e executar as células",
    }

caminho = Path("ambiente.json")
caminho.write_text(json.dumps(ficha(sys.executable), ensure_ascii=False, indent=2),
                   encoding="utf-8")
registro = json.loads(caminho.read_text(encoding="utf-8"))
print("versões registradas:", bool(registro["python"] and registro["numpy"]))
print("instruções registradas:", bool(registro["terminal"] and registro["caderno"]))
print("caminho ausente:", ficha("")["executavel"])
```

Saída esperada

```text
versões registradas: True
instruções registradas: True
caminho ausente: não informado pelo ambiente
```

A ficha de referência registra como repetir nos dois percursos. Abra ambiente.json e acrescente o sistema e a origem do kit ou o kernel que usou. A ficha continua legível quando sys.executable está vazio.

No ZIP, a solução está em `aulas/ambiente-e-pacotes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projetos/entrada-do-programa)

## Fontes

- [Ambientes virtuais e pip na PyPA](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)
- [venv](https://docs.python.org/3.14/library/venv.html)
- [Metadados de versões](https://docs.python.org/3.14/library/importlib.metadata.html#distribution-versions)
- [Diagnóstico de versão no NumPy](https://numpy.org/doc/stable/user/troubleshooting-importerror.html)
