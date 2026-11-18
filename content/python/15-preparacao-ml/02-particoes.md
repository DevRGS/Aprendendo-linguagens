# Treino, validação e teste

Você tem dez observações históricas e quer avaliar previsões para dias futuros. Quais registros reservaria?

Retome [Observação, atributos e alvo](#/python/preparacao-ml/observacao-atributo-alvo). Estes exercícios usam listas, tuplas e datas ISO em texto. Para os exemplos, ordenar datas com o mesmo formato AAAA-MM-DD equivale a ordenar cronologicamente.

Treino fornece exemplos para ajuste. Validação permite comparar escolhas. Teste é reservado para a avaliação final. Uma divisão aleatória pode servir quando as observações são independentes e representativas do mesmo processo. Use divisão temporal quando a ordem importa, com passado no treino e futuro reservado. Se várias linhas descrevem o mesmo evento ou pessoa, divida por grupo quando a avaliação precisar generalizar para grupos inéditos.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/preparacao-ml/particoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/preparacao-ml/particoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/preparacao-ml.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Crie dez dias em ordem invertida. Ordene e separe primeiros seis, próximos dois e últimos dois.

**Bash**

```bash
cd aulas/particoes/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/particoes/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
dias = [f"2026-01-{dia:02d}" for dia in range(10, 0, -1)]
dias.sort()
treino, validacao, teste = dias[:6], dias[6:8], dias[8:]
for parte in (treino, validacao, teste):
    print(len(parte), parte[0], parte[-1])
```

Saída esperada

```text
6 2026-01-01 2026-01-06
2 2026-01-07 2026-01-08
2 2026-01-09 2026-01-10
```

A data precisa ser ordenada antes da fatia. O teste contém os dois últimos dias.

## E2 · Altere ou depure

Simule um sistema que memoriza duração por evento e prevê zero para evento novo. Compare a avaliação num registro repetido de E1 e num evento inédito E3.

**Bash**

```bash
cd aulas/particoes/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/particoes/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
treino = {"E1": 9, "E2": 15}
for id_evento, real in [("E1", 9), ("E3", 12)]:
    previsto = treino.get(id_evento, 0)
    print(id_evento, abs(real - previsto))
```

Saída esperada

```text
E1 0
E3 12
```

O mesmo evento no treino e na avaliação dá erro zero de memorização. Se precisamos estimar eventos inéditos, mantenha todas as linhas de um evento na mesma partição. A previsão zero para desconhecidos só serve para ilustrar esse efeito.

## E3 · Resolva

Use data e ID para organizar seis registros abaixo. Treino até 02/01, validação em 03/01 e teste depois. Mostre IDs em ordem, prove disjunção, registre fronteiras e trate o caso de dois registros na data-limite de treino.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/particoes/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/particoes/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
registros = [
    ("2026-01-04", "b"), ("2026-01-02", "f"), ("2026-01-01", "d"),
    ("2026-01-03", "a"), ("2026-01-02", "e"), ("2026-01-05", "c"),
]
fim_treino, fim_validacao = "2026-01-02", "2026-01-03"
# Separe as partes e use conjuntos para conferir disjunção.
```

Saída esperada

```text
Fins inclusivos: 2026-01-02 2026-01-03
treino ['d', 'e', 'f']
validacao ['a']
teste ['b', 'c']
```

<details>
<summary>Ver uma pista</summary>

Corte por intervalos de data, sem usar a ordem alfabética dos IDs como cronologia.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
registros = [
    ("2026-01-04", "b"), ("2026-01-02", "f"), ("2026-01-01", "d"),
    ("2026-01-03", "a"), ("2026-01-02", "e"), ("2026-01-05", "c"),
]
fim_treino, fim_validacao = "2026-01-02", "2026-01-03"
ordenados = sorted(registros)
partes = [
    [id_ for data, id_ in ordenados if data <= fim_treino],
    [id_ for data, id_ in ordenados if fim_treino < data <= fim_validacao],
    [id_ for data, id_ in ordenados if data > fim_validacao],
]
treino, validacao, teste = map(set, partes)
assert treino.isdisjoint(validacao) and treino.isdisjoint(teste)
assert validacao.isdisjoint(teste)
assert len(treino | validacao | teste) == len(registros)
print("Fins inclusivos:", fim_treino, fim_validacao)
for nome, ids in zip(("treino", "validacao", "teste"), partes, strict=True):
    print(nome, ids)
```

Saída esperada

```text
Fins inclusivos: 2026-01-02 2026-01-03
treino ['d', 'e', 'f']
validacao ['a']
teste ['b', 'c']
```

Os dois registros de 02/01 ficam juntos no treino e são ordenados pelo ID dentro do mesmo dia. O teste começa depois de 03/01. Ajuste parâmetros só depois de separar os conjuntos.

No ZIP, a solução está em `aulas/particoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/preparacao-ml/ajustar-e-aplicar)

## Fontes

- [Estratégias de validação](https://scikit-learn.org/stable/modules/cross_validation.html)
