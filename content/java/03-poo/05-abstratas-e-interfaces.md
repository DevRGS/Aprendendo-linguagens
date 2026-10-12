# Classes abstratas e interfaces

## Classes abstratas

Algumas classes existem só para servir de base: não faz sentido criar uma "forma" qualquer, só retângulos, círculos etc. Uma classe **abstrata** não pode ser instanciada e pode ter métodos **abstratos**, sem corpo, que as subclasses são obrigadas a implementar.

```java
abstract class Forma {
    private String nome;

    Forma(String nome) {          // classe abstrata pode ter construtor
        this.nome = nome;
    }

    abstract double area();       // método abstrato: sem corpo

    String descrever() {          // método concreto: com corpo
        return nome + " com área " + area();
    }
}

class Retangulo extends Forma {
    private double largura;
    private double altura;

    Retangulo(double largura, double altura) {
        super("Retângulo");
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    double area() {
        return largura * altura;
    }
}
```

```java
Forma f = new Retangulo(3, 4);
System.out.println(f.descrever());  // Retângulo com área 12.0
Forma g = new Forma("?");           // não compila: Forma is abstract; cannot be instantiated
```

- Uma classe abstrata pode ter atributos, construtores e métodos com corpo, como uma classe comum.
- Toda subclasse **concreta** (não abstrata) precisa implementar todos os métodos abstratos. Se esquecer um, o código não compila: *Circulo is not abstract and does not override abstract method area() in Forma*.

## Interfaces

Uma **interface** define um contrato: o que uma classe sabe fazer, sem dizer como.

```java
interface Voador {
    void voar();      // public e abstract, mesmo sem escrever
}

interface Nadador {
    void nadar();
}

class Pato implements Voador, Nadador {
    @Override
    public void voar() { System.out.println("Pato voando"); }

    @Override
    public void nadar() { System.out.println("Pato nadando"); }
}
```

```java
Voador v = new Pato();   // a interface também serve de tipo
v.voar();                // Pato voando
```

- Uma classe estende **uma** classe, mas pode implementar **várias** interfaces.
- Métodos de interface são `public` mesmo sem escrever. Por isso, ao implementar, o método precisa ser `public`; sem isso, o `javac` acusa *attempting to assign weaker access privileges; was public*.

## O que mais cabe numa interface

```java
interface Saudacao {
    String PREFIXO = "Olá, ";              // constante: public static final

    String nome();                          // abstrato

    default String saudar() {               // Java 8+: tem corpo e é herdado
        return PREFIXO + formatar(nome());
    }

    static String saudacaoPadrao() {        // Java 8+: chamado pela interface
        return PREFIXO + "mundo";
    }

    private String formatar(String s) {     // Java 9+: ajuda os outros métodos
        return s.toUpperCase();
    }
}

class Visitante implements Saudacao {
    @Override
    public String nome() {
        return "Ana";
    }
}
```

```java
System.out.println(new Visitante().saudar());     // Olá, ANA
System.out.println(Saudacao.saudacaoPadrao());     // Olá, mundo
```

Uma interface não tem construtor nem atributos de instância: todo atributo declarado nela é uma constante (`public static final`).

## Abstrata ou interface?

| Característica | Classe abstrata | Interface |
|---|---|---|
| Quantas uma classe pode usar | uma (`extends`) | várias (`implements`) |
| Atributos de instância | pode ter | não tem (só constantes) |
| Construtor | pode ter | não tem |
| Ideia | "é um tipo de" (base comum) | "sabe fazer" (contrato) |

> [!TIP]
> Na dúvida, comece pela interface: ela não prende a classe a uma hierarquia, e a classe continua livre para estender outra.
