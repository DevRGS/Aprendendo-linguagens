# Condicionais: if e switch

## if / else if / else

```java
int nota = 85;
if (nota >= 90) {
    System.out.println("A");
} else if (nota >= 70) {
    System.out.println("B");   // este bloco roda
} else {
    System.out.println("C");
}
```

Só **um** dos blocos é executado: o primeiro cuja condição for verdadeira.

> [!TIP]
> Use sempre chaves `{ }`, mesmo com uma linha só. Sem chaves, apenas a primeira instrução fica "dentro" do `if`, e isso causa bugs difíceis de ver.

## switch clássico (com `:`)

```java
int dia = 2;
switch (dia) {
    case 1:
        System.out.println("Domingo");
        break;
    case 2:
        System.out.println("Segunda");
        break;
    default:
        System.out.println("Outro dia");
}
```

> [!CAUTION]
> **Fall-through:** sem `break`, a execução continua nos `case` seguintes, mesmo que o valor não combine com eles. É uma das pegadinhas mais famosas do Java.

```java
int x = 2;
switch (x) {
    case 1: System.out.print("A");
    case 2: System.out.print("B");
    case 3: System.out.print("C");
        break;
    default: System.out.print("D");
}
// imprime BC
```

## switch com seta (Java 14+)

A forma moderna usa `->`: não tem fall-through e pode **produzir um valor**:

```java
int dia = 1;
String nome = switch (dia) {
    case 1 -> "Domingo";
    case 7 -> "Sábado";
    default -> "Dia útil";
};
System.out.println(nome); // Domingo
```

O `switch` aceita `int` e os inteiros menores (`byte`, `short`), `char`, `String`, enums e as classes empacotadoras desses tipos. Ele **não** aceita os primitivos `long`, `float`, `double` nem `boolean`.

> [!NOTE]
> No Java 21, com *pattern matching* (assunto do módulo Java Moderno), o `switch` também aceita qualquer objeto, como `Object` ou `Long`, desde que os `case` usem padrões de tipo, como `case Long l ->`.
