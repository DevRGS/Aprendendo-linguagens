# Laboratório de Machine Learning

Comece pela [preparação de dados em Python](#/python/preparacao-ml/observacao-atributo-alvo) se tiver dificuldade em alinhar uma linha de atributos com o seu alvo. Para testar o pré-requisito, imagine uma previsão antes da partida. Quilômetros previstos e paradas planejadas estão disponíveis. O tempo faturado só existe depois da chegada e deve ficar fora das entradas.

## No navegador

[Baixe o caderno de viagens](content/machine-learning/projetos/viagens.ipynb) e abra o [JupyterLite](https://jupyterlite.github.io/demo/lab/index.html). Use **Upload Files**, abra o caderno e escolha **Python (Pyodide)**. Execute a célula **Preparar os dados** com **Shift+Enter** e aguarde o carregamento inicial. Ela cria os dados e arquivos auxiliares no diretório de trabalho. Use um caderno em uma pasta nova. Localize a aula pelo título e execute suas três células em ordem. O caderno traz os arquivos da experiência para permitir a execução sem um terminal.

## No terminal próprio

[Baixe o ZIP do laboratório](content/machine-learning/projetos/projeto.zip), extraia em uma pasta nova e abra o terminal onde está o README.md. O roteiro usa Python 3.14, NumPy, scikit-learn e Matplotlib. Os arquivos CSV se encontram na pasta dados. Respeite a ordem de execução dos blocos de cada aula. Copie-os para estudo.py na raiz extraída, ao lado de laboratorio.py.

**Linux e macOS**

```bash
python3.14 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python estudo.py
```

**Windows com PowerShell**

```powershell
py -3.14 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe estudo.py
```

Para o projeto final, comece em inicial/projeto.py. O README do kit explica como executar a solução, conferir o gráfico, testar a reserva e variar os alvos finais.

## Leitura de resultados

| Termo | Como reconhecer no laboratório |
|---|---|
| X e y | Uma linha por viagem em ambos. X contém atributos disponíveis antes da partida. y traz o tempo observado. |
| Treino, validação e teste | Aprenda parâmetros no treino, compare escolhas na validação e avalie a escolha congelada no período posterior reservado. |
| Resíduo | Real menos previsto, em minutos. Um sinal positivo indica subestimação. |
| MAE | Média das magnitudes dos resíduos. Quanto menor, menor a distância média ao observado naquele lote. |
| Classificação | Com desgaste como classe positiva, precisão mede acerto entre alertas e revocação mede cobertura dos desgastes reais. |

[Boas práticas do scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html) · [Avaliação de modelos](https://scikit-learn.org/stable/modules/model_evaluation.html) · [Validação em janelas temporais](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html)
