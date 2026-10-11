# Operadores

## Aritméticos

```java
int a = 7, b = 2;
System.out.println(a + b);   // 9
System.out.println(a - b);   // 5
System.out.println(a * b);   // 14
System.out.println(a / b);   // 3   ← int dividido por int dá int!
System.out.println(a % b);   // 1   ← resto da divisão
System.out.println(7.0 / 2); // 3.5 ← basta um lado ser decimal
```

> [!WARNING]
> Divisão entre dois inteiros **descarta a parte decimal**: `7 / 2` é `3`, e `1 / 2` é `0`.

## Incremento e decremento

```java
int i = 5;
System.out.println(i++); // imprime 5; depois i vira 6  (pós-incremento)
System.out.println(++i); // i vira 7; depois imprime 7  (pré-incremento)
```

O `--` funciona do mesmo jeito, subtraindo 1.

## Atribuição composta

`x += 3` é um atalho para `x = x + 3`. Também existem `-=`, `*=`, `/=` e `%=`.

> [!NOTE]
> A atribuição composta já inclui um cast: com `int x = 10;`, a linha `x += 2.5;` compila e deixa `x` valendo `12`. Já `x = x + 2.5;` não compila, porque o resultado é `double`.

## Relacionais

`==`, `!=`, `>`, `<`, `>=` e `<=` comparam valores e sempre resultam em `boolean`.

## Lógicos

- `&&` (E): se o lado esquerdo for `false`, o lado direito **nem é avaliado** (curto-circuito).
- `||` (OU): se o lado esquerdo for `true`, o lado direito **nem é avaliado** (curto-circuito).
- `!` (NÃO): inverte o valor.
- `&` e `|` também funcionam com `boolean`, mas **sem** curto-circuito: avaliam os dois lados sempre.

```java
String nome = null;
if (nome != null && nome.length() > 3) { // seguro: length() não roda se nome for null
    System.out.println("Nome longo");
}
```

Com `&` no lugar de `&&`, o `nome.length()` rodaria mesmo com `nome` nulo e lançaria `NullPointerException`.

## Ternário

```java
int nota = 75;
String situacao = (nota >= 60) ? "Aprovado" : "Reprovado";
```

## Concatenação com `+`

Quando um dos lados do `+` é uma `String`, o resultado vira texto. A avaliação acontece da esquerda para a direita:

```java
System.out.println(1 + 2 + "3"); // "33": primeiro 1 + 2 = 3, depois 3 + "3"
System.out.println("1" + 2 + 3); // "123": desde o início já é texto
```
