# Separe períodos e prepare as matrizes

Retome o [ajuste em treino](#/python/preparacao-ml/ajustar-e-aplicar). Use a versão auditada do marco anterior, fornecida nos arquivos da atividade. Ordene por data e ID. Datas até 6 de janeiro de 2026 são treino, até 8 de janeiro são validação, e as demais são teste. A coluna minutos_faturados é posterior à chegada. Identifique o vazamento antes de construir X.

A mediana dos km observados apenas no treino é 4. Distâncias ausentes recebem 4. Os extremos após preenchimento são 2 e 8. Subtraia 2 e divida por 6, sem recortar. V07 contém 100 km e pode ter resultado acima de 1. Se a amplitude do treino for zero, a coluna escalada toda vale zero. Se não houver km observados no treino, interrompa com mensagem. Mantenha paradas na escala original. Conserve os IDs e as datas para rastrear as linhas.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projeto/preparar.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projeto/preparar-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projeto.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Construa partições cronológicas e confira as chaves em cada conjunto.

**Bash**

```bash
cd aulas/preparar/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/preparar/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from preparacao_viagens import ajustar, aplicar, exportar, extrair, particionar
partes = particionar(validas)
parametros = ajustar(partes["treino"])

for nome, parte in partes.items():
    print(nome, parte["id"].tolist())
ids = [set(p["id"]) for p in partes.values()]
assert all(not a & b for i, a in enumerate(ids) for b in ids[i+1:])
```

Saída esperada

```text
treino ['V01', 'V02', 'V03', 'V04', 'V05', 'V06']
validacao ['V07', 'V08']
teste ['V09', 'V10']
```

Os limites de cada etapa são inclusivos no lado final, com os conjuntos disjuntos. Os IDs servem para conferir a separação, e a data determina a ordem.

## E2 · Altere ou depure

Em treino apenas, copie faturamento como se fosse uma previsão. Meça o erro e explique por que não usar a coluna.

**Bash**

```bash
cd aulas/preparar/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/preparar/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from preparacao_viagens import ajustar, aplicar, exportar, extrair, particionar
partes = particionar(validas)
parametros = ajustar(partes["treino"])

treino = partes["treino"]
erro = (treino["minutos_faturados"] - treino["minutos_reais"]).abs().mean()
print(f"{erro:.1f} min")
print(parametros["atributos"])
```

Saída esperada

```text
0.0 min
['km_escalados', 'paradas_planejadas']
```

Faturamento coincide com duração real nestes dados. O resultado usa informação posterior, indisponível antes da partida.

## E3 · Resolva

Exporte as três partições e parametros.json. Confira formas, ordem das colunas e os controles de V01, V03, V07, V08, V09 e V10.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/preparar/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/preparar/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)
# Escreva as funções de particionar, ajustar e transformar.
```

Saída esperada

```text
treino (6, 2) (6,)
validacao (2, 2) (2,)
teste (2, 2) (2,)
controles conferidos
```

<details>
<summary>Ver uma pista</summary>

Ajuste uma única vez com partes['treino']; itere as partições com os mesmos parâmetros.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

from preparacao_viagens import ajustar, aplicar, exportar, extrair, particionar
partes = particionar(validas)
parametros = ajustar(partes["treino"])

from math import isclose
from auditoria_viagens import salvar_json
pasta = Path("saida")
pasta.mkdir(exist_ok=True)
salvar_json(pasta/"parametros.json", parametros)
tabelas = exportar(partes, parametros, pasta)
for nome, tabela in tabelas.items():
    X, y, ids = extrair(tabela)
    print(nome, X.shape, y.shape)
valores = {"V01":(0,0), "V03":(1/3,1), "V07":(98/6,1), "V08":(1/3,0), "V09":(.5,2), "V10":(7/6,3)}
for t in tabelas.values():
    for chave, km, paradas in t[["id","km_escalados","paradas_planejadas"]].itertuples(index=False):
        if chave in valores:
            a, b = valores[chave]
            assert isclose(km, a, rel_tol=0, abs_tol=1e-6) and paradas == b
print("controles conferidos")
```

Saída esperada

```text
treino (6, 2) (6,)
validacao (2, 2) (2,)
teste (2, 2) (2,)
controles conferidos
```

Os shapes preservam a contagem de viagens. As duas colunas de X têm ordem fixa. V07 e V10 ficam acima de 1, pois excedem o máximo do treino. V08 usa o preenchimento aprendido no treino e preserva zero paradas. Verifique um treino constante para testar a regra da amplitude.

No ZIP, a solução está em `aulas/preparar/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projeto/interpretar)

## Fontes

- [Evitar vazamento de dados](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
- [Métricas de regressão](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics)
