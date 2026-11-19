# Primeira execução

O que deverá aparecer se você pedir ao Python para mostrar exatamente estas palavras? Nesta aula você vai escrever uma instrução, executá-la e conferir uma linha de saída. Para começar, tenha um caderno com o kernel disponível ou o Python instalado no computador. Você pode copiar o bloco de E1 para um caderno vazio.

Leia `print("Olá, mundo!")` da esquerda para a direita. `print` é o nome da função que escreve a saída, `(` abre a chamada, `"Olá, mundo!"` é o argumento de texto e `)` fecha a chamada. As aspas delimitam o texto e ficam no código. A vírgula dentro das aspas pertence à mensagem.

**No caderno**, procure a célula editável, o botão de executar na barra de ferramentas e a região de saída logo abaixo da célula. Execute com Shift+Enter. **No terminal**, salve o bloco como `exemplo.py` num editor de texto em UTF-8. O editor altera o arquivo. O terminal recebe o comando que manda o interpretador executar o arquivo salvo. O prompt `>>>` indica que você entrou no interpretador interativo. Use `exit()` para voltar ao shell antes dos comandos abaixo.

No Windows, abra o PowerShell na pasta que guarda o arquivo e confira a versão.

```powershell
py --version
py exemplo.py
```

Se a instalação disponibilizar apenas `python`, confirme com `python --version` e use `python exemplo.py`. No Linux ou macOS, no shell da pasta do arquivo, use:

```bash
python3 --version
python3 exemplo.py
```

Se o terminal informar que o arquivo não existe, confira a pasta atual e o nome completo, inclusive a extensão `.py`. Depois de cada alteração, salve e repita a execução. Ao terminar, explique onde aparece a saída em seu ambiente. Na aula seguinte você vai dar nomes aos valores exibidos.

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/inicio/primeira-execucao.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/inicio/primeira-execucao-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/inicio.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Antes de executar, escreva a linha que espera ver. Copie apenas a instrução abaixo e rode no ambiente escolhido.

**Bash**

```bash
cd aulas/primeira-execucao/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/primeira-execucao/e1
py exemplo.py
```

```python
print("Olá, mundo!")
```

Saída esperada

```text
Olá, mundo!
```

A chamada escreve o conteúdo do texto e termina a linha. As aspas servem para o Python identificar onde o argumento começa e termina.

## E2 · Altere ou depure

Troque somente o conteúdo entre as aspas por `Estou aprendendo`. Preveja se as aspas aparecem na saída e confira.

**Bash**

```bash
cd aulas/primeira-execucao/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/primeira-execucao/e2
py variacao.py
```

```python
print("Estou aprendendo")
```

Saída esperada

```text
Estou aprendendo
```

A mensagem muda. O nome da função e a estrutura da chamada continuam válidos porque o novo texto também está delimitado.

## E3 · Resolva

Mostre `Nome: Lia` na primeira linha e `Meta: ler dados` na segunda. Use o ambiente que você escolheu. Qualquer solução com as duas linhas exatas funciona. Como caso de borda, teste uma mensagem vazia e observe se ela ainda ocupa uma linha.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/primeira-execucao/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/primeira-execucao/e3
py exercicio.py
```

```python
# Escreva a primeira instrução para Nome: Lia.
# Na linha seguinte, imprima Meta: ler dados.
```

Saída esperada

```text
Nome: Lia
Meta: ler dados
```

<details>
<summary>Ver uma pista</summary>

Olhe a única linha do primeiro exemplo. O que acontece se você repetir a chamada com outro argumento?

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
print("Nome: Lia")
print("Meta: ler dados")
```

Saída esperada

```text
Nome: Lia
Meta: ler dados
```

Cada chamada exibe uma informação e termina sua linha. Uma chamada com texto vazio ainda escreve uma quebra de linha.

No ZIP, a solução está em `aulas/primeira-execucao/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/inicio/nomes-e-tipos)

## Fontes

- [Usar o interpretador Python](https://docs.python.org/pt-br/3.14/tutorial/interpreter.html)
- [Função print](https://docs.python.org/pt-br/3.14/library/functions.html#print)
