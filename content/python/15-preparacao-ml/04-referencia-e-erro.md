# Previsão de referência e MAE

Sem usar atributos, que duração serviria como previsão inicial para comparar com um modelo futuro? Como medir quão longe ela ficou?

Retome [Ajustar no treino](#/python/preparacao-ml/ajustar-e-aplicar). A biblioteca padrão é suficiente para as atividades e os valores vêm no código.

Uma referência constante prevê o mesmo valor para cada observação. Escolhemos a mediana do alvo no treino, uma constante que minimiza a soma de erros absolutos no treino (pode haver mais de uma constante ótima). O erro absoluto é a distância entre previsto e real. O MAE é a média dessas distâncias, com um peso por observação e unidade igual à do alvo. Validação mede a referência e permite comparar alternativas. Teste fica reservado até congelar as escolhas.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/preparacao-ml/referencia-e-erro.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/preparacao-ml/referencia-e-erro-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/preparacao-ml.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Use a mediana do alvo [6, 10, 14] para fixar a previsão constante.

**Bash**

```bash
cd aulas/referencia-e-erro/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/referencia-e-erro/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
from statistics import median

y_treino = [6, 10, 14]
previsao = median(y_treino)
print(f"Referência: {previsao} min")
```

Saída esperada

```text
Referência: 10 min
```

O valor central é 10 min. Ele serve como ponto de comparação para próximos modelos.

## E2 · Altere ou depure

Use previsão 10 min e alvos de validação 8 e 15 min. Mostre a lista de erros e a média.

**Bash**

```bash
cd aulas/referencia-e-erro/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/referencia-e-erro/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from statistics import mean

previsao = 10
erros = [abs(real - previsao) for real in [8, 15]]
print(erros)
print(f"MAE: {mean(erros)} min")
```

Saída esperada

```text
[2, 5]
MAE: 3.5 min
```

Os erros absolutos são 2 e 5 min. Divida a soma por duas observações.

## E3 · Resolva

Documente a referência mediana do treino [12,15,18] e calcule o MAE em validação [14,19]. Mantenha os valores de teste reservados. Defina como lidar com uma única observação e uma partição vazia.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/referencia-e-erro/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/referencia-e-erro/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
from statistics import mean, median

treino, validacao = [12, 15, 18], [14, 19]
# Defina a referência e calcule a média dos erros absolutos.
```

Saída esperada

```text
Referência (mediana do treino): 15.0 min
MAE de validação: 2.5 min
MAE requer uma observação
```

<details>
<summary>Ver uma pista</summary>

Calcule primeiro a mediana no treino e passe essa constante à função de avaliação.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from statistics import mean, median

def mae(alvos, previsao):
    if not alvos:
        raise ValueError("MAE requer uma observação")
    return mean(abs(real - previsao) for real in alvos)

treino = [12, 15, 18]
validacao = [14, 19]
referencia = median(treino)
print(f"Referência (mediana do treino): {referencia:.1f} min")
print(f"MAE de validação: {mae(validacao, referencia):.1f} min")
assert mae([15], referencia) == 0
try:
    mae([], referencia)
except ValueError as erro:
    print(erro)
```

Saída esperada

```text
Referência (mediana do treino): 15.0 min
MAE de validação: 2.5 min
MAE requer uma observação
```

Com erros de 1 e 4 min, a média de validação é 2,5 min. Com um único caso, o MAE é o seu erro. A média de nenhum erro observado fica indefinida. No projeto, o teste será avaliado após congelar a referência.

No ZIP, a solução está em `aulas/referencia-e-erro/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projeto/auditar)

## Fontes

- [Erro absoluto médio](https://scikit-learn.org/stable/modules/model_evaluation.html#mean-absolute-error)
- [Mediana](https://docs.python.org/pt-br/3.14/library/statistics.html#statistics.median)
