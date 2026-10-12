// verifica: java.poo.q17 (super() implícito: Animal antes de Cachorro)
// saida:
// AC
class Main {
    public static void main(String[] args) {
        new Cachorro();
    }
}

class Animal {
    Animal() { System.out.print("A"); }
}

class Cachorro extends Animal {
    Cachorro() { System.out.print("C"); }
}
