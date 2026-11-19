# Texto e fatias

Como transformar `" Ana "` no nome `ana` para compará-lo com outro cadastro? Retome [Nomes e tipos](#/python/inicio/nomes-e-tipos) para rever texto e atribuição.

O índice começa em zero: em `"sol"`, o índice 0 aponta para `s`. Uma fatia como `"sol"[0:2]` começa em 0 e vai até antes de 2, produzindo `"so"`. Uma fatia pode ser vazia. Um índice individual precisa existir. Texto é imutável. Você pode ligar um nome a um novo texto, mas não pode trocar um caractere do texto original por atribuição a um índice.

Métodos são operações acessadas depois de um ponto. Em `" Ana ".strip().lower()`, `strip()` produz `"Ana"` ao tirar espaços nas extremidades. `lower()` usa esse resultado e produz `"ana"`. O método `split(",")` separa campos onde encontra vírgulas e devolve uma lista. Na próxima aula você vai alterar os itens de uma lista. Antes, explique por que cortar uma fatia é diferente de editar o texto no lugar.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/sequencias/texto-e-fatias.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/sequencias/texto-e-fatias-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/sequencias.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Preveja o texto depois de cada método. Normalize o nome com espaços e maiúscula inicial.

**Bash**

```bash
cd aulas/texto-e-fatias/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/texto-e-fatias/e1
py exemplo.py
```

```python
bruto = " Ana "
sem_espacos = bruto.strip()
normalizado = sem_espacos.lower()
print(normalizado)
```

Saída esperada

```text
ana
```

strip tira espaços nas extremidades e lower devolve o texto em minúsculas. O novo valor está em normalizado.

## E2 · Altere ou depure

Compare a fatia [:1] do texto vazio com o acesso intencionalmente inválido ao índice 0. Preveja qual operação retorna normalmente. O bloco captura o erro para que o exemplo termine.

**Bash**

```bash
cd aulas/texto-e-fatias/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/texto-e-fatias/e2
py variacao.py
```

```python
texto = ""
print("Fatia:", repr(texto[:1]))
try:
    print(texto[0])
except IndexError:
    print("IndexError")
```

Saída esperada

```text
Fatia: ''
IndexError
```

A fatia disponível não contém caracteres. repr torna as aspas visíveis para mostrar o texto vazio. O índice 0 exigiria um primeiro caractere.

## E3 · Resolva

Receba `" azul , verde "`, separe pela vírgula e retire os espaços das extremidades de cada palavra. Imprima uma por linha. Depois observe o segundo campo de `"azul,"`: preserve a posição mesmo quando o campo está vazio.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/texto-e-fatias/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/texto-e-fatias/e3
py exercicio.py
```

```python
texto = " azul , verde "
# Separe pela vírgula e limpe cada campo.
```

Saída esperada

```text
azul
verde
```

<details>
<summary>Ver uma pista</summary>

Faça split antes de limpar os dois campos. Acesse a primeira palavra com índice 0.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
texto = " azul , verde "
campos = texto.split(",")
print(campos[0].strip())
print(campos[1].strip())
```

Saída esperada

```text
azul
verde
```

O separador tira a vírgula e preserva os campos. Aplicar strip a cada campo remove também espaços próximos da vírgula. Com vírgula final, o segundo campo existe e é vazio.

No ZIP, a solução está em `aulas/texto-e-fatias/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/sequencias/listas)

## Fontes

- [Índices, fatias e texto](https://docs.python.org/pt-br/3.14/tutorial/introduction.html#text)
- [Métodos de strings](https://docs.python.org/pt-br/3.14/library/stdtypes.html#string-methods)
