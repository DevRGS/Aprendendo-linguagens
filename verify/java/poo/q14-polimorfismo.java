// verifica: java.poo.q14 (vale o método do objeto real)
// saida:
// Au
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        System.out.println(a.som());
    }
}

class Animal {
    String som() { return "..."; }
}

class Cachorro extends Animal {
    @Override
    String som() { return "Au"; }
}
