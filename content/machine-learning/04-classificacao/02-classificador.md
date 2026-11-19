# Ajustar e prever classes

A regressão logística estima uma probabilidade de classe por meio de uma transformação logística. O método predict devolve um rótulo. A classe verdadeira de cada nova bateria será conhecida apenas pela inspeção.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Ajustar e prever classes**.

## Demonstração

Ajuste um classificador nas primeiras oito baterias e preveja as quatro seguintes.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.linear_model import LogisticRegression
modelo = LogisticRegression().fit([[1],[2],[3],[4],[6],[7],[8],[9]], [0,0,0,0,1,1,1,1])
medidas = [[2],[4],[7],[9]]
print(modelo.predict(medidas).tolist())
```

O modelo prevê [0, 0, 1, 1]. A medição é a entrada disponível antes da inspeção.

</details>

## Variação

Veja a probabilidade para cada classe na bateria com medição 7.

<details><summary>Conferir código e interpretação</summary>

```python
print(modelo.classes_.tolist(), modelo.predict_proba([[7]]).round(3).tolist())
```

Há duas probabilidades na ordem 0, 1. A soma antes de arredondar é 1.

</details>

## Aplicação

Simule um limiar de inspeção mais baixo, de 0,2. Compare quantas baterias seriam chamadas.

<details><summary>Conferir código e interpretação</summary>

```python
prob = modelo.predict_proba(medidas)[:, 1]
print(int((prob >= 0.2).sum()), int((prob >= 0.5).sum()))
```

Baixar o limiar pode chamar mais baterias. Antes de adotá-lo, compare desgaste perdido e inspeções adicionais em validação.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html)
