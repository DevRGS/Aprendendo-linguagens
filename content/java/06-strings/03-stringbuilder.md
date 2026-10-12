# StringBuilder

Como `String` é imutável, cada `+` cria uma String nova. Num laço, isso significa criar e jogar fora muitos objetos:

```java
String texto = "";
for (int i = 1; i <= 3; i++) {
    texto += i + " ";        // uma String nova a cada volta
}
```

O **`StringBuilder`** é um texto **mutável**: ele altera o próprio objeto.

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 3; i++) {
    sb.append(i).append(" ");
}
String resultado = sb.toString().trim();
System.out.println(resultado);   // 1 2 3
```

## Métodos principais

| Método | O que faz |
|---|---|
| `append(x)` | acrescenta no fim (aceita textos, números, `char`...) |
| `insert(i, x)` | insere na posição `i` |
| `reverse()` | inverte o texto |
| `deleteCharAt(i)` | remove o caractere da posição `i` |
| `length()` | quantos caracteres há |
| `toString()` | gera a `String` final |

```java
StringBuilder sb = new StringBuilder("Java");
sb.append("!");          // Java!
sb.insert(0, "Oi, ");    // Oi, Java!
sb.reverse();            // !avaJ ,iO
System.out.println(sb);  // !avaJ ,iO
```

Os métodos devolvem o próprio `StringBuilder`, por isso dá para encadear chamadas: `sb.append("a").append("b")`.

> [!TIP]
> Para juntar poucos pedaços numa linha só, o `+` é mais legível e o compilador já cuida da eficiência. Reserve o `StringBuilder` para textos montados aos poucos, em laços.

> [!NOTE]
> `StringBuilder` não sobrescreve `equals`: dois builders com o mesmo texto não são "iguais". Para comparar, converta antes: `sb1.toString().equals(sb2.toString())`.
