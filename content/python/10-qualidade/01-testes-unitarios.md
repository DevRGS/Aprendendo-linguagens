# Testes unitários com unittest

Verifique a conversão de uma hora e cinco minutos. Antes de chamar sua função, calcule de forma independente o resultado esperado. Retome [retorno de funções](#/python/funcoes/parametros-e-retorno) e [exceções](#/python/arquivos/excecoes).

Um teste prepara uma entrada, executa a ação e compara o resultado com uma previsão. Use `unittest.TestCase` e nomes de métodos que comecem com `test_`. `assertEqual` compara o valor obtido ao esperado. `assertRaises` confere uma exceção prometida pelo contrato. O `TestLoader` carrega os métodos da classe para uma suíte e `TextTestRunner` executa a suíte e devolve o relatório.

Use a suíte explícita de cada exercício, tanto no kit como no caderno. Assim, os argumentos do kernel não entram na execução. Aqui o runner grava o relatório em memória para evitar que o tempo variável faça parte da saída esperada. Para inspecioná-lo, acrescente `print(registro.getvalue())`. Qual borda detecta um retorno que descarta minutos restantes? Depois, veja [depuração](#/python/qualidade/depuracao).

## Prepare a prática

- <a href="https://jupyterlite.github.io/demo/lab/index.html" target="_blank" rel="noopener noreferrer">Praticar no navegador</a>
- <a href="content/python/praticas/qualidade/testes-unitarios.ipynb" download>Baixar o caderno desta aula</a>
- <a href="content/python/praticas/qualidade/testes-unitarios-resolvido.ipynb" download>Baixar o caderno resolvido</a>
- <a href="content/python/kits/qualidade.zip" download>Baixar para o terminal</a>

Escolha um percurso. No navegador, use **Upload Files** para carregar o caderno baixado. Abra-o, selecione **Python (Pyodide)**, aguarde o kernel e execute célula por célula com **Shift+Enter**. Quando houver entrada, digite no campo da célula e pressione Enter.

No terminal, extraia o ZIP, abra um terminal na raiz extraída e leia o README do kit. Os blocos de comando partem dessa raiz. Volte à raiz antes do próximo exercício. No Windows, use python no lugar de py se só o primeiro comando localizar a instalação.

[Preparação, versões e solução de problemas](#/python/referencia)

## E1 · Preveja e execute

Escreva o teste de minutos(1, 5) com esperado 65. Carregue a classe de teste, execute um caso e confira a contagem.

**Bash**

```bash
cd aulas/testes-unitarios/e1
python3 exemplo.py
```

**PowerShell**

```powershell
cd aulas/testes-unitarios/e1
py exemplo.py
```

```python
import io
import unittest

def minutos(horas, restantes):
    return horas * 60 + restantes

class TestesMinutos(unittest.TestCase):
    def test_hora_e_minutos(self):
        self.assertEqual(minutos(1, 5), 65)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestesMinutos)
registro = io.StringIO()
resultado = unittest.TextTestRunner(stream=registro).run(suite)

print("casos:", resultado.testsRun, "sucesso:", resultado.wasSuccessful())
```

Saída esperada

```text
casos: 1 sucesso: True
```

O teste usa 65 calculado de forma independente. O resultado da suíte informa quantos métodos rodaram e se todos passaram.

## E2 · Altere ou depure

Teste intencionalmente uma implementação que ignora os minutos restantes. Use a entrada de borda (0, 1) e veja se a falha é detectada.

**Bash**

```bash
cd aulas/testes-unitarios/e2
python3 variacao.py
```

**PowerShell**

```powershell
cd aulas/testes-unitarios/e2
py variacao.py
```

```python
import io
import unittest

def minutos(horas, restantes):
    return horas * 60

class TestesMinutos(unittest.TestCase):
    def test_um_minuto(self):
        self.assertEqual(minutos(0, 1), 1)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestesMinutos)
registro = io.StringIO()
resultado = unittest.TextTestRunner(stream=registro).run(suite)

print("falhas:", len(resultado.failures), "sucesso:", resultado.wasSuccessful())
```

Saída esperada

```text
falhas: 1 sucesso: False
```

A implementação errada devolve 0. A previsão do teste é 1. Uma diferença de valor rende falha. Corrija a função acrescentando os minutos restantes e espere zero falhas.

## E3 · Resolva

Crie três testes de minutos(horas, restantes), para (1, 5), (0, 0) e (0, 60). O domínio tem horas inteiras não negativas e minutos restantes entre 0 e 59. Caso inválido deve levantar ValueError, verificado com assertRaises.

Complete a célula do caderno ou edite o arquivo exercicio.py da pasta abaixo antes de rodar.

**Bash**

```bash
cd aulas/testes-unitarios/e3
python3 exercicio.py
```

**PowerShell**

```powershell
cd aulas/testes-unitarios/e3
py exercicio.py
```

```python
import io
import unittest

def minutos(horas, restantes):
    # Implemente o contrato de conversão.
    raise NotImplementedError

class TestesMinutos(unittest.TestCase):
    def test_conversao(self):
        self.assertEqual(minutos(1, 5), 65)

    # Escreva os testes de zero e de minutos inválidos.


suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestesMinutos)
registro = io.StringIO()
resultado = unittest.TextTestRunner(stream=registro).run(suite)

print("casos:", resultado.testsRun, "sucesso:", resultado.wasSuccessful())
```

Saída esperada

```text
casos: 3 sucesso: True
```

<details>
<summary>Ver uma pista</summary>

Um método de teste para cada entrada. Use `with self.assertRaises(ValueError):` ao testar o caso rejeitado.

</details>

<details>
<summary>Conferir solução comentada</summary>

```python
import io
import unittest

def minutos(horas, restantes):
    if type(horas) is not int or type(restantes) is not int:
        raise ValueError("horas e minutos devem ser inteiros")
    if horas < 0 or not 0 <= restantes <= 59:
        raise ValueError("horas ou minutos fora do intervalo")
    return horas * 60 + restantes

class TestesMinutos(unittest.TestCase):
    def test_conversao(self):
        self.assertEqual(minutos(1, 5), 65)

    def test_limite_inferior(self):
        self.assertEqual(minutos(0, 0), 0)

    def test_minutos_fora_do_intervalo(self):
        with self.assertRaises(ValueError):
            minutos(0, 60)


suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestesMinutos)
registro = io.StringIO()
resultado = unittest.TextTestRunner(stream=registro).run(suite)

print("casos:", resultado.testsRun, "sucesso:", resultado.wasSuccessful())
```

Saída esperada

```text
casos: 3 sucesso: True
```

Zero horas e zero minutos formam a borda inferior válida. Sessenta minutos restantes violam o contrato. O teste passa quando a chamada levanta a classe esperada. Confira sempre testsRun para detectar a suíte vazia.

No ZIP, a solução está em `aulas/testes-unitarios/e3-resolvido/solucao.py`.

</details>

[Próxima etapa](#/python/qualidade/depuracao)

## Fontes

- [Testes unitários e asserções](https://docs.python.org/3.14/library/unittest.html#test-cases)
- [Suíte e runner](https://docs.python.org/3.14/library/unittest.html#loading-and-running-tests)
