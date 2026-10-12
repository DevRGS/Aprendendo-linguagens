// verifica: java.poo.q16 (a sobrescrita acontece mesmo sem @Override)
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
    String som() { return "Au"; }
}
