# Validar no futuro de cada janela

Uma única janela pode ser atípica. Na série maior, valide em três blocos consecutivos de 20 dias. Em cada rodada, todos os dias do treino são anteriores ao bloco de validação. Os primeiros treinos reaparecem expandidos. Os 20 dias finais ficam de fora desta escolha.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Validar no futuro de cada janela**.

## Demonstração

Construa os limites e mostre os IDs de cada avaliação.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
ids, X, y = carregar("serie.csv")
for corte in (40, 60, 80):
    print(ids[corte - 1], ids[corte], ids[corte + 19])
```

A primeira linha é S040, S041, S060. A última termina em S100.

</details>

## Variação

Reproduza as mesmas divisões com TimeSeriesSplit.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.model_selection import TimeSeriesSplit
for tr, va in TimeSeriesSplit(n_splits=3, test_size=20).split(X[:100]):
    print(len(tr), len(va), tr[-1] < va[0])
```

São treinos com 40, 60 e 80 linhas. Cada validação contém 20 e ocorre depois de seu treino.

</details>

## Aplicação

Calcule três MAEs da referência. Que número usaria para compará-la com outro candidato?

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import alternativas
from sklearn.metrics import mean_absolute_error
for c in (40, 60, 80):
    ref = alternativas()["mediana"].fit(X[:c], y[:c])
    print(round(mean_absolute_error(y[c:c+20], ref.predict(X[c:c+20])), 2))
```

Use a média dos três MAEs. Como os blocos têm o mesmo tamanho, cada viagem recebe o mesmo peso.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html)
