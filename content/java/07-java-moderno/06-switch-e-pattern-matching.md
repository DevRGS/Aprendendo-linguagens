# switch moderno e pattern matching

## `switch` como expressão (Java 14+)

No módulo Fundamentos você viu o `switch` com seta, que devolve um valor. Mais três detalhes:

```java
int dia = 3;
String tipo = switch (dia) {
    case 1, 7 -> "fim de semana";              // vários valores num case
    case 2, 3, 4, 5, 6 -> {
        String t = "dia útil";
        yield t;                                // devolve o valor de um bloco
    }
    default -> throw new IllegalArgumentException("dia inválido: " + dia);
};
System.out.println(tipo);   // dia útil
```

- `case 1, 7 ->` junta vários valores num só `case`.
- Dentro de um bloco `{ }`, quem devolve o valor é o `yield`. Um `return` ali não compila: *attempt to return out of a switch expression*.
- Um `switch` usado como expressão precisa cobrir **todos** os valores possíveis. Com `int`, isso exige um `default`; sem ele, o `javac` acusa *the switch expression does not cover all possible input values*.

## Pattern matching no `instanceof` (Java 16+)

Antes, testar o tipo e converter eram duas etapas:

```java
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}
```

Agora o teste já cria a variável:

```java
if (obj instanceof String s) {
    System.out.println(s.length());
}

if (obj instanceof String s && s.length() > 3) {   // s já vale depois do &&
    System.out.println(s.toUpperCase());
}
```

## Padrões no `switch` (Java 21)

O `switch` aceita qualquer objeto e escolhe o `case` pelo **tipo**. Com `when`, o `case` ganha uma condição extra:

```java
static String descrever(Object o) {
    return switch (o) {
        case null -> "nulo";
        case Integer i when i > 0 -> "inteiro positivo: " + i;
        case Integer i -> "inteiro: " + i;
        case String s -> "texto com " + s.length() + " letras";
        default -> "outra coisa";
    };
}

System.out.println(descrever(5));      // inteiro positivo: 5
System.out.println(descrever(-2));     // inteiro: -2
System.out.println(descrever("oi"));   // texto com 2 letras
System.out.println(descrever(3.5));    // outra coisa
System.out.println(descrever(null));   // nulo
```

- Os `case` são testados de cima para baixo. Um `case` mais genérico antes de um mais específico não compila: com `case CharSequence cs` antes de `case String s`, o `javac` acusa *this case label is dominated by a preceding case label*.
- Sem `case null`, um `switch` sobre `null` lança `NullPointerException`.

## `sealed`: o compilador conhece todos os casos

Uma interface (ou classe) `sealed` (Java 17+) lista quem pode implementá-la. Com isso, um `switch` de padrões sabe quando cobriu todos os casos e dispensa o `default`:

```java
sealed interface Forma permits Circulo, Quadrado {}
record Circulo(double raio) implements Forma {}
record Quadrado(double lado) implements Forma {}

static double area(Forma f) {
    return switch (f) {
        case Circulo c -> Math.PI * c.raio() * c.raio();
        case Quadrado q -> q.lado() * q.lado();
    };   // sem default: os dois case cobrem todas as formas
}
```

Se alguém acrescentar uma forma nova ao `permits` e esquecer de tratá-la, o `switch` deixa de compilar, em vez de falhar com o programa já rodando.

## Padrões de record (Java 21)

Um padrão pode "abrir" um record e pegar os componentes direto:

```java
record Ponto(int x, int y) {}

static String onde(Object o) {
    return switch (o) {
        case Ponto(int x, int y) when x == 0 && y == 0 -> "na origem";
        case Ponto(int x, int y) -> "em (" + x + ", " + y + ")";
        default -> "não é um ponto";
    };
}

System.out.println(onde(new Ponto(0, 0)));   // na origem
System.out.println(onde(new Ponto(2, 5)));   // em (2, 5)
```

O mesmo vale no `instanceof`: `if (o instanceof Ponto(int x, int y)) { ... }`.
