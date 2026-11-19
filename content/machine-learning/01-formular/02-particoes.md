# Separar observações no tempo

Um teste cronológico imita o uso do modelo no futuro. Ordene uma única vez e corte IDs, atributos e alvos nos mesmos índices. Nas dez viagens válidas da trilha Python, os seis primeiros dias ensinam o modelo, os dois seguintes apoiam escolhas e os dois últimos ficam reservados.

[Baixar laboratório e dados](content/machine-learning/projetos/projeto.zip) · [Baixar caderno da trilha](content/machine-learning/projetos/viagens.ipynb) · [Preparação do ambiente](#/machine-learning/referencia)

No terminal, abra a raiz do kit e salve os blocos desta aula na ordem em estudo.py. Execute com o Python do ambiente preparado. No caderno, execute a preparação e abra a seção **Separar observações no tempo**.

## Demonstração

Localize os IDs de cada partição antes de comparar os tamanhos.

<details><summary>Conferir código e interpretação</summary>

```python
from laboratorio import carregar
ids, X, y = carregar()
print(ids[:6], ids[6:8], ids[8:])
```

Treino termina em V06. Validação contém V07 e V08. O teste contém V09 e V10.

</details>

## Variação

Mostre por que iniciar a validação em 5 contaminaria a comparação.

<details><summary>Conferir código e interpretação</summary>

```python
print(set(ids[:6]) & set(ids[5:8]))
```

V06 aparece nos dois lados e deixa de simular uma viagem inédita.

</details>

## Aplicação

Verifique a disjunção dos três grupos e a cobertura das dez viagens.

<details><summary>Conferir código e interpretação</summary>

```python
a, b, c = map(set, (ids[:6], ids[6:8], ids[8:]))
print(a.isdisjoint(b), b.isdisjoint(c), a.isdisjoint(c), len(a | b | c))
```

O resultado tem três True e 10 IDs distintos. Usar os mesmos cortes em X e y mantém cada alvo ligado à sua viagem.

</details>

[Documentação do scikit-learn](https://scikit-learn.org/stable/modules/model_evaluation.html)
