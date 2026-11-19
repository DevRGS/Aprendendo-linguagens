# Registros com dataclasses

Modele dois registros com ID e valor. Preveja como a igualdade funciona se os campos são iguais e os objetos foram criados separadamente. Retome [instâncias](#/python/objetos/instancias) e [leitura de CSV](#/python/arquivos/csv).

Os campos anotados de uma classe decorada com `@dataclass` definem parâmetros do inicializador gerado. Com as opções padrão, a igualdade de instâncias da mesma classe compara seus campos. Anotações descrevem os tipos, e a validação dos dados vindos de fora ainda deve ser escrita. `field(default_factory=list)` chama `list()` para cada instância criada sem valor para aquele campo.

A entrada E3 está na pasta do exercício no kit e é criada na preparação do caderno. Qual consequência tem converter um ID com zeros à esquerda? Depois, veja [composição](#/python/objetos/composicao-e-polimorfismo).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/objetos/dataclasses.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/objetos/dataclasses-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/objetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Defina Medida(id, valor) e crie dois registros iguais. Compare igualdade por conteúdo e identidade.

**Bash**

```bash
cd aulas/dataclasses/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/dataclasses/e1
py exemplo.py
```

```python
from dataclasses import dataclass

@dataclass
class Medida:
    id: str
    valor: float

a = Medida("007", 3.5)
b = Medida("007", 3.5)
print(a == b, a is b)
```

Saída esperada

```text
True False
```

Os dois objetos têm os mesmos campos, então são iguais pelo __eq__ gerado. Cada construção cria sua própria instância.

## E2 · Altere ou depure

Guarde uma lista de marcas em cada medição. Adicione uma marca só à primeira e preveja a segunda lista.

**Bash**

```bash
cd aulas/dataclasses/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/dataclasses/e2
py variacao.py
```

```python
from dataclasses import dataclass, field

@dataclass
class Medicao:
    id: str
    marcas: list[str] = field(default_factory=list)

a = Medicao("a")
b = Medicao("b")
a.marcas.append("revista")
print(a.marcas, b.marcas)
```

Saída esperada

```text
['revista'] []
```

A fábrica executa list() para cada valor padrão. Modificar a primeira lista não altera a segunda.

## E3 · Resolva

Leia `medicoes.csv` e converta seus dois registros em Medida. Mantenha ID textual e aceite apenas valores numéricos finitos. Mostre cada ID e valor. Pela mesma função, teste e capture `ValueError` para uma linha com valor inválido.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/dataclasses/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/dataclasses/e3
py exercicio.py
```

```python
import csv
from dataclasses import dataclass
from math import isfinite
from pathlib import Path

@dataclass
class Medida:
    id: str
    valor: float

def converter(linha):
    # Converta e valide valor, preserve id e crie a Medida.
    raise NotImplementedError

with Path("medicoes.csv").open(encoding="utf-8", newline="") as arquivo:
    medidas = [converter(linha) for linha in csv.DictReader(arquivo)]
print(medidas)
```

Saída esperada

```text
001 3.5
002 0.0
rejeitado: valor deve ser finito
```

<details>
<summary>Ver uma pista</summary>

Converta só `valor`. Depois confirme se o número é finito.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import csv
from dataclasses import dataclass
from math import isfinite
from pathlib import Path

@dataclass
class Medida:
    id: str
    valor: float

def converter(linha):
    valor = float(linha["valor"])
    if not isfinite(valor):
        raise ValueError("valor deve ser finito")
    return Medida(linha["id"], valor)

with Path("medicoes.csv").open(encoding="utf-8", newline="") as arquivo:
    medidas = [converter(linha) for linha in csv.DictReader(arquivo)]
for medida in medidas:
    print(medida.id, medida.valor)

try:
    converter({"id": "003", "valor": "NaN"})
except ValueError as erro:
    print(f"rejeitado: {erro}")
```

Saída esperada

```text
001 3.5
002 0.0
rejeitado: valor deve ser finito
```

O CSV fornece campos de texto. float converte valor e rejeita texto não numérico. isfinite rejeita NaN e infinitos, que float aceita. Zero é válido e o ID conserva os zeros iniciais.

No ZIP, a solução está em `aulas/dataclasses/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/objetos/composicao-e-polimorfismo)

## Fontes

- [Campos, igualdade e fábrica de valores](https://docs.python.org/3.14/library/dataclasses.html)
- [Números de ponto flutuante finitos](https://docs.python.org/3.14/library/math.html#math.isfinite)
