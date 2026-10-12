// verifica: java.poo.q16 e a aula heranca-e-polimorfismo (@Override acusa nome errado)
// espera: erro-de-compilacao
// erro-contem: method does not override or implement a method from a supertype
class Main {
    public static void main(String[] args) {
        System.out.println(new Cachorro().som());
    }
}

class Animal {
    String som() { return "..."; }
}

class Cachorro extends Animal {
    @Override
    String Som() { return "Au"; }
}
