"""Cria o ZIP e o caderno a partir dos arquivos usados nas aulas."""
import json
from pathlib import Path
import re
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

KIT = Path(__file__).resolve().parent
TRILHA = KIT.parents[1] / "content" / "machine-learning"
ARQUIVOS = ["README.md", "requirements.txt", "laboratorio.py", "dados/viagens.csv", "dados/serie.csv",
            "inicial/projeto.py", "solucao/projeto.py", "test_projeto.py"]


def celula(tipo, texto, chave):
    base = {"cell_type": tipo, "id": chave, "metadata": {}, "source": texto.splitlines(keepends=True)}
    if tipo == "code":
        base.update(outputs=[], execution_count=None)
    return base


def caderno():
    arquivos = {nome: (KIT / nome).read_text(encoding="utf-8") for nome in ARQUIVOS if nome.endswith((".py", ".csv"))}
    preparo = '''from pathlib import Path
import sys
if sys.platform == "emscripten":
    import micropip
    await micropip.install(["scikit-learn", "matplotlib"])
arquivos = ''' + repr(arquivos) + '''
for nome, texto in arquivos.items():
    destino = Path(nome)
    if destino.exists() and destino.read_text(encoding="utf-8") != texto:
        raise FileExistsError(f"Use uma pasta nova para preservar {nome}")
    destino.parent.mkdir(exist_ok=True, parents=True)
    destino.write_text(texto, encoding="utf-8")
print("Laboratório preparado.")
'''
    cells = [celula("markdown", "# Previsão de viagens\n\n## Preparar os dados\nEm uma pasta nova, execute a célula abaixo. Depois procure o título de sua aula. Tente resolver cada atividade antes de executar sua solução.", "introducao"),
             celula("code", preparo, "preparo")]
    language = json.loads((TRILHA / "language.json").read_text(encoding="utf-8"))
    for modulo in language["modules"]:
        for aula in modulo["lessons"]:
            markdown = (TRILHA / modulo["dir"] / aula["file"]).read_text(encoding="utf-8")
            cabecalho, *etapas = markdown.split("\n## ")
            ident = modulo["id"] + "-" + aula["id"]
            cells.append(celula("markdown", cabecalho.split("[Baixar laboratório")[0].strip(), ident))
            for i, etapa in enumerate(etapas):
                titulo, resto = etapa.split("\n", 1)
                pergunta, codigo, resposta = re.split(r'<details>.*?\n\n```python\n|\n```\n', resto, maxsplit=2)
                cells.extend([celula("markdown", f"### {titulo}\n\n{pergunta.strip()}", f"{ident}-{i}-t"),
                              celula("code", codigo, f"{ident}-{i}"),
                              celula("markdown", resposta.split("</details>")[0].strip(), f"{ident}-{i}-r")])
    return {"nbformat": 4, "nbformat_minor": 5, "metadata": {"kernelspec": {"name": "python", "display_name": "Python (Pyodide)", "language": "python"}}, "cells": cells}


if __name__ == "__main__":
    saida = TRILHA / "projetos"
    saida.mkdir(exist_ok=True)
    notebook = json.dumps(caderno(), indent=1, ensure_ascii=False) + "\n"
    (saida / "viagens.ipynb").write_bytes(notebook.encode())
    with ZipFile(saida / "projeto.zip", "w") as pacote:
        for nome in ARQUIVOS + ["viagens.ipynb"]:
            conteudo = notebook.encode() if nome.endswith(".ipynb") else (KIT / nome).read_bytes()
            pacote.writestr(ZipInfo(nome), conteudo, compress_type=ZIP_DEFLATED)
