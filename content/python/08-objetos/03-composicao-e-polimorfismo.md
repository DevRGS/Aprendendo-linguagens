# Composição e estratégias

Compare duas formas de tratar um rótulo, removendo espaços e convertendo para minúsculas ou preservando o texto. Preveja a diferença para `" Azul "`. Retome [métodos de texto](#/python/sequencias/texto-e-fatias) e [instâncias](#/python/objetos/instancias).

Combine objetos por composição. Um processador guarda uma estratégia em um atributo e delega o trabalho ao método `transformar(texto)`. O contrato desta aula pede um texto como argumento e devolve um texto. Estratégias diferentes podem ocupar o mesmo papel quando cumprem esse contrato. Essa substituição pelo comportamento é uma forma de polimorfismo.

Rode os blocos com as definições de cada exercício no caderno ou kit. Que mudança ocorreria se a estratégia recebesse uma lista em vez de texto? Depois avalie [quando escolher modelo ou função](#/python/objetos/modelo-ou-funcao).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/objetos/composicao-e-polimorfismo.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/objetos/composicao-e-polimorfismo-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/objetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

As duas estratégias têm o mesmo método. Aplique ambas a " Azul " e mostre onde ficaram os espaços.

**Bash**

```bash
cd aulas/composicao-e-polimorfismo/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/composicao-e-polimorfismo/e1
py exemplo.py
```

```python
class Normalizar:
    def transformar(self, texto):
        return texto.strip().lower()


class Identidade:
    def transformar(self, texto):
        return texto


for estrategia in [Normalizar(), Identidade()]:
    print(repr(estrategia.transformar(" Azul ")))
```

Saída esperada

```text
'azul'
' Azul '
```

O chamador usa a mesma expressão em ambos os casos. repr torna visíveis as aspas e os espaços preservados.

## E2 · Altere ou depure

Troque a normalização pela identidade ao chamar rotular. Antes de rodar, diga onde os espaços aparecerão entre os delimitadores.

**Bash**

```bash
cd aulas/composicao-e-polimorfismo/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/composicao-e-polimorfismo/e2
py variacao.py
```

```python
class Normalizar:
    def transformar(self, texto):
        return texto.strip().lower()


class Identidade:
    def transformar(self, texto):
        return texto


def rotular(texto, estrategia):
    return "[" + estrategia.transformar(texto) + "]"

texto = " Leitura "
print(rotular(texto, Normalizar()))
print(rotular(texto, Identidade()))
```

Saída esperada

```text
[leitura]
[ Leitura ]
```

O consumidor continua delegando ao mesmo método. Só o resultado do método muda entre as duas chamadas.

## E3 · Resolva

Construa Processador que recebe uma estratégia no inicializador e processa uma lista de rótulos. Teste Normalizar e Identidade com [" Azul ", "VERDE"]. As saídas devem manter ordem e quantidade. Entrada vazia deve produzir lista vazia.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/composicao-e-polimorfismo/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/composicao-e-polimorfismo/e3
py exercicio.py
```

```python
class Normalizar:
    def transformar(self, texto):
        return texto.strip().lower()


class Identidade:
    def transformar(self, texto):
        return texto


class Processador:
    def __init__(self, estrategia):
        self.estrategia = estrategia

    def processar(self, rotulos):
        # Devolva uma nova lista na ordem da entrada.
        raise NotImplementedError
```

Saída esperada

```text
['azul', 'verde']
[' Azul ', 'VERDE']
[]
```

<details>
<summary>Ver uma pista</summary>

Guarde a estratégia em self e delegue uma transformação para cada rótulo.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
class Normalizar:
    def transformar(self, texto):
        return texto.strip().lower()


class Identidade:
    def transformar(self, texto):
        return texto


class Processador:
    def __init__(self, estrategia):
        self.estrategia = estrategia

    def processar(self, rotulos):
        return [self.estrategia.transformar(rotulo) for rotulo in rotulos]


rotulos = [" Azul ", "VERDE"]
normalizador = Processador(Normalizar())
identidade = Processador(Identidade())
print(normalizador.processar(rotulos))
print(identidade.processar(rotulos))
print(normalizador.processar([]))
```

Saída esperada

```text
['azul', 'verde']
[' Azul ', 'VERDE']
[]
```

O processador guarda a estratégia recebida e aplica seu método a cada entrada na ordem. A compreensão cria nova lista e, se a entrada estiver vazia, não chama a estratégia.

No ZIP, a solução está em `aulas/composicao-e-polimorfismo/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/objetos/modelo-ou-funcao)

## Fontes

- [Métodos e objetos](https://docs.python.org/3.14/tutorial/classes.html#method-objects)
- [Duck typing no glossário](https://docs.python.org/3.14/glossary.html#term-duck-typing)
