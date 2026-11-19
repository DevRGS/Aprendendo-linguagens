# Prever antes da partida

Uma pessoa solicita a duração de uma viagem ao embarcar. A unidade de observação é uma viagem e a saída tem unidade de minutos. Um campo perfeitamente correlacionado com a duração seria inútil em produção se só fosse preenchido após a chegada.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Prever antes da partida**.

## Demonstração

Inspecione o primeiro registro. Quais duas entradas poderiam estar disponíveis nesse instante?

<details><summary>Conferir código e interpretação</summary>

```python
import csv
from laboratorio import DADOS
with (DADOS / "viagens.csv").open(encoding="utf-8") as f:
    viagem = next(csv.DictReader(f))
print(viagem["km_planejados"], viagem["paradas_planejadas"])
```

Saem 2 e 0. É possível conhecer o itinerário planejado antes de percorrê-lo.

</details>

## Variação

Mostre o valor faturado e o alvo real. A igualdade permite usar o faturamento para prever?

<details><summary>Conferir código e interpretação</summary>

```python
print(viagem["minutos_faturados"], viagem["minutos_reais"])
```

Ambos valem 6 na primeira viagem. Faturamento só existe depois da chegada e introduziria vazamento.

</details>

## Aplicação

Descreva uma previsão de S101 sem ler o alvo. Identifique as colunas copiadas para X.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
ids, X, y = carregar("serie.csv")
print(ids[100], X[100].tolist())
```

A linha contém distância e paradas planejadas. O ID rastreia a viagem. A previsão pretendida é a duração antes da partida.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/model_evaluation.html)
