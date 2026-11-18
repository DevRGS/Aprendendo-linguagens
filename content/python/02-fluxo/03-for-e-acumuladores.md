# For e acumuladores

Qual será o total depois de cada adição de 1 até 4? Você vai percorrer números e guardar o resultado parcial. Retome [Condições e faixas](#/python/fluxo/condicoes) para rever blocos indentados.

O `for` entrega um valor por iteração, ou repetição. Em `for numero in range(1, 5):`, o primeiro valor é 1 e o limite final 5 fica de fora. O corpo é o bloco indentado. Comece o acumulador `total` em 0 antes do laço. Na passagem com número 2, o total antes da soma é 1 e depois vira 3. Imprimir dentro do laço mostra a evolução. Imprimir depois do laço mostra só o resultado final.

Com três argumentos, `range(inicio, fim, passo)` avança pelo passo indicado. Preveja o primeiro e o último valor de `range(2, 11, 2)`. Em seguida você vai controlar a repetição com uma condição de parada.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/fluxo/for-e-acumuladores.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/fluxo/for-e-acumuladores-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/fluxo.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Anote os quatro totais esperados antes de executar. Some 1 até 4 e mostre o acumulador depois de cada adição.

**Bash**

```bash
cd aulas/for-e-acumuladores/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/for-e-acumuladores/e1
py exemplo.py
```

```python
total = 0
for numero in range(1, 5):
    total = total + numero
    print(total)
```

Saída esperada

```text
1
3
6
10
```

A cada iteração, o valor anterior de total participa da nova soma. Colocar total = 0 dentro do laço apagaria os resultados parciais.

## E2 · Altere ou depure

Diga qual número está faltando na primeira contagem e por quê. Compare o total de cada intervalo.

**Bash**

```bash
cd aulas/for-e-acumuladores/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/for-e-acumuladores/e2
py variacao.py
```

```python
total = 0
for numero in range(1, 4):
    total = total + numero
print(total)

total = 0
for numero in range(1, 5):
    total = total + numero
print(total)
```

Saída esperada

```text
6
10
```

O 4 é limite exclusivo no primeiro range. No segundo ele entra e aumenta o total de 6 para 10.

## E3 · Resolva

Some apenas os números pares de 2 até 10, incluindo 10. Mostre só o total. Como caso de borda, use um intervalo em que não entre nenhum par e confira o resultado.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/for-e-acumuladores/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/for-e-acumuladores/e3
py exercicio.py
```

```python
total = 0
# Percorra os pares, atualize total e exiba o resultado.
```

Saída esperada

```text
30
```

<details>
<summary>Ver uma pista</summary>

Comece em 2, avance de 2 em 2 e escolha um limite final maior que 10.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
total = 0
for numero in range(2, 11, 2):
    total = total + numero
print(total)
```

Saída esperada

```text
30
```

O passo 2 produz 2, 4, 6, 8 e 10. Se o primeiro valor já alcança o limite final, o corpo não roda e total conserva o zero inicial.

No ZIP, a solução está em `aulas/for-e-acumuladores/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/fluxo/while-e-parada)

## Fontes

- [Instrução for](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#for-statements)
- [A função range](https://docs.python.org/pt-br/3.14/tutorial/controlflow.html#the-range-function)
