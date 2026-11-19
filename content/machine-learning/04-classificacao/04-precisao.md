# Comparar precisão e revocação

Precisão responde quantos dos alertas foram confirmados. Revocação responde quantos dos desgastes reais foram detectados. As duas medidas diferem pelo denominador. Declare que a classe positiva é desgaste e ligue o custo de cada erro à decisão.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Comparar precisão e revocação**.

## Demonstração

Calcule as métricas originais e depois as da política que inspeciona a segunda bateria.

<details><summary>Conferir código e interpretação</summary>

```python
from sklearn.metrics import precision_score, recall_score
real = [0,1,0,1]
for p in ([0,0,1,1], [0,1,1,1]):
    print(round(precision_score(real, p), 3), recall_score(real, p))
```

O primeiro par é 0,5 e 0,5. O segundo é aproximadamente 0,667 e 1,0.

</details>

## Variação

Calcule a política que inspeciona todas.

<details><summary>Conferir código e interpretação</summary>

```python
p = [1,1,1,1]
print(precision_score(real, p), recall_score(real, p))
```

Revocação atinge 1. Só metade dos quatro alertas tem desgaste confirmado.

</details>

## Aplicação

Se perder um desgaste custa 10 unidades e investigar um falso alerta custa 2, atribua custo à política original.

<details><summary>Conferir código e interpretação</summary>

```python
custo = sum(10 * (r == 1 and p == 0) + 2 * (r == 0 and p == 1) for r, p in zip(real, [0,0,1,1]))
print(custo)
```

O custo é 12. A política que chama todas custa 4 neste lote. Quatro baterias não bastam para generalizar.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html)
