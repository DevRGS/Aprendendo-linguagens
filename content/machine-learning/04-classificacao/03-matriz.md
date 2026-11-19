# Ler uma matriz de confusão

Compare os rótulos da inspeção com os rótulos previstos. Na matriz do scikit-learn, linhas representam a classe verdadeira e colunas representam a prevista. Informe labels=[0, 1] para fixar a convenção inclusive quando uma classe estiver ausente no lote.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Ler uma matriz de confusão**.

## Demonstração

Monte a matriz para as quatro baterias da validação.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.metrics import confusion_matrix
real, previsto = [0,1,0,1], [0,0,1,1]
print(confusion_matrix(real, previsto, labels=[0,1]).tolist())
```

A matriz é [[1, 1], [1, 1]]. Há um exemplo em cada combinação.

</details>

## Variação

Descubra a posição humana, contando a partir de 1, do falso negativo.

<details><summary>Conferir código e interpretação</summary>

```python
print([i for i, (r, p) in enumerate(zip(real, previsto), 1) if r == 1 and p == 0])
```

A segunda bateria tinha desgaste e foi liberada.

</details>

## Aplicação

Altere apenas a segunda previsão para 1 e localize a célula que diminui e a que aumenta.

<details><summary>Conferir código e interpretação</summary>

```python
print(confusion_matrix(real, [0,1,1,1], labels=[0,1]).tolist())
```

A matriz passa a [[1, 1], [0, 2]]. Um falso negativo passa a verdadeiro positivo.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html)
