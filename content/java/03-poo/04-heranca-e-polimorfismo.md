# Herança e polimorfismo

## Herança com `extends`

Quando várias classes têm dados e comportamentos em comum, a parte comum pode ficar numa **superclasse**. As **subclasses** herdam tudo o que não é `private` e acrescentam o que é delas.

```java
class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }

    String som() {
        return "...";
    }

    String apresentar() {
        return nome + " faz " + som();
    }
}

class Cachorro extends Animal {
    Cachorro(String nome) {
        super(nome);           // chama o construtor de Animal
    }

    @Override
    String som() {
        return "Au";
    }
}
```

```java
Cachorro rex = new Cachorro("Rex");
System.out.println(rex.apresentar());  // Rex faz Au
```

- Em Java, uma classe estende **uma única** classe: `class C extends A, B` não compila.
- Uma classe que não estende nenhuma outra estende `Object` sem você escrever nada. Por isso todo objeto tem métodos como `toString()`.

## `super`

- `super(...)` chama o construtor da superclasse. No Java 21, precisa ser a **primeira instrução** do construtor.
- Se você não escrever, o compilador coloca `super()`, sem argumentos. Quando a superclasse não tem construtor sem parâmetros (como `Animal` acima), a subclasse **precisa** chamar `super(...)` com os argumentos; senão, o código não compila.
- `super.metodo()` chama a versão da superclasse de um método sobrescrito.

Como o construtor da superclasse roda primeiro, a construção vai "de cima para baixo":

```java
class A {
    A() { System.out.print("A"); }
}

class B extends A {
    B() { System.out.print("B"); }
}

new B();   // imprime AB
```

## Sobrescrita e `@Override`

A subclasse pode **sobrescrever** um método herdado: mesmo nome, mesmos parâmetros, comportamento novo. A anotação `@Override` é opcional, mas pede ao compilador que confira: se você errar o nome (`Som()` em vez de `som()`), ele acusa *method does not override or implement a method from a supertype*.

```java
class Gato extends Animal {
    Gato(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return "Miau";
    }

    @Override
    public String toString() {        // sobrescreve o toString() de Object
        return "Gato " + nome;
    }
}

class Filhote extends Cachorro {
    Filhote(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return super.som() + " (fininho)";   // usa a versão de Cachorro
    }
}
```

```java
System.out.println(new Gato("Mimi"));          // Gato Mimi
System.out.println(new Filhote("Toby").som());  // Au (fininho)
```

> [!NOTE]
> O `toString()` de `Object` é `public`, então a versão sobrescrita também precisa ser `public`. Ao sobrescrever, não dá para diminuir o acesso: sem o `public`, o `javac` acusa *attempting to assign weaker access privileges; was public*.

## Sobrecarga não é sobrescrita

**Sobrecarga** (*overload*) é ter métodos com o mesmo nome e parâmetros diferentes; o compilador escolhe pela lista de argumentos.

```java
class Calculadora {
    int somar(int a, int b) { return a + b; }
    double somar(double a, double b) { return a + b; }
    int somar(int a, int b, int c) { return a + b + c; }
}

Calculadora calc = new Calculadora();
System.out.println(calc.somar(1, 2));     // 3
System.out.println(calc.somar(1.5, 2));   // 3.5
System.out.println(calc.somar(1, 2, 3));  // 6
```

## Polimorfismo

Uma variável do tipo da superclasse pode guardar um objeto de qualquer subclasse. Na hora de chamar um método sobrescrito, vale o **objeto real**, não o tipo da variável:

```java
Animal[] animais = { new Cachorro("Rex"), new Gato("Mimi"), new Animal("Bicho") };
for (Animal a : animais) {
    System.out.println(a.som());
}
// Au
// Miau
// ...
```

O mesmo laço funciona para qualquer tipo de animal, inclusive os que ainda vão ser criados.

> [!WARNING]
> Pela variável `Animal a`, só dá para chamar o que `Animal` declara. Se só `Cachorro` tem o método `buscarBolinha()`, então `a.buscarBolinha()` não compila (*cannot find symbol*), mesmo que o objeto seja um cachorro.

Para usar o que só a subclasse tem, converta a referência (*cast*), de preferência depois de conferir o tipo com `instanceof`:

```java
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
    c.buscarBolinha();
}
```

Se o objeto não for mesmo um `Cachorro`, o cast lança `ClassCastException`. No módulo Java Moderno você vai ver um jeito mais curto de escrever esse `if` (Java 16+).
