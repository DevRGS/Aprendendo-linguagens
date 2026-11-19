# Comunicar resultados e limites

Entregue o script, a tabela com os três resultados de validação, o nome congelado, as duas métricas finais e o gráfico. Outra pessoa precisa conseguir repetir a avaliação em uma pasta limpa. Os dados têm ruído e uma mudança de duração no final. A experiência mede desempenho apenas nesse cenário sintético.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Comunicar resultados e limites**.

## Demonstração

Produza uma frase verificável com tamanho da reserva, unidade e métrica.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
from solucao.projeto import selecionar
from sklearn.metrics import mean_absolute_error
ids, X, y = carregar("serie.csv")
nome, modelo, _ = selecionar(X[:100], y[:100])
p = modelo.predict(X[100:])
print(f"{nome}: MAE de {mean_absolute_error(y[100:], p):.2f} min em {len(p)} viagens reservadas.")
```

A frase identifica ridge-1, 3,41 minutos e 20 viagens. Acrescente que as viagens são sintéticas.

</details>

## Variação

Compare o MAE nas duas metades da reserva e diga por que os valores podem variar.

<details><summary>Conferir código e interpretação</summary>

```python
for a, b in ((0,10), (10,20)):
    print(ids[100+a], round(mean_absolute_error(y[100+a:100+b], p[a:b]), 2))
```

Cada metade compara dez observações. Ruído, distâncias e paradas podem mudar a composição dos períodos.

</details>

## Aplicação

Proponha uma decisão acompanhada de uma condição para reavaliá-la e confira o ganho absoluto sobre a referência.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import alternativas
ref = alternativas()["mediana"].fit(X[:100], y[:100]).predict(X[100:])
print(round(mean_absolute_error(y[100:], ref) - mean_absolute_error(y[100:], p), 2))
```

O ganho é cerca de 3,8 min de MAE neste período. Antes de usar o modelo em outra cidade, repita a avaliação em viagens representativas dela.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html)
