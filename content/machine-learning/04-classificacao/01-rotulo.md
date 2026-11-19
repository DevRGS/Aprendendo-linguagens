# Definir a classe positiva

Uma equipe quer decidir se deve inspecionar uma bateria com base na vibração medida agora. Cada linha abaixo representa uma bateria diferente. Classe 1 indica que a inspeção posterior confirmou desgaste. Aqui o alvo é uma categoria binária. Os registros estão em ordem de coleta.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Definir a classe positiva**.

## Demonstração

Separe as oito medições de treino e as quatro de validação sem trocar os rótulos.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
sinal = np.array([1, 2, 3, 4, 6, 7, 8, 9, 2, 4, 7, 9]).reshape(-1, 1)
desgaste = np.array([0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1])
print(sinal[:8].shape, desgaste[8:].tolist())
```

Em validação, a inspeção confirmou desgaste na segunda e na quarta baterias.

</details>

## Variação

Conte positivos em cada partição antes de treinar.

<details><summary>Conferir código e interpretação</summary>

```python
print(desgaste[:8].sum(), desgaste[8:].sum())
```

Há quatro positivos no treino e dois na validação. O treino contém exemplos de ambas as classes.

</details>

## Aplicação

Uma regra sempre diz “sem desgaste”. Quantas inspeções necessárias ela perde na validação?

<details><summary>Conferir código e interpretação</summary>

```python
print(np.count_nonzero(desgaste[8:] == 1))
```

Perde duas. Mesmo com dois acertos, essa estratégia deixa todos os desgastes passarem.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html)
