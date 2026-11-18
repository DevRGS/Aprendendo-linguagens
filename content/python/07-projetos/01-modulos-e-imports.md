# Módulos e imports locais

Faça um segundo arquivo usar a conversão escrita no primeiro. Preveja `medidas.minutos(1, 5)` e retome [funções](#/python/funcoes/parametros-e-retorno).

Um módulo é, aqui, um arquivo Python com definições reutilizáveis. `import medidas` disponibiliza o objeto módulo. Seu espaço de nomes contém `minutos`, acessível como `medidas.minutos`. O Python procura módulos pelo nome. No terminal, a pasta do script entra na busca no uso normal. No caderno, a preparação disponibiliza as pastas de exercício para importação.

Defina funções no auxiliar e chame-as no consumidor. Um kernel pode reutilizar um módulo importado sem reler o arquivo. Após editar um auxiliar no navegador, salve e execute novamente a preparação desta etapa e a célula que importa o código. Isso reutiliza a pasta desta atividade. No terminal, rodar o script novamente inicia outro processo. Por que o nome do seu arquivo pode mudar um import? Em seguida, veja [ambientes e pacotes](#/python/projetos/ambiente-e-pacotes).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/projetos/modulos-e-imports.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/projetos/modulos-e-imports-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/projetos.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

Prepare a pasta .venv conforme o README do kit antes de executar os comandos.

## E1 · Preveja e execute

Confira `medidas.py` junto da atividade. Importe-o e use a função com 1 hora e 5 minutos.

**Bash**

```bash
cd aulas/modulos-e-imports/e1
../../../.venv/bin/python exemplo.py
```

**PowerShell**

```powershell
cd aulas/modulos-e-imports/e1
..\..\..\.venv\Scripts\python.exe exemplo.py
```

```python
import medidas

duracao = medidas.minutos(1, 5)
print(duracao)
```

Saída esperada

```text
65
```

O ponto seleciona a função no espaço de nomes do módulo. A chamada devolve 65.

## E2 · Altere ou depure

Investigue qual arquivo chamado csv o Python encontra se procurar primeiro na pasta `sombra`. Aqui a busca não substitui o módulo csv carregado no kernel.

**Bash**

```bash
cd aulas/modulos-e-imports/e2
../../../.venv/bin/python variacao.py
```

**PowerShell**

```powershell
cd aulas/modulos-e-imports/e2
..\..\..\.venv\Scripts\python.exe variacao.py
```

```python
from importlib.machinery import PathFinder
from pathlib import Path

pasta = Path("sombra").resolve()
resultado = PathFinder.find_spec("csv", [str(pasta)])
print(Path(resultado.origin).parent == pasta)
print(Path(resultado.origin).name)
```

Saída esperada

```text
True
csv.py
```

O buscador encontra csv.py no caminho indicado. Na execução comum, a pasta do script pode preceder a biblioteca padrão na busca, se o módulo ainda não estiver carregado. Renomeie o arquivo local para um nome descritivo e reinicie a sessão.

## E3 · Resolva

Escreva `minutos(h, m)` e `segundos(m)` no auxiliar `conversoes.py`. Importe as duas funções em um segundo arquivo, ou na célula do caderno, e mostre 65 e 3900 com (1, 5). A importação deve ser silenciosa, e zero minutos devem resultar em 0 segundos.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/modulos-e-imports/e3
../../../.venv/bin/python exercicio.py
```

**PowerShell**

```powershell
cd aulas/modulos-e-imports/e3
..\..\..\.venv\Scripts\python.exe exercicio.py
```

```python
# Defina ou reescreva as duas funções em conversoes.py.
from conversoes import minutos, segundos

# Passe o retorno da primeira para a segunda.
```

Saída esperada

```text
65 3900
0
```

<details>
<summary>Ver uma pista</summary>

Use return em cada função auxiliar. Reserve print para o consumidor.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
from contextlib import redirect_stdout
from io import StringIO

durante_import = StringIO()
with redirect_stdout(durante_import):
    from conversoes import minutos, segundos

assert durante_import.getvalue() == ""
duracao = minutos(1, 5)
print(duracao, segundos(duracao))
print(segundos(minutos(0, 0)))
```

Saída esperada

```text
65 3900
0
```

O auxiliar define as duas funções. O consumidor decide quando chamar e imprimir. O desvio de stdout testa o silêncio do import. Reinicie o kernel para confirmar um primeiro import após cada edição.

No ZIP, a solução está em `aulas/modulos-e-imports/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/projetos/ambiente-e-pacotes)

## Fontes

- [Módulos e caminhos de busca](https://docs.python.org/3.14/tutorial/modules.html#the-module-search-path)
- [Busca por PathFinder](https://docs.python.org/3.14/library/importlib.html#importlib.machinery.PathFinder)
