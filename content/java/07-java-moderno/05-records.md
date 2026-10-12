# Records

Muitas classes só carregam dados: um ponto, um produto, uma pessoa. Escrever construtor, getters, `equals`, `hashCode` e `toString` para cada uma dá trabalho. O **record** (Java 16+) gera tudo isso numa linha:

```java
record Ponto(int x, int y) {}
```

```java
Ponto p = new Ponto(3, 4);
System.out.println(p.x());                       // 3
System.out.println(p);                           // Ponto[x=3, y=4]
System.out.println(p.equals(new Ponto(3, 4)));   // true
```

O record gera:

- um construtor com todos os componentes, na ordem em que foram declarados;
- um método de acesso para cada componente, com o **mesmo nome**: `x()` e `y()` (não `getX()`);
- `equals` e `hashCode` que comparam os valores;
- um `toString` legível.

## Imutável

Os componentes viram atributos `private final`. Não há setters, e `p.x = 10` não compila (*x has private access in Ponto*). Para "mudar", crie outro: `new Ponto(10, p.y())`.

## Validando no construtor compacto

```java
record Idade(int valor) {
    Idade {                                   // construtor compacto: sem a lista de parâmetros
        if (valor < 0) {
            throw new IllegalArgumentException("idade negativa: " + valor);
        }
    }
}

new Idade(30);    // ok
new Idade(-1);    // lança IllegalArgumentException: idade negativa: -1
```

O construtor compacto roda antes de os valores serem guardados nos atributos. É o lugar certo para validar.

## Métodos e interfaces

Um record pode ter métodos (inclusive `static`) e implementar interfaces:

```java
record Retangulo(double largura, double altura) {
    double area() {
        return largura * altura;
    }
}

System.out.println(new Retangulo(2, 3).area());   // 6.0
```

> [!NOTE]
> Um record não pode estender outra classe (ele já estende `java.lang.Record`) nem declarar atributos de instância além dos componentes: um atributo `int z;` no corpo dá *field declaration must be static*.
