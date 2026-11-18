# Reproduza, teste e entregue o projeto

Uma colega precisa sair de uma pasta limpa e obter os mesmos resultados. Abra o caderno e rode desde a preparação ou extraia o kit em pasta nova. Documente a versão, a origem sintética, a ordem de execução e os nomes dos arquivos de saída. Prefira parâmetros explícitos e confirme com testes. No navegador, baixe o caderno editável e a pasta de resultados arquivo por arquivo. No terminal, reúna os arquivos em sua pasta de projeto.

Prove três propriedades. Reordenar as linhas brutas preserva o resultado. Mudar somente o km ou o alvo do teste preserva os parâmetros do treino. Trocar as datas de V06 e V07 muda a partição e os valores aprendidos. Um ID conflitante deve produzir erro com a chave. Consulte as instruções da solução em LEIA-ME-PROJETO.md.

### Rubrica (100 pontos)

Avalie cinco itens com 0, 10 ou 20 pontos. Use 0 para ausente ou contraditório, 10 para parcial e 20 para evidência completa.

1. Contagens e decisões auditáveis, com IDs e unidades.
2. Partições cronológicas e atributos disponíveis antes da partida.
3. Imputação e escala ajustadas no treino, parâmetros persistidos e saídas conferidas.
4. Referência, MAE, gráfico, tabela e limites explicados.
5. Reprodução limpa e testes dos casos de borda.

Meta para seguir a machine learning: 80 pontos, com 20 nos itens 2 e 3.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projeto/reproduzir.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projeto/reproduzir-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projeto.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Execute o projeto do início com os dados originais e registre o resultado.

**Bash**

```bash
cd aulas/reproduzir/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/reproduzir/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from pathlib import Path
from executar_projeto import executar, mostrar

pasta = Path.cwd()
resultados = executar(pasta/"dados/viagens.csv", pasta/"dados/estacoes.csv", pasta/"saida")
mostrar(*resultados)
```

Saída esperada

```text
Auditoria: 12 brutas, 10 válidas.
Mediana de km no treino: 4.0
treino (6, 2) (6,) ['V01', 'V02', 'V03', 'V04', 'V05', 'V06']
validacao (2, 2) (2,) ['V07', 'V08']
teste (2, 2) (2,) ['V09', 'V10']
MAE de validação: 3.5 min
MAE de teste: 10.0 min
```

O terminal pode rodar executar_projeto.py na solução, conforme o guia do kit. O caderno reproduz as mesmas etapas e a figura. Confira os arquivos em saida.

## E2 · Altere ou depure

Adicione uma linha com V01 divergente a uma cópia da tabela e confira o diagnóstico.

**Bash**

```bash
cd aulas/reproduzir/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/reproduzir/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from pathlib import Path
from auditoria_viagens import auditar, ler_estacoes, ler_viagens

brutas = ler_viagens(Path("dados/viagens.csv"))
estacoes = ler_estacoes(Path("dados/estacoes.csv"))
validas, auditoria = auditar(brutas, estacoes)

import pandas as pd
mudada = brutas.loc[brutas["id"].eq("V01")].assign(km_planejados=99.0)
try:
    auditar(pd.concat([brutas, mudada], ignore_index=True), estacoes)
except ValueError as erro:
    print(erro)
else:
    raise AssertionError("o conflito deveria interromper a auditoria")
```

Saída esperada

```text
ID em conflito: V01
```

Não tente adivinhar qual registro representa a viagem. A chamada original produz suas saídas em uma pasta independente.

## E3 · Resolva

Execute os testes, troque as datas de V06 e V07 em uma cópia e explique como X, y e os parâmetros irão chegar a um futuro modelo.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/reproduzir/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/reproduzir/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from pathlib import Path
from executar_projeto import executar, mostrar

pasta = Path.cwd()
resultados = executar(pasta/"dados/viagens.csv", pasta/"dados/estacoes.csv", pasta/"saida")
# Use os testes do projeto e registre as variações com uma cópia dos dados.
```

Saída esperada

```text
7 testes do projeto passaram
Auditoria: 12 brutas, 10 válidas.
Mediana de km no treino: 4.0
treino (6, 2) (6,) ['V01', 'V02', 'V03', 'V04', 'V05', 'V06']
validacao (2, 2) (2,) ['V07', 'V08']
teste (2, 2) (2,) ['V09', 'V10']
MAE de validação: 3.5 min
MAE de teste: 10.0 min
```

<details>
<summary>Ver uma pista</summary>

Rode primeiro sem alterações. Use uma cópia para as variações e guarde os JSONs de parâmetros para comparar.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path
from executar_projeto import executar, mostrar

pasta = Path.cwd()
resultados = executar(pasta/"dados/viagens.csv", pasta/"dados/estacoes.csv", pasta/"saida")

from io import StringIO
import unittest
from testes_projeto import ProjetoTest

suite = unittest.defaultTestLoader.loadTestsFromTestCase(ProjetoTest)
teste = unittest.TextTestRunner(stream=StringIO()).run(suite)
if not teste.wasSuccessful():
    for _, falha in teste.failures + teste.errors:
        print(falha)
    raise AssertionError("algum controle falhou")
print(teste.testsRun, "testes do projeto passaram")
mostrar(*resultados)
```

Saída esperada

```text
7 testes do projeto passaram
Auditoria: 12 brutas, 10 válidas.
Mediana de km no treino: 4.0
treino (6, 2) (6,) ['V01', 'V02', 'V03', 'V04', 'V05', 'V06']
validacao (2, 2) (2,) ['V07', 'V08']
teste (2, 2) (2,) ['V09', 'V10']
MAE de validação: 3.5 min
MAE de teste: 10.0 min
```

Com as datas trocadas, V07 passa a encerrar o treino e V06 entra na validação. O máximo aprendido passa a 100 e a mediana de y passa a 9. Use IDs para verificar alinhamento, X para entrada e y para alvo. Mantenha os parâmetros com a entrega para reproduzir o tratamento em novas viagens.

No ZIP, a solução está em `aulas/reproduzir/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/prova)

## Fontes

- [Evitar vazamento de dados](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
- [Métricas de regressão](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics)
- [Executar testes](https://docs.python.org/pt-br/3.14/library/unittest.html)
