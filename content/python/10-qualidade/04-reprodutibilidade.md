# Resultados reprodutíveis

Refaça um lote simulado com a mesma semente. Preveja o que muda se houver uma chamada adicional para gerar um número. Retome [ambiente](#/python/projetos/ambiente-e-pacotes), [JSON](#/python/arquivos/json) e [conjuntos](#/python/registros/conjuntos).

Defina uma ordem estável para entradas e saídas. `random.Random(semente)` cria um gerador pseudoaleatório local. Chamadas avançam seu estado, então anote a semente, o método e a sequência de operações. Registre a versão do ambiente, os parâmetros e a proveniência, ou seja, de onde vieram os dados e como foram preparados. Esses dados permitem investigar diferenças entre execuções.

O código usa entradas pequenas no caderno e no kit. Abra o JSON de E3 na pasta de resultados para conferir versões e contagens. O que precisa ser igual antes de comparar duas execuções? Depois, veja [vetores](#/python/matematica/vetores).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/qualidade/reprodutibilidade.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/qualidade/reprodutibilidade-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/qualidade.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Crie dois objetos Random com a mesma semente e faça três chamadas random em cada um. Compare as sequências.

**Bash**

```bash
cd aulas/reprodutibilidade/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/reprodutibilidade/e1
py exemplo.py
```

```python
from random import Random

a, b = Random(7), Random(7)
primeira = [a.random() for _ in range(3)]
segunda = [b.random() for _ in range(3)]
print(primeira == segunda, len(primeira))
```

Saída esperada

```text
True 3
```

Os estados iniciais e a sequência de chamadas coincidem, por isso os valores coincidem. Cada objeto mantém seu estado separado.

## E2 · Altere ou depure

Use a mesma semente nos dois geradores, mas faça uma chamada a mais no segundo antes de comparar. Verifique se seu próximo valor coincide com o segundo valor do primeiro gerador.

**Bash**

```bash
cd aulas/reprodutibilidade/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/reprodutibilidade/e2
py variacao.py
```

```python
from random import Random

a, b = Random(7), Random(7)
primeiro = a.random()
segundo = a.random()
b.random()
deslocado = b.random()
print(primeiro == deslocado)
print(segundo == deslocado)
```

Saída esperada

```text
False
True
```

A chamada extra consome o primeiro valor. Ela desloca o ponto da sequência, como mostra a comparação com o segundo.

## E3 · Resolva

Produza `auditoria.json` com IDs únicos ordenados, contagens, semente, versão Python e origem do lote. Para ["b", "a", "b"], faça dois resumos iguais e confirme contagens 3 e 2. Para [] espere 0 IDs e zero contagens.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/reprodutibilidade/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/reprodutibilidade/e3
py exercicio.py
```

```python
import json
import sys
from pathlib import Path

entrada = ["b", "a", "b"]
semente = 7
# Registre parâmetros e proveniência, grave e releia o resumo.
```

Saída esperada

```text
['a', 'b'] 3 2
True
[] 0 0
```

<details>
<summary>Ver uma pista</summary>

Use `sorted(set(ids))` e registre o tamanho antes e depois de retirar duplicatas.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import json
import sys
from pathlib import Path

def resumir(ids, semente):
    unicos = sorted(set(ids))
    return {
        "ids": unicos,
        "quantidade": len(ids),
        "unicos": len(unicos),
        "semente": semente,
        "python": ".".join(map(str, sys.version_info[:3])),
        "origem": "lote fictício da atividade",
    }

entrada = ["b", "a", "b"]
primeiro = resumir(entrada, 7)
caminho = Path("auditoria.json")
caminho.write_text(json.dumps(primeiro, ensure_ascii=False, sort_keys=True),
                   encoding="utf-8")
recuperado = json.loads(caminho.read_text(encoding="utf-8"))
print(recuperado["ids"], recuperado["quantidade"], recuperado["unicos"])
print(recuperado == resumir(entrada, 7))
vazio = resumir([], 7)
print(vazio["ids"], vazio["quantidade"], vazio["unicos"])
```

Saída esperada

```text
['a', 'b'] 3 2
True
[] 0 0
```

Ordenar estabiliza a saída do conjunto. sort_keys organiza o JSON por chave. O resumo guarda a semente como parâmetro de uma eventual simulação. Nenhum sorteio é feito nesta auditoria. A entrada vazia continua reproduzível, com ambas as contagens em zero.

No ZIP, a solução está em `aulas/reprodutibilidade/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/matematica/vetores)

## Fontes

- [Gerador local e reprodutibilidade de números](https://docs.python.org/3.14/library/random.html#notes-on-reproducibility)
- [Informações do intérprete](https://docs.python.org/3.14/library/sys.html#sys.version_info)
