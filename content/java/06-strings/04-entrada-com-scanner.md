# Lendo o teclado com Scanner

```java
import java.util.Scanner;

public class Cadastro {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nome: ");
        String nome = sc.nextLine();

        System.out.print("Idade: ");
        int idade = sc.nextInt();

        System.out.println(nome + " tem " + idade + " anos.");
    }
}
```

`System.in` é a entrada padrão (o teclado, no terminal). O `Scanner` divide o que foi digitado em pedaços e converte cada um:

| Método | Lê |
|---|---|
| `nextLine()` | a linha inteira, com os espaços |
| `next()` | uma palavra (até o próximo espaço) |
| `nextInt()` | um `int` |
| `nextDouble()` | um `double` |
| `nextBoolean()` | `true` ou `false` |

## Armadilha 1: `nextInt()` seguido de `nextLine()`

```java
System.out.print("Idade: ");
int idade = sc.nextInt();        // a pessoa digita 25 e Enter
System.out.print("Cidade: ");
String cidade = sc.nextLine();   // vem VAZIA!
```

O `nextInt()` lê o `25`, mas deixa na entrada a quebra de linha do Enter. O `nextLine()` seguinte encontra essa quebra e devolve o que havia antes dela: uma String vazia. A solução é descartar a quebra com um `nextLine()` extra:

```java
int idade = sc.nextInt();
sc.nextLine();                   // descarta o Enter que sobrou
String cidade = sc.nextLine();   // agora lê a cidade
```

Outra saída é ler tudo com `nextLine()` e converter: `int idade = Integer.parseInt(sc.nextLine());`.

## Armadilha 2: o separador decimal

O `Scanner` segue o idioma do sistema. Num computador em português do Brasil, `nextDouble()` espera **vírgula** (`7,5`); se a pessoa digitar `7.5`, ele lança `InputMismatchException`.

Para aceitar o ponto em qualquer computador, defina o idioma do `Scanner`:

```java
import java.util.Locale;

Scanner sc = new Scanner(System.in);
sc.useLocale(Locale.US);         // agora nextDouble() espera 7.5
```

## Entrada inválida

Se a pessoa digitar `abc` quando o programa espera um número, `nextInt()` lança `InputMismatchException`. Para conferir antes:

```java
if (sc.hasNextInt()) {
    int n = sc.nextInt();
    System.out.println("Número: " + n);
} else {
    System.out.println("Isso não é um número.");
}
```

> [!TIP]
> Para testar sem digitar, o `Scanner` também lê de uma String: `new Scanner("25\nRecife\n")` se comporta como se alguém digitasse `25`, Enter, `Recife`, Enter.

> [!NOTE]
> Não feche um `Scanner` de `System.in` no meio do programa: `sc.close()` fecha também o `System.in`, e nada mais consegue ler o teclado depois. Em programas pequenos, deixe-o aberto.
