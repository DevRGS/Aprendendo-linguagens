// verifica: a aula heranca-e-polimorfismo (o construtor da superclasse roda primeiro)
// saida:
// AB
class Main {
    public static void main(String[] args) {
        new B();
    }
}

class A {
    A() { System.out.print("A"); }
}

class B extends A {
    B() { System.out.print("B"); }
}
