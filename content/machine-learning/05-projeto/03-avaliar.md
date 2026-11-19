# Avaliar o período reservado

Com a escolha congelada, faça uma passagem pelos últimos vinte dias. Ajuste também a referência de mediana nas mesmas cem linhas. Calcule ambos os erros no mesmo intervalo. Evite voltar às escolhas com base nesse placar.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Avaliar o período reservado**.

## Demonstração

Compare os resultados no período posterior e gere o gráfico de resíduos.

<details><summary>Conferir código e interpretação</summary>

```python
from solucao.projeto import avaliar
p = avaliar()
print("Quantidade de previsões:", len(p))
```

A solução gera residuos.png e 20 previsões. O MAE final do selecionado é aproximadamente 3,41 min, e o da referência é 7,21 min.

</details>

## Variação

Determine a viagem com maior erro absoluto e guarde o sinal para interpretar o gráfico.

<details><summary>Conferir código e interpretação</summary>

```python
import numpy as np
from laboratorio import carregar
ids, X, y = carregar("serie.csv")
residuos = y[100:] - p
i = np.abs(residuos).argmax()
print(ids[100:][i], round(residuos[i], 2))
```

O ID permite retomar a linha no CSV. Com a convenção real menos previsto, um valor positivo indica uma viagem mais demorada que o previsto.

</details>

## Aplicação

Faça a variação inédita do kit. Some 7 minutos a cada duração final sem alterar o modelo e teste a mudança dos resíduos.

<details><summary>Conferir código e interpretação</summary>

```python
novos = (y[100:] + 7) - p
print(np.allclose(novos - residuos, 7))
```

Todos os resíduos sobem sete minutos. O valor absoluto e o MAE podem variar de maneira diferente em cada sinal.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html)
