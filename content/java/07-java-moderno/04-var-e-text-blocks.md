# var e text blocks

## `var`: o compilador descobre o tipo (Java 10+)

```java
var nome = "Ana";                                  // String
var idade = 30;                                    // int
var notas = new ArrayList<Double>();               // ArrayList<Double>
var mapa = new HashMap<String, List<Integer>>();   // HashMap<String, List<Integer>>
```

O tipo continua **fixo**: `var` só poupa você de escrevê-lo. Depois de `var idade = 30;`, a linha `idade = "trinta";` não compila (*incompatible types: String cannot be converted to int*).

Regras:

- Só para **variáveis locais** (dentro de métodos), inclusive no `for`: `for (var i = 0; i < 3; i++)`. Atributos e parâmetros de método não aceitam `var`.
- A variável precisa de **valor inicial**: `var x;` não compila.
- O valor inicial não pode ser só `null`: `var x = null;` não compila, porque `null` não diz qual é o tipo.

> [!TIP]
> Use `var` quando o tipo fica óbvio pelo lado direito, como em `var lista = new ArrayList<String>();`. Se quem lê precisar adivinhar o tipo, escreva o tipo.

## Text blocks: textos de várias linhas (Java 15+)

```java
String json = """
    {
      "nome": "Ana",
      "idade": 30
    }
    """;
System.out.print(json);
```

Saída:

```text
{
  "nome": "Ana",
  "idade": 30
}
```

- O texto começa na linha **seguinte** às aspas de abertura `"""`.
- O recuo comum a todas as linhas (contando a linha das aspas de fechamento) é removido; o recuo **a mais** fica.
- Aspas comuns dentro do texto não precisam de `\"`.
- Como o `"""` de fechamento está numa linha própria, o texto termina com uma quebra de linha.
