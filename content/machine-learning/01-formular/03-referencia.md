# Construir a previsão de referência

Antes de treinar um modelo com atributos, use uma regra simples que só aprende um número. A mediana dos alvos de treino é uma referência apropriada para minimizar a soma dos desvios absolutos no treino. Conhecer as respostas da validação para escolher a constante favoreceria a referência indevidamente.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Construir a previsão de referência**.

## Demonstração

Ache o valor central dos seis tempos no treino.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
from laboratorio import carregar, alternativas
ids, X, y = carregar()
print(y[:6].tolist(), np.median(y[:6]))
```

Os tempos são 6, 8, 10, 10, 12, 14. Os dois centrais valem 10.

</details>

## Variação

Ajuste a referência e preveja para duas viagens com entradas diferentes.

<details><summary>Conferir código e interpretação</summary>

```python
base = alternativas()["mediana"].fit(X[:6], y[:6])
print(base.predict(X[6:8]).tolist())
```

A previsão é [10.0, 10.0]. DummyRegressor com estratégia median ignora as diferenças entre os atributos.

</details>

## Aplicação

Mostre o efeito de trocar um único alvo do treino, de 14 para 140. Compare média e mediana.

<details><summary>Conferir código e interpretação</summary>

```python
alterado = y[:6].copy()
alterado[-1] = 140
print(np.mean(alterado), np.median(alterado))
```

A média passa para 31, enquanto a mediana permanece 10. Um valor extremo pode mover fortemente a média.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/model_evaluation.html)
