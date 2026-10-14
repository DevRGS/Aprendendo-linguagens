// verifica: java.poo.q18 e a aula heranca-e-polimorfismo (no Java 21, super(...) depois de outra linha não compila)
// espera: erro-de-compilacao
// erro-contem: call to super must be first statement in constructor
class Main {
    public static void main(String[] args) {
        new Cachorro("Rex", "vira-lata");
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    String raca;

    Cachorro(String nome, String raca) {
        this.raca = raca;
        super(nome);
    }
}
