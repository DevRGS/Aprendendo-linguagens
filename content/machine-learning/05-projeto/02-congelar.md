# Congelar o procedimento

Trabalhe agora no arquivo inicial/projeto.py do kit. Para cada alternativa, ajuste de novo nas primeiras 40, 60 e 80 linhas e meça o MAE no bloco seguinte. Use a menor média, reajuste uma vez nas primeiras 100 e registre o nome e as regras antes de avaliar os últimos dias.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Congelar o procedimento**.

## Demonstração

Compare sua implementação com a escolha reproduzida pela solução.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
from solucao.projeto import selecionar
ids, X, y = carregar("serie.csv")
nome, modelo, medidas = selecionar(X[:100], y[:100])
print(nome, sorted(medidas))
```

As alternativas são mediana, ridge-1 e ridge-10. Com a série fornecida, vence ridge-1.

</details>

## Variação

Registre o contrato da previsão em uma estrutura que outra pessoa possa ler.

<details><summary>Conferir código e interpretação</summary>

```python
ficha = {"modelo": nome, "fim_treino": ids[99], "atributos": ["km_planejados", "paradas_planejadas"], "metrica": "MAE (min)"}
print(ficha)
```

A ficha liga a escolha aos atributos permitidos e ao fim do desenvolvimento.

</details>

## Aplicação

Uma equipe prefere ridge-10 depois de ver o teste. Proponha um procedimento honesto para avaliar a mudança.

<details><summary>Conferir código e interpretação</summary>

```python
print("Próximo dado de avaliação precisa ser posterior a", ids[-1])
```

A hipótese pode ser explorada, mas exige outro período futuro reservado para uma avaliação independente.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html)
