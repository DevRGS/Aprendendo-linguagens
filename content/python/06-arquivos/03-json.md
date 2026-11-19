# Gravar e carregar JSON

Você vai guardar um campo sem valor. Preveja como ele aparece no arquivo. Retome [dicionários](#/python/registros/dicionarios) e [UTF-8](#/python/arquivos/caminhos-e-texto).

JSON é texto. Para os dados desta aula, dicionários correspondem a objetos JSON, listas a arrays, e `None` a `null`. `json.dump(dados, arquivo)` grava o texto e `json.load(arquivo)` interpreta o texto como um objeto Python. `dumps` e `loads` fazem esse percurso com uma string.

Abra os arquivos com UTF-8 no caderno e no terminal. `ensure_ascii=False` deixa os acentos legíveis no texto gravado. Um campo presente com valor nulo pode exigir um tratamento diferente de uma chave ausente. Qual teste distinguiria os dois? Depois veja [exceções](#/python/arquivos/excecoes).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/arquivos/json.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/arquivos/json-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/arquivos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Grave um dicionário com uma lista de temas e um campo fim igual a None. Leia o texto e compare o objeto carregado ao original.

**Bash**

```bash
cd aulas/json/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/json/e1
py exemplo.py
```

```python
import json
from pathlib import Path

original = {"temas": ["ação", "dados"], "fim": None}
caminho = Path("temas.json")
with caminho.open("w", encoding="utf-8") as arquivo:
    json.dump(original, arquivo, ensure_ascii=False)
print(caminho.read_text(encoding="utf-8"))

with caminho.open(encoding="utf-8") as arquivo:
    recuperado = json.load(arquivo)
print(recuperado == original)
```

Saída esperada

```text
{"temas": ["ação", "dados"], "fim": null}
True
```

O texto contém null. A leitura recupera None no dicionário e o conteúdo original da lista.

## E2 · Altere ou depure

Compare o texto `{"fim": null}` e o objeto carregado. Investigue a ausência de `inicio` e a presença de `fim` com valor nulo.

**Bash**

```bash
cd aulas/json/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/json/e2
py variacao.py
```

```python
import json

texto = '{"fim": null}'
registro = json.loads(texto)
print(type(texto).__name__, type(registro).__name__)
print("inicio" in registro)
print("fim" in registro, registro["fim"] is None)
```

Saída esperada

```text
str dict
False
True True
```

in verifica a presença da chave. Usar só get sem um valor padrão distinto daria None nos dois casos.

## E3 · Resolva

Grave `resumo.json` para `[3, 7]` com campos total e quantidade. Releia, mostre `10 2` e confira igualdade com as chaves em ordem inversa. Lista vazia deve resultar em `0 0`.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/json/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/json/e3
py exercicio.py
```

```python
import json
from pathlib import Path

minutos = [3, 7]
caminho = Path("resumo.json")
# Calcule, grave, releia e compare o conteúdo.
```

Saída esperada

```text
10 2
True
0 0
```

<details>
<summary>Ver uma pista</summary>

Use `sum(minutos)` e `len(minutos)`. Compare o objeto lido com outro dicionário.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import json
from pathlib import Path

def resumir(minutos):
    return {"total": sum(minutos), "quantidade": len(minutos)}

caminho = Path("resumo.json")
with caminho.open("w", encoding="utf-8") as arquivo:
    json.dump(resumir([3, 7]), arquivo)
with caminho.open(encoding="utf-8") as arquivo:
    resumo = json.load(arquivo)
print(resumo["total"], resumo["quantidade"])
print(resumo == {"quantidade": 2, "total": 10})
vazio = resumir([])
print(vazio["total"], vazio["quantidade"])
```

Saída esperada

```text
10 2
True
0 0
```

Leia cada campo por nome. A igualdade de dicionários confere os pares independentemente da ordem. A lista vazia tem soma e quantidade iguais a zero.

No ZIP, a solução está em `aulas/json/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/arquivos/excecoes)

## Fontes

- [Serialização com json](https://docs.python.org/3.14/library/json.html#basic-usage)
