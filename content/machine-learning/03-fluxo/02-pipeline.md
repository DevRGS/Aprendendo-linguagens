# Compor transformação e modelo

Pipeline encadeia etapas. Durante fit, cada transformação é aprendida no treino. Durante predict, o mesmo imputador transforma a entrada e a regressão produz uma previsão. A composição evita esquecer uma etapa na avaliação.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Compor transformação e modelo**.

## Demonstração

Monte e ajuste um pipeline que aceite distâncias ausentes.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
_, X, y = carregar()
modelo = make_pipeline(SimpleImputer(strategy="median"), Ridge(alpha=1))
modelo.fit(X[:6], y[:6])
print(modelo.predict(X[7:8]).round(2).tolist())
```

Há uma previsão finita para V08 apesar do valor ausente na entrada.

</details>

## Variação

Inspecione as etapas e a estatística da primeira.

<details><summary>Conferir código e interpretação</summary>

```python
print(list(modelo.named_steps), modelo[0].statistics_.tolist())
```

A primeira é simpleimputer. Sua mediana da primeira coluna é 4. A última é ridge.

</details>

## Aplicação

Faça inferência em uma viagem inédita de 4 km com duas paradas e confira o formato.

<details><summary>Conferir código e interpretação</summary>

```python
print(modelo.predict([[4, 2]]).shape)
```

Uma linha de entrada produz um vetor com uma previsão. A ordem das colunas continua distância, paradas.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html)
