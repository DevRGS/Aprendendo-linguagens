# Métodos de String

As posições de uma String começam em **0**, como nos arrays:

```text
P  r  o  g  r  a  m  a  r
0  1  2  3  4  5  6  7  8
```

## Medir e acessar

| Método | Exemplo | Resultado |
|---|---|---|
| `length()` | `"Programar".length()` | `9` |
| `charAt(i)` | `"Programar".charAt(3)` | `'g'` |
| `isEmpty()` | `"".isEmpty()` | `true` |
| `isBlank()` (Java 11+) | `"   ".isBlank()` | `true` |

`isEmpty()` só é `true` para a String de tamanho zero; `"   ".isEmpty()` é `false`.

## Procurar

| Método | Exemplo | Resultado |
|---|---|---|
| `indexOf(x)` | `"banana".indexOf("na")` | `2` (a primeira ocorrência) |
| `lastIndexOf(x)` | `"banana".lastIndexOf("na")` | `4` |
| `indexOf(x)` | `"banana".indexOf("x")` | `-1` (não achou) |
| `contains(x)` | `"banana".contains("nan")` | `true` |
| `startsWith(x)` | `"banana".startsWith("ba")` | `true` |
| `endsWith(x)` | `"banana".endsWith("na")` | `true` |

## Recortar e transformar

| Método | Exemplo | Resultado |
|---|---|---|
| `substring(i, f)` | `"Programar".substring(0, 3)` | `"Pro"` (a posição `f` não entra) |
| `substring(i)` | `"Programar".substring(3)` | `"gramar"` |
| `toUpperCase()` | `"Oi".toUpperCase()` | `"OI"` |
| `toLowerCase()` | `"Oi".toLowerCase()` | `"oi"` |
| `trim()` | `"  Oi  ".trim()` | `"Oi"` |
| `strip()` (Java 11+) | `"  Oi  ".strip()` | `"Oi"` |
| `replace(a, b)` | `"banana".replace("a", "o")` | `"bonono"` |
| `repeat(n)` (Java 11+) | `"ab".repeat(3)` | `"ababab"` |

> [!NOTE]
> `trim()` e `strip()` tiram espaços, tabulações e quebras de linha das pontas. A diferença é que `strip()` também reconhece os espaços especiais do Unicode, como o *em space* (` `), que o `trim()` deixa passar.

## Dividir e juntar

```java
String[] partes = "Ana;Bia;Caio".split(";");
System.out.println(partes.length);    // 3
System.out.println(partes[1]);        // Bia

String junto = String.join(", ", partes);
System.out.println(junto);            // Ana, Bia, Caio
```

`String.join` também aceita uma lista: `String.join(", ", List.of("Ana", "Bia"))`.

> [!CAUTION]
> `split` recebe uma **expressão regular**, em que alguns caracteres têm significado especial. O ponto, por exemplo, quer dizer "qualquer caractere": `"a.b.c".split(".")` devolve um array **vazio**. Para dividir no ponto de verdade, escape-o: `"a.b.c".split("\\.")` devolve `[a, b, c]`.

## Montando textos com `format`

```java
String msg = String.format("%s tirou %.2f", "Ana", 8.456);
System.out.println(msg);
// num computador em português: Ana tirou 8,46
// num computador em inglês:    Ana tirou 8.46
```

- `%s` recebe um texto, `%d` um número inteiro, `%.2f` um decimal com 2 casas (arredondado) e `%n` uma quebra de linha.
- O separador decimal segue o idioma do sistema. Para fixá-lo, informe o idioma: `String.format(Locale.US, "%.2f", 8.456)` dá `8.46`.
- Desde o Java 15, também dá para escrever `"%s tirou %.2f".formatted("Ana", 8.456)`.
