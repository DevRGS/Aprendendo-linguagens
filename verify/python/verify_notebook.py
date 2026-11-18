"""Executa células da fonte do curso no CPython em uma pasta de teste."""
from contextlib import redirect_stdout
from io import StringIO
import json
import sys

notebook = json.load(sys.stdin)
values = {"__name__": "__main__"}
outputs = []
for cell in notebook["cells"]:
    if cell["cell_type"] != "code" or cell["metadata"].get("imagem"):
        continue
    code = "".join(cell["source"])
    with redirect_stdout(StringIO()) as output:
        exec(compile(code, cell["id"], "exec"), values)
    if "etapa" in cell["metadata"]:
        outputs.append(output.getvalue())
print(json.dumps(outputs, ensure_ascii=False))
