# Conversões entre tipos

## Conversão automática (widening)

Quando o tipo de destino comporta o valor de origem, o Java converte sozinho:

```java
int inteiro = 42;
long grande = inteiro;    // int → long
double decimal = inteiro; // int → double: vale 42.0
```

A ordem é `byte → short → int → long → float → double`. Um `char` também vira `int` automaticamente.

## Conversão manual (cast, ou narrowing)

No caminho contrário pode haver perda de informação, então o Java exige um **cast** explícito:

```java
double preco = 9.99;
int reais = (int) preco;      // 9: o cast TRUNCA, não arredonda
int valor = 130;
byte pequeno = (byte) valor;  // -126: 130 não cabe em byte e "dá a volta"
```

> [!WARNING]
> `(int) 9.99` resulta em `9`, não em `10`. Para arredondar, use `Math.round(9.99)`, que devolve `10` (um `long`).

## Texto ↔ número

```java
int idade = Integer.parseInt("42");
double nota = Double.parseDouble("7.5");
String texto = String.valueOf(42);   // "42"
String outro = "" + 42;              // também vira "42"
```

Se o texto não for um número válido, `Integer.parseInt("abc")` lança `NumberFormatException` enquanto o programa roda.

## Autoboxing

Cada primitivo tem uma **classe empacotadora** (*wrapper*): `int` ↔ `Integer`, `double` ↔ `Double`, `char` ↔ `Character`, `boolean` ↔ `Boolean`, e assim por diante. O Java converte entre eles automaticamente:

```java
Integer caixa = 10;   // autoboxing: int → Integer
int solto = caixa;    // unboxing: Integer → int
```

> [!TIP]
> As coleções do Java (como `ArrayList`) só guardam objetos. Por isso se escreve `ArrayList<Integer>`, e não `ArrayList<int>`.
