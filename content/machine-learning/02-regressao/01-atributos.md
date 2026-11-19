# Alinhar atributos e alvo

Para aprender uma relação numérica, o estimador recebe uma matriz X com uma linha por viagem e um vetor y na mesma ordem. Comece pela contagem de paradas, que está preenchida nas dez linhas. Uma matriz com uma única coluna continua bidimensional.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Alinhar atributos e alvo**.

## Demonstração

Confira dimensões e rastreie a terceira observação.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
ids, X, y = carregar()
paradas = X[:, 1:2]
print(paradas.shape, y.shape, ids[2], paradas[2, 0], y[2])
```

Há 10 linhas e uma coluna de paradas. V03 tem uma parada e alvo de 10 minutos.

</details>

## Variação

Inspecione a forma ao selecionar um índice de coluna em vez de uma fatia.

<details><summary>Conferir código e interpretação</summary>

```python
print(X[:, 1].shape, X[:, 1:2].shape)
```

O índice produz (10,) e a fatia (10, 1). O ajuste de regressão espera a segunda forma.

</details>

## Aplicação

Extraia os atributos e alvos da janela de validação e mostre o vínculo por ID.

<details><summary>Conferir código e interpretação</summary>

```python
print(list(zip(ids[6:8], paradas[6:8, 0].tolist(), y[6:8].tolist())))
```

V07 tem uma parada e dura 8 minutos. V08 tem zero e dura 15. Cortar cada vetor na mesma posição conserva o vínculo.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html)
