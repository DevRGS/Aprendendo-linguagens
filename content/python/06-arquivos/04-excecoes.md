# Tratar erros com contexto

Preveja a diferença entre abrir um arquivo ausente e converter “dez” em inteiro. Retome [entrada e erros](#/python/inicio/entrada-e-erros) e [leitura de arquivos](#/python/arquivos/caminhos-e-texto).

A abertura pode falhar com `FileNotFoundError`. A conversão de um texto inadequado para `int` levanta `ValueError`. Restrinja `try` à operação esperada e nomeie em `except` o erro que sabe tratar. Para interromper e acrescentar contexto, `raise ValueError(mensagem) from erro` preserva a causa original.

Os erros dos exercícios são intencionais e têm captura explícita. Use somente os arquivos da pasta de cada roteiro no terminal ou da preparação do caderno. Quando você pularia um registro? Quando interromperia o lote inteiro? Siga para [módulos e imports](#/python/projetos/modulos-e-imports).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/arquivos/excecoes.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/arquivos/excecoes-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/arquivos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Tente converter “dez” em inteiro. Capture a exceção ValueError esperada e explique a causa.

**Bash**

```bash
cd aulas/excecoes/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/excecoes/e1
py exemplo.py
```

```python
texto = "dez"
try:
    valor = int(texto)
except ValueError:
    print("ValueError: inteiro inválido")
```

Saída esperada

```text
ValueError: inteiro inválido
```

int aceita texto, mas “dez” não tem o formato aceito. Troque por "10" e acrescente um else com print(valor) para praticar o caminho válido.

## E2 · Altere ou depure

Compare um arquivo ausente e outro com a segunda linha inválida. Mostre o número da linha e confira a causa original.

**Bash**

```bash
cd aulas/excecoes/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/excecoes/e2
py variacao.py
```

```python
from pathlib import Path

def ler_total(caminho):
    total = 0
    with caminho.open(encoding="utf-8") as arquivo:
        for numero, linha in enumerate(arquivo, start=1):
            try:
                total += int(linha)
            except ValueError as erro:
                raise ValueError(f"linha {numero}: inteiro inválido") from erro
    return total

for nome in ["sem-medidas.txt", "medidas.txt"]:
    try:
        print(ler_total(Path(nome)))
    except FileNotFoundError:
        print("arquivo ausente")
    except ValueError as erro:
        print(erro)
        print(f"causa: {type(erro.__cause__).__name__}")
```

Saída esperada

```text
arquivo ausente
linha 2: inteiro inválido
causa: ValueError
```

A abertura falha antes da leitura para o arquivo ausente. Para medidas.txt, int falha na linha 2 e from guarda a causa. Para ver o traceback inteiro, faça uma chamada isolada de ler_total sem a captura externa.

## E3 · Resolva

Leia `lote.txt` com `3`, `erro` e `0` em três linhas. Pule somente conversões inválidas. Mostre dois válidos, uma rejeição e soma 3. Um arquivo vazio deve dar três zeros.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/excecoes/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/excecoes/e3
py exercicio.py
```

```python
from pathlib import Path

def resumir_lote(caminho):
    validos = rejeitados = soma = 0
    # Leia linha a linha, converta e atualize os três acumuladores.
    raise NotImplementedError

print(resumir_lote(Path("lote.txt")))
```

Saída esperada

```text
válidos=2, rejeitados=1, soma=3
```

<details>
<summary>Ver uma pista</summary>

Atualize o contador de válidos depois do `except`. Use `continue` quando rejeitar.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path

def resumir_lote(caminho):
    validos = rejeitados = soma = 0
    with caminho.open(encoding="utf-8") as arquivo:
        for linha in arquivo:
            try:
                numero = int(linha)
            except ValueError:
                rejeitados += 1
                continue
            validos += 1
            soma += numero
    return validos, rejeitados, soma

validos, rejeitados, soma = resumir_lote(Path("lote.txt"))
print(f"válidos={validos}, rejeitados={rejeitados}, soma={soma}")
```

Saída esperada

```text
válidos=2, rejeitados=1, soma=3
```

Toda conversão bem-sucedida conta, inclusive zero. Linha em branco é rejeitada por int. No arquivo vazio o laço não roda. Erro ao abrir se propaga.

No ZIP, a solução está em `aulas/excecoes/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projetos/modulos-e-imports)

## Fontes

- [Tratamento e encadeamento de exceções](https://docs.python.org/3.14/tutorial/errors.html#handling-exceptions)
