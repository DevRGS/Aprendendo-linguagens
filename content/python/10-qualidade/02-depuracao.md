# Reproduzir e depurar falhas

Reduza um problema a um registro sem ID e faça a leitura falhar de propósito. Antes de executar, preveja a classe. Retome [dicionários](#/python/registros/dicionarios), [exceções](#/python/arquivos/excecoes) e [testes](#/python/qualidade/testes-unitarios).

Primeiro reproduza o problema com os menores dados que ainda causam a falha. Inspecione as chaves, os valores e seus tipos. A última linha do traceback identifica a exceção. As linhas acima indicam por onde a chamada passou. Registre um caso de regressão ao corrigir, para detectar se o problema voltar. Em um filtro de faltantes, compare com `None` explicitamente para manter o zero.

E1 e E2 capturam as falhas intencionais. No caderno, teste uma chamada sem captura em célula separada para obter o traceback completo. No terminal, faça isso em uma cópia descartável. Em E3, qual teste prova que o código continua descartando faltantes? Em seguida, veja [custo de operações](#/python/qualidade/custo-de-operacoes).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/qualidade/depuracao.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/qualidade/depuracao-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/qualidade.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Identifique a chave que causa KeyError em um registro contendo apenas valor. Inspecione as chaves antes do acesso.

**Bash**

```bash
cd aulas/depuracao/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/depuracao/e1
py exemplo.py
```

```python
registro = {"valor": "7"}
print(sorted(registro))
try:
    print(registro["id"])
except KeyError as erro:
    print(type(erro).__name__, erro.args[0])
```

Saída esperada

```text
['valor']
KeyError id
```

A lista de chaves não contém id. A falha intencional ocorre no acesso com colchetes, antes de qualquer cálculo.

## E2 · Altere ou depure

Compare um registro sem valor e outro com valor "sete". Preveja se falham no mesmo ponto.

**Bash**

```bash
cd aulas/depuracao/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/depuracao/e2
py variacao.py
```

```python
registros = [{"id": "a"}, {"id": "b", "valor": "sete"}]
for registro in registros:
    try:
        texto = registro["valor"]
        valor = int(texto)
    except KeyError:
        print(registro["id"], "campo ausente")
    except ValueError:
        print(registro["id"], "valor inválido")
```

Saída esperada

```text
a campo ausente
b valor inválido
```

No primeiro registro, ler pela chave falha. No segundo, a chave existe e a conversão falha. O erro indica qual operação investigar.

## E3 · Resolva

Corrija o filtro que descarta zero junto com valores ausentes. O contrato considera somente None como ausente. Preserve a ordem, faça [None, 0, 5] virar [0, 5] e [] virar []. Inclua um teste de regressão para o zero.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/depuracao/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/depuracao/e3
py exercicio.py
```

```python
def sem_ausentes(medidas):
    # Corrija a condição.
    return [n for n in medidas if n]

assert sem_ausentes([None, 0, 5]) == [0, 5]
assert sem_ausentes([]) == []
```

Saída esperada

```text
[5]
[0, 5]
regressão verificada
```

<details>
<summary>Ver uma pista</summary>

O teste deve verificar exatamente o valor ausente previsto no contrato.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
def antes(medidas):
    return [n for n in medidas if n]

def sem_ausentes(medidas):
    return [n for n in medidas if n is not None]

entrada = [None, 0, 5]
print(antes(entrada))
print(sem_ausentes(entrada))
assert sem_ausentes(entrada) == [0, 5]
assert sem_ausentes([]) == []
assert sem_ausentes([None]) == []
print("regressão verificada")
```

Saída esperada

```text
[5]
[0, 5]
regressão verificada
```

if n trata zero e None como falsos. A comparação de identidade retira apenas None. O teste que exige zero seria reprovado pelo filtro antigo, e o caso com None sozinho confirma a remoção.

No ZIP, a solução está em `aulas/depuracao/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/qualidade/custo-de-operacoes)

## Fontes

- [Classes e mensagens de exceção](https://docs.python.org/3.14/tutorial/errors.html#exceptions)
- [Veracidade de valores](https://docs.python.org/3.14/library/stdtypes.html#truth-value-testing)
