# Escolher um hiperparâmetro

Ridge acrescenta uma penalidade aos coeficientes. alpha controla a intensidade da penalidade. Decida quais alternativas comparar antes de olhar o período final. Os coeficientes são aprendidos pelo ajuste e o valor de alpha é escolhido pela validação.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Escolher um hiperparâmetro**.

## Demonstração

Compare os dois alphas e a referência nas janelas já definidas. Inspecione a implementação de selecionar no kit.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
from solucao.projeto import selecionar
_, X, y = carregar("serie.csv")
nome, m, erros = selecionar(X[:100], y[:100])
print(nome, {k: round(v, 2) for k, v in erros.items()})
```

ridge-1 obtém cerca de 2,60 minutos de MAE médio, pouco abaixo de ridge-10. A solução reajusta o escolhido nos cem dias.

</details>

## Variação

Altere somente um alvo reservado e compare o dicionário de erros.

<details><summary>Conferir código e interpretação</summary>

```python
alternativo = y.copy()
alternativo[-1] += 500
print(selecionar(X[:100], alternativo[:100])[2] == erros)
```

True indica que a avaliação reservada não entrou nas escolhas.

</details>

## Aplicação

Verifique se a mediana do imputador do modelo escolhido coincide com a mediana dos km do desenvolvimento.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
print(np.isclose(m[0].statistics_[0], np.nanmedian(X[:100, 0])))
```

True. No reajuste final, o imputador aproveita todas as cem linhas disponíveis antes da reserva.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html)
