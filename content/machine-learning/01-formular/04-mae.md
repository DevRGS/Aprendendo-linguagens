# Interpretar o erro em minutos

O erro absoluto é a distância entre uma previsão e o valor medido. O MAE é a média dessas distâncias. Dois desvios em sentidos opostos contam para o erro sem se anularem. A unidade é a mesma do alvo.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Interpretar o erro em minutos**.

## Demonstração

Reconstrua o MAE de duas previsões constantes sem biblioteca de métricas.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
from laboratorio import carregar
_, X, y = carregar()
erros = np.abs(y[6:8] - 10)
print(erros.tolist(), erros.mean())
```

A referência erra por 2 e 5 minutos, com média de 3,5.

</details>

## Variação

Compare com a média dos desvios que preservam sinal.

<details><summary>Conferir código e interpretação</summary>

```python
print((y[6:8] - 10).mean())
```

O resultado é 1,5. A subestimação de uma viagem compensa em parte a superestimação da outra.

</details>

## Aplicação

Um candidato prevê 9 e 13 nos mesmos dias. Calcule seu MAE e decida qual vence nesta janela.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.metrics import mean_absolute_error
print(mean_absolute_error(y[6:8], [9, 13]))
```

O candidato obtém 1,5 min e vence a referência de 3,5 nesta validação. Duas viagens ainda dão pouca informação sobre o futuro.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/model_evaluation.html)
