# Marco 04 · Resumo de lote

Em três registros de estudo, quanto tempo foi para cada tema e como conferir o total? Retome [For e acumuladores](#/python/fluxo/for-e-acumuladores), [Percorrer e filtrar](#/python/sequencias/percorrer-e-filtrar) e [Dicionários](#/python/registros/dicionarios) conforme precisar.

Decomponha a tarefa em ler cada par (tema, minutos), atualizar a soma do tema e apresentar o resultado. Ao receber (A, 2), o mapa passa a ter A=2. Após (B, 3), ele também tem B=3. Receber (A, 4) muda A para 6. Guarde separadamente a soma de todas as durações. Uma verificação que deve valer para todo lote é comparar essa soma com a soma dos subtotais. Essa condição é um invariante.

A quantidade mede registros e a soma mede minutos. Um registro de zero minutos acrescenta uma unidade na primeira e zero na segunda. A ordem de saída é alfabética por tema. Antes de iniciar [Parâmetros e retorno](#/python/funcoes/parametros-e-retorno), explique que contagem e total mudariam ao acrescentar um registro de zero a um lote vazio. Se empacar no marco, retome os links e refaça o problema com (B, 0), (C, 3), (B, 2).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/registros/resumo-de-lote.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/registros/resumo-de-lote-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/registros.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o subtotal de A depois de cada passagem. Some os minutos por tema nos pares (A, 2), (B, 3) e (A, 4).

**Bash**

```bash
cd aulas/resumo-de-lote/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/resumo-de-lote/e1
py exemplo.py
```

```python
registros = [("A", 2), ("B", 3), ("A", 4)]
por_tema = {}
for tema, minutos in registros:
    por_tema[tema] = por_tema.get(tema, 0) + minutos
    print(tema, por_tema[tema])
```

Saída esperada

```text
A 2
B 3
A 6
```

Cada linha mostra o subtotal do próprio tema, logo o B não altera o total de A.

## E2 · Altere ou depure

Acrescente (A, 0). Antes de rodar, diga quais resultados mudam entre soma e contagem.

**Bash**

```bash
cd aulas/resumo-de-lote/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/resumo-de-lote/e2
py variacao.py
```

```python
registros = [("A", 2), ("B", 3), ("A", 4), ("A", 0)]
quantidade = 0
total = 0
for tema, minutos in registros:
    quantidade = quantidade + 1
    total = total + minutos
print("Registros:", quantidade)
print("Minutos:", total)
```

Saída esperada

```text
Registros: 4
Minutos: 9
```

A contagem aumentou de 3 para 4 e a soma ficou 9. Zero é uma duração registrada.

## E3 · Resolva

Gere um relatório de minutos dos registros (A, 2), (B, 3) e (A, 4). Mostre `A=6`, `B=3` e `total=9`, um por linha e na ordem mostrada. Explique também a saída esperada para um lote vazio.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/resumo-de-lote/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/resumo-de-lote/e3
py exercicio.py
```

```python
registros = [("A", 2), ("B", 3), ("A", 4)]
por_tema = {}
total = 0
# Acumule, ordene a apresentação e compare subtotais com o total.
```

Saída esperada

```text
A=6
B=3
total=9
```

<details>
<summary>Ver uma pista</summary>

Use um dicionário para subtotais e mantenha um acumulador do lote. Ordene as chaves antes de imprimir.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
registros = [("A", 2), ("B", 3), ("A", 4)]
por_tema = {}
total = 0
for tema, minutos in registros:
    por_tema[tema] = por_tema.get(tema, 0) + minutos
    total = total + minutos

for tema in sorted(por_tema):
    print(f"{tema}={por_tema[tema]}")
print(f"total={total}")
```

Saída esperada

```text
A=6
B=3
total=9
```

O mapa acumula por tema, sorted garante a ordem e a soma direta fornece o total. Confira que 6 + 3 dá 9. No lote vazio nenhum tema aparece e a saída contém apenas total=0.

No ZIP, a solução está em `aulas/resumo-de-lote/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/funcoes/parametros-e-retorno)

## Fontes

- [Dicionários e técnicas de iteração](https://docs.python.org/pt-br/3.14/tutorial/datastructures.html#dictionaries)
- [Função sorted](https://docs.python.org/pt-br/3.14/library/functions.html#sorted)
