# Receber e auditar o lote

Retome o problema de prever duração antes da partida. O kit traz uma série sintética com uma viagem por dia, ordem conhecida e medidas ausentes. Antes de ajustar, confira os IDs, a unidade, o contrato das colunas e se os intervalos reservados serão suficientes para completar as três janelas.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Receber e auditar o lote**.

## Demonstração

Leia a série sem acessar os alvos de teste. Verifique o formato de X e a unicidade.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
ids, X, y = carregar("serie.csv")
print(len(set(ids)), X.shape, ids[99:102])
```

Há 120 IDs distintos e 2 atributos. S100 encerra o desenvolvimento e S101 começa a reserva.

</details>

## Variação

Conte distâncias ausentes só no desenvolvimento e confirme o tratamento do zero.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
print(np.isnan(X[:100, 0]).sum(), (X[:100, 1] == 0).sum())
```

A primeira contagem indica quantas distâncias precisarão de imputação. A segunda conta viagens conhecidas sem paradas.

</details>

## Aplicação

Mostre que o intervalo reservado contém precisamente 20 IDs e nenhum deles ajudou a ajustar o modelo.

<details><summary>Conferir código e interpretação</summary>

```python
print(len(ids[100:]), set(ids[:100]).isdisjoint(ids[100:]))
```

Imprime 20 e True. Registre essas fronteiras no relatório antes de comparar alternativas.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html)
