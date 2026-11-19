# Aprender a preencher ausências

Uma distância ausente representa uma medida desconhecida. Zero é um valor numérico diferente. Aprenda a mediana da distância apenas com o treino e guarde a mesma regra para transformar os dias seguintes.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Aprender a preencher ausências**.

## Demonstração

Ajuste o imputador e localize a distância substituída na terceira viagem.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.impute import SimpleImputer
from laboratorio import carregar
_, X, y = carregar()
im = SimpleImputer(strategy="median").fit(X[:6])
print(im.statistics_.tolist(), im.transform(X[2:3]).tolist())
```

A mediana de distância é 4 km. A ausência em V03 passa a 4 e sua contagem de paradas permanece 1.

</details>

## Variação

Transforme as viagens de validação. V07, com 100 km, deve mudar a mediana?

<details><summary>Conferir código e interpretação</summary>

```python
print(im.transform(X[6:8]).tolist(), im.statistics_[0])
```

V07 mantém 100. A distância de V08 passa a 4. Transformar o lote conserva a estatística aprendida.

</details>

## Aplicação

Altere só as distâncias de um lote futuro e confirme a independência do ajuste anterior.

<details><summary>Conferir código e interpretação</summary>

```python
futuro = X[8:].copy()
futuro[:, 0] = 999
im.transform(futuro)
print(im.statistics_[0])
```

Permanece 4. Um novo fit no lote futuro misturaria informações de momentos diferentes.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html)
