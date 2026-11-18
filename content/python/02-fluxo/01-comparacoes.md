# Comparações e lógica

A nota zero deve passar por uma validação que aceita valores de 0 a 10? Use nomes e valores como em [Nomes e tipos](#/python/inicio/nomes-e-tipos) para escrever regras que devolvem `True` ou `False`.

Em `nota >= 0`, o sinal `>=` inclui a igualdade. Use `==` para comparar valores e `=` para atribuir um valor a um nome. `0 <= nota <= 10` verifica os dois lados do intervalo: 0 e 10 pertencem ao intervalo e 11 fica fora. Para condições booleanas, `and` exige as duas verdadeiras, `or` aceita uma ou ambas e `not` inverte a condição. Em `True or False and False`, `and` é avaliado como parte do operando à direita de `or`. A expressão é verdadeira. Parênteses permitem exigir outra associação.

Explique por que um limite de “pelo menos 16” inclui 16. Em [Condições](#/python/fluxo/condicoes), as comparações vão decidir quais linhas executar.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/fluxo/comparacoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/fluxo/comparacoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/fluxo.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja se as notas 0, 10 e 11 passam por um intervalo com os dois extremos inclusivos.

**Bash**

```bash
cd aulas/comparacoes/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/comparacoes/e1
py exemplo.py
```

```python
nota = 0
print(nota, 0 <= nota <= 10)
nota = 10
print(nota, 0 <= nota <= 10)
nota = 11
print(nota, 0 <= nota <= 10)
```

Saída esperada

```text
0 True
10 True
11 False
```

A comparação encadeada exige que nota seja pelo menos 0 e no máximo 10.

## E2 · Altere ou depure

Calcule mentalmente os resultados antes de rodar. Compare os efeitos do agrupamento em duas regras booleanas.

**Bash**

```bash
cd aulas/comparacoes/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/comparacoes/e2
py variacao.py
```

```python
autorizado = True
convite = False
sala_aberta = False
print(autorizado or convite and sala_aberta)
print((autorizado or convite) and sala_aberta)
```

Saída esperada

```text
True
False
```

A primeira regra permite acesso só com autorização. A segunda exige sala aberta mesmo para quem tem autorização.

## E3 · Resolva

Uma oficina admite quem tem cadastro e tem pelo menos 16 anos. Demonstre três casos, nesta ordem: cadastro e 15 anos, cadastro e 16 anos, sem cadastro e 18 anos. O segundo caso testa o limite inclusivo.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/comparacoes/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/comparacoes/e3
py exercicio.py
```

```python
cadastro = True
idade = 15
# Exiba a regra e repita para os outros dois casos.
```

Saída esperada

```text
False
True
False
```

<details>
<summary>Ver uma pista</summary>

Combine a informação de cadastro com a comparação de idade usando and.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
cadastro = True
idade = 15
print(cadastro and idade >= 16)

cadastro = True
idade = 16
print(cadastro and idade >= 16)

cadastro = False
idade = 18
print(cadastro and idade >= 16)
```

Saída esperada

```text
False
True
False
```

Cada situação precisa passar pelas duas verificações. Uma pessoa cadastrada de exatamente 16 anos passa por causa da igualdade em >=.

No ZIP, a solução está em `aulas/comparacoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/fluxo/condicoes)

## Fontes

- [Comparações encadeadas](https://docs.python.org/pt-br/3.14/reference/expressions.html#comparisons)
- [Operações booleanas](https://docs.python.org/pt-br/3.14/reference/expressions.html#boolean-operations)
