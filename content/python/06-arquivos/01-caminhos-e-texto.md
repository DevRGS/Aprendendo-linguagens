# Caminhos e arquivos de texto

Abra a pasta de um exercício e preveja o que acontece se pedir para abrir `mensagem.txt` antes de criá-lo. Retome [texto](#/python/sequencias/texto-e-fatias) e [funções](#/python/funcoes/parametros-e-retorno).

O diretório de trabalho é a pasta a partir da qual caminhos relativos são interpretados. `from pathlib import Path` torna o nome `Path` disponível. `Path("mensagem.txt")` representa um caminho relativo, `Path.cwd()` identifica a pasta atual e `resolve()` obtém o caminho absoluto.

UTF-8 permite converter bytes em texto com acentos como “ação”. Use o modo `r` para ler, `w` para escrever truncando o conteúdo existente ou `x` para criar um arquivo novo sem sobrescrever. `with` fecha o arquivo ao sair do bloco.

No caderno, use a pasta preparada para cada exercício. No terminal, trabalhe na pasta do roteiro do kit. Separe um arquivo para cada teste, conforme o enunciado. Que política você usaria para linhas com espaços? Em seguida, veja [CSV](#/python/arquivos/csv).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/arquivos/caminhos-e-texto.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/arquivos/caminhos-e-texto-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/arquivos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Numa pasta temporária da atividade, grave e releia “ação”. Preveja quais caracteres aparecem.

**Bash**

```bash
cd aulas/caminhos-e-texto/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/caminhos-e-texto/e1
py exemplo.py
```

```python
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory(dir=Path.cwd()) as pasta:
    caminho = Path(pasta) / "mensagem.txt"
    with caminho.open("x", encoding="utf-8") as arquivo:
        arquivo.write("ação")
    with caminho.open("r", encoding="utf-8") as arquivo:
        print(arquivo.read())
```

Saída esperada

```text
ação
```

O modo x cria o arquivo. A escrita termina antes da leitura, que recupera os caracteres em UTF-8. A pasta temporária é nova a cada execução.

## E2 · Altere ou depure

Compare o caminho relativo `mensagem.txt` e seu equivalente absoluto. Qual parte é igual nos dois?

**Bash**

```bash
cd aulas/caminhos-e-texto/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/caminhos-e-texto/e2
py variacao.py
```

```python
from pathlib import Path

relativo = Path("mensagem.txt")
absoluto = relativo.resolve()
print(relativo.is_absolute(), absoluto.is_absolute())
print(absoluto.name)
print(absoluto == Path.cwd() / relativo)
```

Saída esperada

```text
False True
mensagem.txt
True
```

O nome continua mensagem.txt. O endereço absoluto inclui a pasta da atividade e varia por execução. Acrescente print(absoluto) para inspecioná-lo.

## E3 · Resolva

Conte linhas com texto em `anotacoes.txt`, que tem uma linha vazia entre duas com texto. Mostre 2. Arquivo vazio ou só com espaços deve dar 0.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/caminhos-e-texto/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/caminhos-e-texto/e3
py exercicio.py
```

```python
from pathlib import Path

def contar_com_texto(caminho):
    # Conte as linhas úteis enquanto o arquivo estiver aberto.
    raise NotImplementedError

print(contar_com_texto(Path("anotacoes.txt")))
```

Saída esperada

```text
2
```

<details>
<summary>Ver uma pista</summary>

Veja o resultado de `strip()` quando a linha contém só uma quebra.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from pathlib import Path

def contar_com_texto(caminho):
    total = 0
    with caminho.open("r", encoding="utf-8") as arquivo:
        for linha in arquivo:
            if linha.strip():
                total += 1
    return total

print(contar_com_texto(Path("anotacoes.txt")))
```

Saída esperada

```text
2
```

A iteração entrega uma linha por vez. strip() retira a quebra e os espaços das extremidades, então uma linha só com espaços deixa uma string vazia. Zero linhas deixa o total em 0.

No ZIP, a solução está em `aulas/caminhos-e-texto/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/arquivos/csv)

## Fontes

- [Caminhos e abertura de arquivos](https://docs.python.org/3.14/library/pathlib.html#reading-and-writing-files)
- [Leitura e escrita com a instrução with](https://docs.python.org/3.14/tutorial/inputoutput.html#reading-and-writing-files)
