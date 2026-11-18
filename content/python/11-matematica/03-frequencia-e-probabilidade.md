# Frequência, condição e probabilidade

O espaço amostral reúne os resultados possíveis de um experimento. Em um conjunto observado, frequência relativa divide ocorrências pelo número de observações. Para uma proporção condicional, restrinja primeiro o grupo e conte dentro dele. Uma proporção conjunta usa o total e conta só as observações que satisfazem as duas condições. Uma simulação usa números pseudoaleatórios para ilustrar a diferença entre frequência observada e probabilidade teórica. Retome [reprodutibilidade](#/python/qualidade/reprodutibilidade).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/matematica/frequencia-e-probabilidade.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/matematica/frequencia-e-probabilidade-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/matematica.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Meça a proporção de A em [A, A, B, B].

**Bash**

```bash
cd aulas/frequencia-e-probabilidade/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/frequencia-e-probabilidade/e1
py exemplo.py
```

```python
grupos = ["A", "A", "B", "B"]
print(grupos.count("A"), len(grupos))
print(grupos.count("A") / len(grupos))
```

Saída esperada

```text
2 4
0.5
```

Há duas ocorrências em quatro.

## E2 · Altere ou depure

Conte um acerto no grupo A. Compare a frequência no grupo e a frequência conjunta.

**Bash**

```bash
cd aulas/frequencia-e-probabilidade/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/frequencia-e-probabilidade/e2
py variacao.py
```

```python
registros = [("A", True), ("A", False), ("B", True), ("B", False)]
grupo_a = [acerto for grupo, acerto in registros if grupo == "A"]
print(sum(grupo_a) / len(grupo_a), sum(grupo_a) / len(registros))
```

Saída esperada

```text
0.5 0.25
```

O numerador é 1 nos dois cálculos. Os denominadores são 2 e 4.

## E3 · Resolva

Simule 20 lançamentos equiprováveis. Compare com 0.5 e verifique que a mesma semente reproduz a frequência.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/frequencia-e-probabilidade/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/frequencia-e-probabilidade/e3
py exercicio.py
```

```python
from random import Random
rng = Random(3)
# Faça 20 sorteios e calcule a frequência.
```

Saída esperada

```text
observado=0.45 esperado=0.50
n deve ser positivo
```

<details>
<summary>Ver uma pista</summary>

Crie um Random com a semente e conte quantos valores ficaram abaixo de 0.5.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from random import Random
def proporcao(seed, n):
    if n <= 0:
        raise ValueError("n deve ser positivo")
    rng = Random(seed)
    return sum(rng.random() < 0.5 for _ in range(n)) / n

observado = proporcao(3, 20)
print(f"observado={observado:.2f} esperado=0.50")
assert proporcao(3, 20) == observado
try:
    proporcao(3, 0)
except ValueError as erro:
    print(erro)
```

Saída esperada

```text
observado=0.45 esperado=0.50
n deve ser positivo
```

O modelo atribui probabilidade 0.5 ao evento gerado. A frequência da amostra pode variar. O caso vazio é rejeitado antes da divisão.

No ZIP, a solução está em `aulas/frequencia-e-probabilidade/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/matematica/precisao-e-escalas)

## Fontes

- [Gerador pseudoaleatório local](https://docs.python.org/pt-br/3.14/library/random.html)
- [Contagem de ocorrências](https://docs.python.org/pt-br/3.14/library/collections.html#collections.Counter)
