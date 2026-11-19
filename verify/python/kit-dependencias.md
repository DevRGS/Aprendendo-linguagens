
## Instale as bibliotecas na raiz extraída

Bash

```bash
python3.14 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m unittest discover -s testes
```

Se `python3 --version` já mostrar Python 3.14, você pode usar `python3 -m venv .venv`.
Se sua distribuição não fornecer `venv`, instale o componente da mesma versão
pelo gerenciador de pacotes da distribuição ou consulte o guia de instalação do Python.

PowerShell

```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m unittest discover -s testes
```

Se `python --version` mostrar Python 3.14 e `py` não estiver disponível,
use `python -m venv .venv`. Use o executável dentro de `.venv` para rodar suas atividades.

As pastas das quatro aulas são
