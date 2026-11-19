# Ajustar uma reta

Uma regressão linear com um atributo aprende uma inclinação e um intercepto. O ajuste por mínimos quadrados escolhe parâmetros que minimizam a soma dos quadrados dos resíduos no treino. A métrica usada depois para avaliar pode ser MAE.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Ajustar uma reta**.

## Demonstração

Ajuste usando só o treino e imprima os dois parâmetros.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.linear_model import LinearRegression
from laboratorio import carregar
_, X, y = carregar()
modelo = LinearRegression().fit(X[:6, 1:2], y[:6])
print(round(modelo.intercept_, 2), round(modelo.coef_[0], 2))
```

O intercepto estima a duração com zero paradas. A inclinação tem unidade de minutos por parada adicional.

</details>

## Variação

Preveja uma viagem com duas paradas pela equação.

<details><summary>Conferir código e interpretação</summary>

```python
print(round(modelo.intercept_ + 2 * modelo.coef_[0], 2))
```

A equação multiplica a inclinação pelo número de paradas e soma o intercepto.

</details>

## Aplicação

Verifique o significado da inclinação calculando a diferença entre previsões com duas e três paradas.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
p = modelo.predict([[2], [3]])
print(np.isclose(p[1] - p[0], modelo.coef_[0]))
```

A verificação imprime True. Uma associação no treino, isoladamente, não demonstra que acrescentar uma parada causará esse atraso.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html)
