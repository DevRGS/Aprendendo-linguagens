# Condições e faixas

Em um boletim, qual mensagem deve aparecer para quem tirou exatamente 7? Você vai decidir qual bloco executa a partir de uma comparação. Revise [Comparações e lógica](#/python/fluxo/comparacoes) se precisar.

Os dois pontos em `if nota >= 7:` abrem um bloco. Desloque as linhas do bloco quatro espaços para a direita. `elif` verifica outra condição apenas quando o `if` e os `elif` anteriores foram falsos. `else` cobre o que ainda resta. Uma cadeia executa o primeiro bloco aplicável. Duas condições podem ser verdadeiras para a mesma nota, então experimente localizar a primeira para cada valor.

Para classificar apenas notas de 0 a 10, descarte inválidas antes das faixas. Depois de descartar essas notas e as aprovadas, `nota >= 5` identifica a recuperação. Pergunte qual bloco fica para uma nota válida de 4.9. Em seguida você vai percorrer vários valores com um laço.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/fluxo/condicoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/fluxo/condicoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/fluxo.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o rótulo da nota 7 quando a aprovação exige pelo menos 7. Rode e identifique as linhas dentro do bloco.

**Bash**

```bash
cd aulas/condicoes/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/condicoes/e1
py exemplo.py
```

```python
nota = 7
if nota >= 7:
    print("aprovada")
else:
    print("abaixo de 7")
```

Saída esperada

```text
aprovada
```

O limite inclui 7, portanto só o bloco do if é executado.

## E2 · Altere ou depure

A nota 6 deve ir para recuperação. Compare a primeira cadeia, intencionalmente mal ordenada, com a correção. Preveja qual condição esconde a recuperação.

**Bash**

```bash
cd aulas/condicoes/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/condicoes/e2
py variacao.py
```

```python
nota = 6
if nota < 7:
    print("abaixo de 7")
elif nota >= 5 and nota < 7:
    print("recuperação")

if nota >= 7:
    print("aprovada")
elif nota >= 5:
    print("recuperação")
else:
    print("reprovada")
```

Saída esperada

```text
abaixo de 7
recuperação
```

No primeiro trecho, a primeira condição já aceita 6. No segundo, a faixa de recuperação fica depois da aprovação e antes do caso restante.

## E3 · Resolva

Classifique notas de 0 a 10 com esta precedência: inválida fora da faixa, aprovada a partir de 7, recuperação a partir de 5, reprovada nos demais casos. Teste −1, 5, 7 e 11 nessa ordem. Inclua também a borda 10 na conferência.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/condicoes/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/condicoes/e3
py exercicio.py
```

```python
notas = [-1, 5, 7, 11]
# O for fornece uma nota por vez. Use if/elif/else dentro dele.
for nota in notas:
    pass  # Substitua esta linha pelo primeiro teste e complete os blocos.
```

Saída esperada

```text
inválida
recuperação
aprovada
inválida
```

<details>
<summary>Ver uma pista</summary>

Experimente eliminar notas fora da faixa antes de comparar com 7 ou 5. Você também pode testar uma nota por execução.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
notas = [-1, 5, 7, 11]
for nota in notas:
    if nota < 0 or nota > 10:
        print("inválida")
    elif nota >= 7:
        print("aprovada")
    elif nota >= 5:
        print("recuperação")
    else:
        print("reprovada")
```

Saída esperada

```text
inválida
recuperação
aprovada
inválida
```

A validação é primeira para evitar que 11 satisfaça indevidamente a aprovação. O limite 10 é válido. O for repete a cadeia para cada nota e será explicado na próxima aula.

No ZIP, a solução está em `aulas/condicoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/fluxo/for-e-acumuladores)

## Fontes

- [Instruções if, elif e else](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#if-statements)
- [Instrução if na referência](https://docs.python.org/pt-br/3.14/reference/compound_stmts.html#the-if-statement)
