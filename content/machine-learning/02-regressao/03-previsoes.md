# Prever sem reajustar

predict aplica os parâmetros aprendidos a novas linhas com o mesmo contrato de entrada. Para comparar candidatos, ambos devem receber exatamente as viagens de validação e ser avaliados contra seus respectivos alvos.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Prever sem reajustar**.

## Demonstração

Gere previsões para V07 e V08 sem passar os tempos reais a predict.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
ids, X, y = carregar()
modelo = LinearRegression().fit(X[:6, 1:2], y[:6])
p = modelo.predict(X[6:8, 1:2])
print(list(zip(ids[6:8], p.round(2).tolist())))
```

Saem duas estimativas na ordem V07, V08. Observe que a viagem com zero paradas recebe a estimativa do intercepto.

</details>

## Variação

Calcule a distância média da previsão ao alvo.

<details><summary>Conferir código e interpretação</summary>

```python
print(round(mean_absolute_error(y[6:8], p), 2))
```

Compare o valor com 3,5 minutos. Aqui a reta com paradas tem MAE maior que a referência.

</details>

## Aplicação

Refaça a comparação com as linhas da validação em ordem inversa. Preserve os pares.

<details><summary>Conferir código e interpretação</summary>

```python
print(round(mean_absolute_error(y[6:8][::-1], p[::-1]), 2))
```

O MAE é idêntico porque cada previsão ainda acompanha o mesmo alvo.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html)
