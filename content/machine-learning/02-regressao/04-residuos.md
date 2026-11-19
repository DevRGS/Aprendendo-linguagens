# Investigar o maior resíduo

Defina resíduo como valor observado menos previsão. Sinal positivo indica que a viagem demorou mais que o previsto. Procure a maior magnitude e recupere o ID para investigar. Um valor extremo em janela pequena merece contexto.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Investigar o maior resíduo**.

## Demonstração

Rastreie o maior erro da regressão de paradas.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
from laboratorio import carregar
from sklearn.linear_model import LinearRegression
ids, X, y = carregar()
m = LinearRegression().fit(X[:6, 1:2], y[:6])
r = y[6:8] - m.predict(X[6:8, 1:2])
i = np.argmax(np.abs(r))
print(ids[6:8][i], round(r[i], 2))
```

V08 tem duração subestimada. O resíduo é positivo mesmo sem paradas planejadas.

</details>

## Variação

O que acontece com o MAE se alguém trocar a ordem da subtração?

<details><summary>Conferir código e interpretação</summary>

```python
print(np.abs(r).mean() == np.abs(-r).mean())
```

Imprime True. Os sinais se invertem, mas as magnitudes são as mesmas.

</details>

## Aplicação

Produza um diagnóstico textual para cada viagem e indique uma investigação posterior.

<details><summary>Conferir código e interpretação</summary>

```python
for chave, valor in zip(ids[6:8], r):
    print(chave, "subestimada" if valor > 0 else "superestimada" if valor < 0 else "exata")
```

As duas linhas mostram sentidos distintos. Investigue se a duração depende também do percurso e quais atributos estariam disponíveis antecipadamente.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html)
