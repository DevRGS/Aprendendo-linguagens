# Referência rápida de Python

[Começar pela primeira aula](#/python/inicio/primeira-execucao) · <a href="content/python/kits/python-completo.zip" download>Baixar todos os módulos para o terminal</a> · [Abrir a trilha](#/python)

## Escolha seu ambiente

### Navegador

1. Baixe o caderno da aula. No [JupyterLite](https://jupyterlite.github.io/demo/lab/index.html), use **Upload Files** no painel à esquerda.
2. Abra o arquivo enviado e, se precisar, use **Kernel → Change Kernel** para escolher **Python (Pyodide)**.
3. Execute uma célula com **Shift+Enter**. A preparação cria arquivos em uma pasta própria da atividade. Em uma entrada interativa, digite uma resposta de cada vez e pressione Enter.
4. Salve com **Ctrl+S** ou **File → Save Notebook**. Para guardar no seu computador, clique com o botão direito no caderno ou resultado no painel de arquivos e selecione **Download**.
5. Para recomeçar, reinicie o kernel e rode a preparação desde a primeira célula. O caderno resolvido usa entradas de referência para repetir os resultados. As alterações que você deseja conservar podem ser baixadas antes da reinicialização.

O laboratório é externo. Para exercícios com dados, precisa carregar as bibliotecas e ter acesso ao armazenamento da sessão no navegador. Se não abrir, tente uma sessão normal com carregamento de arquivos permitido ou use o ZIP da aula no terminal. Em um caderno vazio, rode `print("Olá, mundo!")` para confirmar o kernel.

No piloto, o laboratório usou JupyterLite 0.8.0 e kernel Pyodide com Python 3.14.2, NumPy 2.4.3, pandas 3.0.2 e Matplotlib 3.10.8. Para consultar a versão do kernel no caderno, execute `import sys; print(sys.version)`.

[Arquivos no JupyterLab](https://jupyterlab.readthedocs.io/en/stable/user/files.html#uploading-and-downloading) · [Arquivos no kernel do JupyterLite](https://jupyterlite.readthedocs.io/en/stable/howto/content/python.html)

### Terminal

Instale Python 3.14 pelo [site oficial](https://www.python.org/downloads/) ou pelo gerenciador de pacotes do seu sistema. No Windows, abra um PowerShell novo e rode `py --version`. Se só `python --version` reconhecer a instalação, use `python` no lugar de `py`. Em Linux ou macOS, rode `python3 --version` e use `python3.14` onde o comando sem versão apontar para outra instalação.

O shell executa comandos como `python3 exemplo.py`. O prompt `>>>` indica que você está dentro do interpretador interativo, onde pode digitar código Python. Para voltar ao shell, use `exit()`. Os exemplos em arquivo devem ser salvos como texto UTF-8 com extensão `.py`. Extraia o ZIP antes de entrar na pasta da atividade.

Em módulos que pedem bibliotecas, faça a preparação na raiz extraída. A `.venv` tem um interpretador e seus próprios pacotes. Use esse mesmo executável para instalar e rodar.

| Ação | Bash | PowerShell |
|---|---|---|
| Criar | `python3.14 -m venv .venv` | `py -3.14 -m venv .venv` |
| Instalar | `.venv/bin/python -m pip install -r requirements.txt` | `.\.venv\Scripts\python.exe -m pip install -r requirements.txt` |
| Conferir | `.venv/bin/python -m pip list` | `.\.venv\Scripts\python.exe -m pip list` |

Se faltar `venv`, confira se o pacote correspondente à sua versão do Python está instalado. Se o script informar `ModuleNotFoundError`, reveja o executável e a instalação do kit. Se informar que um arquivo está ausente, confira se entrou na pasta da atividade extraída. Os blocos de comandos começam na raiz do módulo, onde fica o README.

[Ambientes virtuais na documentação Python](https://docs.python.org/3.14/library/venv.html) · [Guia da PyPA](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)

## Consulte por assunto

| Se você precisa de… | Retome… |
|---|---|
| Exibir texto, converter entrada ou entender uma exceção de sintaxe | [Primeira execução](#/python/inicio/primeira-execucao), [Entrada e erros](#/python/inicio/entrada-e-erros) |
| Escolher condições, iterar, filtrar ou contar registros | [Condições](#/python/fluxo/condicoes), [Laços e acumuladores](#/python/fluxo/for-e-acumuladores), [Dicionários](#/python/registros/dicionarios) |
| Separar cálculos de entrada e saída | [Funções e retorno](#/python/funcoes/parametros-e-retorno), [Composição](#/python/funcoes/composicao) |
| Ler CSV, salvar JSON e tratar erros | [CSV](#/python/arquivos/csv), [JSON](#/python/arquivos/json), [Exceções](#/python/arquivos/excecoes) |
| Organizar módulos, classes e testes | [Módulos e imports](#/python/projetos/modulos-e-imports), [Dataclasses](#/python/objetos/dataclasses), [Testes unitários](#/python/qualidade/testes-unitarios) |
| Percorrer um recurso de cada vez e fechá-lo | [Geradores](#/python/protocolos/geradores), [Gerenciadores de contexto](#/python/protocolos/gerentes-de-contexto) |
| Comparar números, eixos e formas | [Tolerância e escalas](#/python/matematica/precisao-e-escalas), [Broadcasting](#/python/numpy/eixos-e-broadcasting), [Produto matricial](#/python/numpy/produto-matricial) |
| Tratar faltantes ou conferir junções | [Agregação](#/python/pandas/agregar), [Junção de tabelas](#/python/pandas/juntar-tabelas), [Auditoria](#/python/exploracao/qualidade-dos-dados) |
| Preparar e medir uma referência para ML | [Partições](#/python/preparacao-ml/particoes), [Ajuste de parâmetros](#/python/preparacao-ml/ajustar-e-aplicar), [Erro absoluto](#/python/preparacao-ml/referencia-e-erro) |

## Confira o que o resultado significa

- `SyntaxError` indica que o Python não conseguiu analisar o código. Confira aspas, parênteses e a linha precedente. `NameError` indica que um nome não foi encontrado durante a execução.
- `input()` devolve texto. Use `int()` para converter um inteiro e preserve o valor zero quando ele for válido para o problema.
- Em uma matriz de observações por linha, `axis=0` ao calcular a média agrega linhas e devolve uma média por coluna. `axis=1` calcula por linha. Confira a propriedade `shape` antes de combinar resultados.
- Ao limpar tabelas, separe ausentes, zeros, duplicatas exatas e conflitos de chave. Registre as contagens e faça a junção sobre a chave declarada.
- Ajuste mediana, extremos e demais parâmetros apenas no treino. Aplique os mesmos valores em validação e teste. Use validação para escolher e teste para medir após congelar a escolha.
- `X` contém atributos com forma `(n, p)`. `y` contém um alvo por observação, com forma `(n,)`. Preserve IDs e ordem para conferir o alinhamento.

## Retome um marco

| Entrega | Se precisar praticar de novo |
|---|---|
| [Resumir um lote](#/python/registros/resumo-de-lote) | Use dois temas, um deles com minutos zero, e confira a quantidade e a soma separadamente. |
| [Organizar um pipeline](#/python/projetos/pipeline-de-arquivos) | Atualize um valor no CSV e calcule à mão o novo total antes de rodar. |
| [Calcular um produto matricial](#/python/numpy/produto-matricial) | Use três linhas e dois pesos. Calcule a pontuação de cada linha e compare a forma. |
| [Reproduzir o projeto final](#/python/projeto/reproduzir) | Troque as datas de viagens que estão em partições diferentes. Confira as partições e recalcule a mediana do treino. |
